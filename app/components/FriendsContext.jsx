import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { doc, collection, getDocs, getDoc, query, where, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from './Auth';

// Create the context
export const FriendsContext = createContext();

// Hook to use the Friends context
export const useFriends = () => useContext(FriendsContext);

// Create a provider component
export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Load friends data from Firestore
  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setFriends([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Create a listener for the friends collection
      const friendsRef = collection(firestore, "users", currentUser.uid, "friends");
      
      const unsubscribe = onSnapshot(
        friendsRef,
        async (snapshot) => {
          try {
            const friendsPromises = snapshot.docs.map(async (docSnapshot) => {
              const friendData = docSnapshot.data();
              
              if (friendData.status === "accepted") {
                // Get the friend's user profile
                const userDocRef = doc(firestore, "users", friendData.userId);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                  return {
                    id: friendData.userId,
                    username: userDocSnap.data().username || '',
                    name: userDocSnap.data().displayName || '',
                    bio: userDocSnap.data().bio || '',
                    isOnline: userDocSnap.data().isOnline || false,
                    profilePicture: userDocSnap.data().profilePicture || null,
                    notification: 0,
                    chatType: 'direct',
                    status: friendData.status
                  };
                }
              } else if (friendData.status === "pending_received") {
                // This is for friend requests received
                const userDocRef = doc(firestore, "users", friendData.userId);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                  return {
                    id: friendData.userId,
                    username: userDocSnap.data().username || '',
                    name: userDocSnap.data().displayName || '',
                    bio: userDocSnap.data().bio || '',
                    profilePicture: userDocSnap.data().profilePicture || null,
                    status: friendData.status
                  };
                }
              }
              return null;
            });
            
            // Wait for all promises to resolve
            const friendsData = await Promise.all(friendsPromises);
            
            // Filter out null values and separate into friends and requests
            const acceptedFriends = friendsData.filter(friend => friend && friend.status === "accepted");
            const pendingFriendRequests = friendsData.filter(friend => friend && friend.status === "pending_received");
            
            setFriends(acceptedFriends);
            setPendingRequests(pendingFriendRequests);
            setLoading(false);
          } catch (err) {
            console.error("Error processing friends data: ", err);
            setError(err.message);
            setLoading(false);
          }
        },
        (err) => {
          console.error("Error getting friends: ", err);
          setError(err.message);
          setLoading(false);
        }
      );
      
      // Cleanup the listener on unmount
      return () => unsubscribe();
    } catch (e) {
      console.error("Error setting up friends listener: ", e);
      setError(e.message);
      setLoading(false);
    }
  }, [currentUser]);

  // Add a new friend request
  const sendFriendRequest = async (username) => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("You must be logged in to add friends");
      }
      
      // Find the user by username
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("username", "==", username.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      
      const targetUser = querySnapshot.docs[0];
      const targetUserId = targetUser.id;
      
      // Check if this is the current user
      if (targetUserId === currentUser.uid) {
        throw new Error("You cannot add yourself as a friend");
      }
      
      // Check if already friends or pending
      const friendDocRef = doc(firestore, "users", currentUser.uid, "friends", targetUserId);
      const friendDocSnap = await getDoc(friendDocRef);
      
      if (friendDocSnap.exists()) {
        const status = friendDocSnap.data().status;
        if (status === "accepted") {
          throw new Error("You are already friends with this user");
        } else if (status === "pending_sent") {
          throw new Error("Friend request already sent");
        } else if (status === "pending_received") {
          throw new Error("This user has already sent you a friend request");
        }
      }
      
      // Add to current user's friends collection as pending_sent
      await setDoc(friendDocRef, {
        userId: targetUserId,
        status: "pending_sent",
        createdAt: serverTimestamp()
      });
      
      // Add to target user's friends collection as pending_received
      const targetFriendDocRef = doc(firestore, "users", targetUserId, "friends", currentUser.uid);
      await setDoc(targetFriendDocRef, {
        userId: currentUser.uid,
        status: "pending_received",
        createdAt: serverTimestamp()
      });
      
      // Add notification for the target user
      const notificationRef = collection(firestore, "users", targetUserId, "notifications");
      await addDoc(notificationRef, {
        type: "friend_request",
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName,
        read: false,
        createdAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (friendId) => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("You must be logged in to accept friend requests");
      }
      
      // Update status in both user's friends collections
      const currentUserFriendRef = doc(firestore, "users", currentUser.uid, "friends", friendId);
      const friendUserRef = doc(firestore, "users", friendId, "friends", currentUser.uid);
      
      // First, verify the current friend request exists and has pending_received status
      const friendRequestSnap = await getDoc(currentUserFriendRef);
      if (!friendRequestSnap.exists()) {
        throw new Error("Friend request not found");
      }
      
      const friendRequestData = friendRequestSnap.data();
      if (friendRequestData.status !== "pending_received") {
        throw new Error("Invalid friend request status");
      }
      
      // Update current user's friend document
      await updateDoc(currentUserFriendRef, {
        status: "accepted",
        updatedAt: serverTimestamp()
      });
      
      // Update the friend's document
      await updateDoc(friendUserRef, {
        status: "accepted",
        updatedAt: serverTimestamp()
      });
      
      // Add notification for the accepted user
      const notificationRef = collection(firestore, "users", friendId, "notifications");
      await addDoc(notificationRef, {
        type: "friend_request_accepted",
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName,
        read: false,
        createdAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  };

  // Decline a friend request
  const declineFriendRequest = async (friendId) => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("You must be logged in to decline friend requests");
      }
      
      // Delete from both users' friends collections
      const currentUserFriendRef = doc(firestore, "users", currentUser.uid, "friends", friendId);
      const friendUserRef = doc(firestore, "users", friendId, "friends", currentUser.uid);
      
      await deleteDoc(currentUserFriendRef);
      await deleteDoc(friendUserRef);
      
      return true;
    } catch (error) {
      console.error("Error declining friend request:", error);
      throw error;
    }
  };

  // Remove a friend
  const removeFriend = async (friendId) => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("You must be logged in to remove friends");
      }
      
      // Delete from both users' friends collections
      const currentUserFriendRef = doc(firestore, "users", currentUser.uid, "friends", friendId);
      const friendUserRef = doc(firestore, "users", friendId, "friends", currentUser.uid);
      
      await deleteDoc(currentUserFriendRef);
      await deleteDoc(friendUserRef);
      
      // Update local state
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
      
      return true;
    } catch (error) {
      console.error("Error removing friend:", error);
      throw error;
    }
  };

  // Find users by username (for adding friends)
  const findUsersByUsername = async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.length < 3) {
        return []; // Require at least 3 characters to search
      }
      
      const usersRef = collection(firestore, "users");
      
      // Search by username
      const usernameQuery = query(
        usersRef, 
        where("username", ">=", searchTerm.toLowerCase()),
        where("username", "<=", searchTerm.toLowerCase() + '\uf8ff')
      );
      
      const usernameSnapshot = await getDocs(usernameQuery);
      
      // Process results
      const results = usernameSnapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username || "",
        name: doc.data().displayName || "",
        bio: doc.data().bio || "",
        profilePicture: doc.data().profilePicture || null
      }));
      
      // Filter out the current user
      return results.filter(user => user.id !== currentUser?.uid);
    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  };

  // Get all friend requests
  const getFriendRequests = () => {
    return pendingRequests;
  };

  // Set a friend's online status
  const setFriendOnlineStatus = (friendId, isOnline) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === friendId ? { ...friend, isOnline } : friend
      )
    );
  };

  // Update notification count for a friend
  const updateNotification = (friendId, count) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => {
        if (friend.id === friendId) {
          const newCount = (friend.notification || 0) + count;
          return { ...friend, notification: newCount < 0 ? 0 : newCount };
        }
        return friend;
      })
    );
  };

  // Clear notifications for a friend
  const clearNotifications = (friendId) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === friendId ? { ...friend, notification: 0 } : friend
      )
    );
  };

  // Context value
  const value = {
    friends,
    pendingRequests,
    loading,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    findUsersByUsername,
    getFriendRequests,
    setFriendOnlineStatus,
    updateNotification,
    clearNotifications
  };

  return (
    <FriendsContext.Provider value={value}>
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsProvider;