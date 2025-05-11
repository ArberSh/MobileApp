import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  getDocs,
  query,
  collection,
  where,
  updateDoc
} from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, username) {
    try {
      // We'll attempt to create the user first, then check if the username
      // conflicts during the Firestore document creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with username as displayName
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      // Before creating the document, let's check if this username exists
      // Note: This approach still has a small race condition window, but it's 
      // more likely to work with limited permissions
      try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username.trim().toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Username is taken, but we already created the auth account
          // We need to delete the auth account and throw an error
          await userCredential.user.delete();
          
          const customError = new Error("This username is already taken. Please choose another.");
          customError.code = "auth/username-already-in-use";
          throw customError;
        }
      } catch (checkError) {
        // If we encounter a permission error during the check, we'll proceed
        // and let Firebase handle potential conflicts during document creation
        if (!checkError.code || checkError.code !== "permission-denied") {
          throw checkError;
        }
        console.log("Note: Unable to check username uniqueness before account creation");
      }
      
      // Create user document in Firestore
      try {
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: username,
          email: email,
          username: username.trim().toLowerCase(), // Store lowercase for case-insensitivity
          createdAt: serverTimestamp(),
          isOnline: true,
          bio: "",
          profilePicture: null
        });
      } catch (firestoreError) {
        // If there's an error creating the firestore document,
        // delete the authentication user to prevent orphaned auth accounts
        await userCredential.user.delete();
        throw firestoreError;
      }
      
      return userCredential;
    } catch (error) {
      // Pass through any errors
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  function logout() {
    // Update online status in Firestore before signing out
    if (currentUser && currentUser.uid) {
      const userRef = doc(firestore, "users", currentUser.uid);
      updateDoc(userRef, { isOnline: false })
        .catch(error => console.error("Error updating online status:", error));
    }
    return signOut(auth);
  }
  
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  
  async function getUserProfile(uid) {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update online status
        await updateDoc(docRef, { isOnline: true });
        return docSnap.data();
      } else {
        console.warn(`User document not found for uid: ${uid}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  async function updateUserProfile(updates) {
    try {
      if (!currentUser || !currentUser.uid) throw new Error("No authenticated user");
      
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, updates);
      
      // If displayName is being updated, also update in Auth
      if (updates.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }
      
      // Update the currentUser state with the new data
      setCurrentUser(prev => ({...prev, ...updates}));
      
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            // Merge auth user and Firestore profile data
            setCurrentUser({ ...user, ...userProfile });
          } else {
            // No Firestore profile found, create one with basic info
            const newProfile = {
              uid: user.uid,
              displayName: user.displayName || '',
              email: user.email,
              username: user.email?.split('@')[0] || '',
              createdAt: serverTimestamp(),
              isOnline: true,
              bio: "",
              profilePicture: user.photoURL || null
            };
            
            await setDoc(doc(firestore, "users", user.uid), newProfile);
            setCurrentUser({ ...user, ...newProfile });
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          setCurrentUser(user); // Fallback to just auth user data
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}