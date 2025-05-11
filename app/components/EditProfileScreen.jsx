import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert,
  ScrollView, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Text from './CustomText';
import LetterAvatar from './LetterAvatar';
import { useTheme } from './ThemeContext';
import { useAuth } from './Auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore, storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';


const getPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos to change your profile picture');
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error getting permission:", error);
    return false;
  }
};

const EditProfileScreen = () => {
  // Move useTheme inside the component
  const { colors, isDark } = useTheme();
  const { currentUser } = useAuth();
  
  const navigation = useNavigation();
  const route = useRoute();
  
  // Receive props from AccountScreen with fallback defaults
  const { profileData } = route.params || {
    profileData: {
      image: null,
      name: '',
      username: '',
      bio: ''
    }
  };

  // Initialize state with passed data
  const [profileImage, setProfileImage] = useState(profileData?.image || null);
  const [name, setName] = useState(profileData?.name || '');
  const [username, setUsername] = useState(profileData?.username || '');
  const [bio, setBio] = useState(profileData?.bio || '');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    bio: ''
  });

  const { width } = Dimensions.get('window');
  const [dimensions, setDimensions] = useState({ widthWindow: width });
  const [fontsLoaded] = useFonts({
    'Lexend': require('../assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  // Fetch user data on component mount to ensure we have the latest info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser && currentUser.uid) {
          const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Only update state if we don't already have values from profileData
            if (!profileData || Object.keys(profileData).length === 0) {
              if (userData.profilePicture) {
                setProfileImage(userData.profilePicture);
              } else {
                setProfileImage(null);
              }
              if (userData.displayName) {
                setName(userData.displayName);
              }
              if (userData.username) {
                setUsername(userData.username);
              }
              if (userData.bio !== undefined) {
                setBio(userData.bio);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ widthWindow: window.width });
    });
    return () => subscription?.remove();
  }, []);

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', bio: '' };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Bio validation (optional)
    if (bio.length > 150) {
      newErrors.bio = 'Bio cannot exceed 150 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Check if there's a current user and user ID
      if (!currentUser || !currentUser.uid) {
        console.error("No authenticated user found");
        Alert.alert("Error", "You must be logged in to update your profile");
        setLoading(false);
        return;
      }

      // Reference to the user document in Firestore
      const userRef = doc(firestore, "users", currentUser.uid);
      
      // If profile image has been changed and is a local file, upload it first
      let imageUrl = profileImage;
      
      if (profileImage && profileImage !== profileData.image && profileImage.startsWith('file://')) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        
        // Create a reference in Firebase Storage
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/profile_image.jpg`);
        
        // Upload image
        await uploadBytes(storageRef, blob);
        
        // Get download URL
        imageUrl = await getDownloadURL(storageRef);
      } else if (profileImage === null && profileData.image) {
        // User has removed their profile picture
        // Try to delete the old image from storage if it exists
        try {
          const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
          await deleteObject(storageRef);
        } catch (error) {
          // It's okay if this fails, maybe the image doesn't exist
          console.log("No existing profile picture to delete");
        }
      }
      
      // Update the user document in Firestore
      await updateDoc(userRef, {
        displayName: name,
        bio: bio,
        profilePicture: imageUrl
      });
      
      // Use the auth object directly instead of currentUser for updating profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
      } else {
        console.warn("No auth.currentUser available for profile update");
      }
      
      // Navigate back with updated profile data
      navigation.navigate('pagechat', {
        screen: 'Account',
        params: {
          updatedProfile: {
            image: imageUrl,
            name: name,
            bio: bio
          }
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const hasPermission = await getPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        // After picking an image, close the zoomed view if we're in it
        if (isImageZoomed) {
          setIsImageZoomed(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const removeProfilePicture = () => {
    setProfileImage(null);
    if (isImageZoomed) {
      setIsImageZoomed(false);
    }
  };

  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed);
  };

  // Render error message
  const renderErrorMessage = (errorText) => {
    if (!errorText) return null;
    return (
      <Text style={styles.errorText}>{errorText}</Text>
    );
  };

  // Render the profile picture or letter avatar
  const renderProfilePicture = (size, borderWidth = 3) => {
    if (profileImage) {
      return (
        <Image
          style={[styles.profileImage, { borderColor: colors.cardBackground, width: size, height: size, borderRadius: size/2, borderWidth }]}
          source={{ uri: profileImage }}
        />
      );
    } else {
      return (
        <LetterAvatar 
          name={name} 
          size={size} 
          borderWidth={borderWidth}
          borderColor={colors.cardBackground} 
          style={{ width: size, height: size, borderRadius: size/2 }}
        />
      );
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="close-outline" size={28} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
      <TouchableOpacity onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#2e71e5" />
        ) : (
          <Text style={styles.saveButton}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderZoomedImage = () => (
    <View style={[styles.zoomedImageContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.zoomedImageHeader, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity onPress={toggleImageZoom}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.zoomedHeaderTitle, { color: colors.text }]}>Profile photo</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.zoomedImageContent}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.zoomedImage}
            resizeMode="contain"
          />
        ) : (
          <LetterAvatar
            name={name}
            size={200}
            borderWidth={0}
            style={styles.zoomedImage}
          />
        )}
      </View>
      
      <View style={[styles.zoomedImageActions, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity style={styles.imageAction} onPress={pickImage}>
          <View style={styles.imageActionIconContainer}>
            <Feather name="camera" size={22} color="white" />
          </View>
          <Text style={[styles.imageActionText, { color: colors.text }]}>Gallery</Text>
        </TouchableOpacity>
        
        {profileImage && (
          <TouchableOpacity 
            style={styles.imageAction} 
            onPress={removeProfilePicture}
          >
            <View style={[styles.imageActionIconContainer, { backgroundColor: colors.danger }]}>
              <Feather name="trash-2" size={22} color="white" />
            </View>
            <Text style={[styles.imageActionText, { color: colors.text }]}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEditForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={toggleImageZoom}
          >
            {renderProfilePicture(120)}
            <View style={styles.editImageButton}>
              <Feather name={profileImage ? "edit-2" : "camera"} size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: colors.subText }]}>Name</Text>
            <TextInput
              style={[styles.formInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.subText}
            />
            {renderErrorMessage(errors.name)}
          </View>

          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: colors.subText }]}>Username</Text>
            <View style={[styles.usernameContainer, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.usernamePrefix, { color: colors.subText }]}>@</Text>
              <Text style={[styles.usernameText, { color: colors.text }]}>{username}</Text>
            </View>
            <Text style={[styles.usernameNote, { color: colors.subText }]}>Username cannot be changed</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: colors.subText }]}>Bio</Text>
            <TextInput
              style={[
                styles.formInput, 
                styles.bioInput, 
                { backgroundColor: colors.cardBackground, color: colors.text }
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Add your bio"
              placeholderTextColor={colors.subText}
              multiline
              numberOfLines={4}
              maxLength={150}
            />
            <Text style={[styles.characterCount, { color: colors.subText }]}>
              {bio.length}/150
            </Text>
            {renderErrorMessage(errors.bio)}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      {isImageZoomed ? (
        <>
          {renderZoomedImage()}
        </>
      ) : (
        <>
          {renderHeader()}
          {renderEditForm()}
        </>
      )}
    </View>
  );
};

// Create styles without hardcoded colors
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Lexend-Bold',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    color: '#2e71e5',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lexend-Medium',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2e71e5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Add padding at bottom for better scrolling
  },
  formItem: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 4,
    fontFamily: 'Lexend-Medium',
  },
  formInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
  },
  usernamePrefix: {
    fontSize: 16,
    marginRight: 2,
    fontFamily: 'Lexend',
  },
  usernameText: {
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  usernameNote: {
    fontSize: 12,
    marginTop: 8,
    paddingLeft: 4,
    fontFamily: 'Lexend',
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Lexend',
  },
  errorText: {
    color: '#ff6347',
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
    fontFamily: 'Lexend',
  },
  
  // Zoomed image styles
  zoomedImageContainer: {
    flex: 1,
  },
  zoomedImageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  zoomedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lexend-Medium',
  },
  zoomedImageContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: '90%',
    height: '90%',
    borderRadius: 8,
  },
  zoomedImageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  imageAction: {
    alignItems: 'center',
  },
  imageActionIconContainer: {
    backgroundColor: '#2e71e5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageActionText: {
    fontSize: 14,
    fontFamily: 'Lexend',
  },
});

export default EditProfileScreen;