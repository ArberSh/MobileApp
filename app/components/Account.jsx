import React, { useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Clipboard, ToastAndroid, Platform, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Text from './CustomText';
import LetterAvatar from './LetterAvatar';
import { useTheme } from './ThemeContext';
import { useAuth } from './Auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const AccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = Dimensions.get('window');
  const [dimensions, setDimensions] = useState({ widthWindow: width });
  const { colors, isDark } = useTheme();
  const { currentUser, logout } = useAuth();

  // Get profile updates from navigation params if available
  const updatedProfile = route.params?.updatedProfile;
  
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Lexend': require('../assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  // Load user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser && currentUser.uid) {
          // Fetch the latest user data from Firestore to ensure we have the most up-to-date information
          const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Set user data from Firestore document
            setDisplayName(userData.displayName || '');
            setUsername(userData.username || '');
            setBio(userData.bio || '');
            
            // Set profile image if it exists
            setProfileImage(userData.profilePicture || null);
          } else {
            console.warn("User document not found in Firestore");
            // Fallback to auth user data
            setDisplayName(currentUser.displayName || '');
            setUsername(currentUser.email?.split('@')[0] || '');
            setProfileImage(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Update profile if coming back from edit screen
  useEffect(() => {
    if (updatedProfile) {
      if (updatedProfile.image) setProfileImage(updatedProfile.image);
      if (updatedProfile.name) setDisplayName(updatedProfile.name);
      if (updatedProfile.bio !== undefined) setBio(updatedProfile.bio);
    }
  }, [updatedProfile]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ widthWindow: window.width });
    });
    return () => subscription?.remove();
  }, []);

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
        setLoading(true);
        
        try {
          const uri = result.assets[0].uri;
          const response = await fetch(uri);
          const blob = await response.blob();
          
          // Create a reference in Firebase Storage
          const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
          
          // Upload image
          await uploadBytes(storageRef, blob);
          
          // Get download URL
          const downloadURL = await getDownloadURL(storageRef);
          
          // Update user document in Firestore
          const userRef = doc(firestore, "users", currentUser.uid);
          await updateDoc(userRef, {
            profilePicture: downloadURL
          });
          
          // Update local state
          setProfileImage(downloadURL);
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Error", "Failed to upload image. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const removeProfilePicture = async () => {
    try {
      if (!currentUser || !currentUser.uid) return;
      
      setLoading(true);
      
      // Update user document in Firestore to remove profile picture
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        profilePicture: null
      });
      
      // Update local state
      setProfileImage(null);
      
      Alert.alert("Success", "Profile picture removed");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      Alert.alert("Error", "Failed to remove profile picture");
    } finally {
      setLoading(false);
    }
  };

  const copyUsername = () => {
    if (!username) return;
    
    Clipboard.setString(username);
    
    // Show feedback that username was copied
    if (Platform.OS === 'android') {
      ToastAndroid.show('Username copied to clipboard', ToastAndroid.SHORT);
    } else {
      // For iOS, we'll use our own visual indicator
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const navigateToEditProfile = () => {
    // Navigate to EditProfile screen passing current profile data
    navigation.navigate('EditProfile', {
      profileData: {
        image: profileImage,
        name: displayName,
        username: username,
        bio: bio
      }
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const MenuOption = ({ icon, iconLibrary = 'Ionicons', title, onPress, color = colors.text, rightIcon = true }) => {
    const IconComponent = iconLibrary === 'Ionicons' ? Ionicons : Feather;
    
    return (
      <TouchableOpacity 
        style={[styles.menuOption, { backgroundColor: colors.input }]} 
        onPress={onPress}
      >
        <View style={styles.menuOptionLeft}>
          <IconComponent name={icon} size={22} color={color} />
          <Text style={[styles.menuOptionText, { color }]}>{title}</Text>
        </View>
        {rightIcon && <Ionicons name='chevron-forward-outline' size={22} color={color} />}
      </TouchableOpacity>
    );
  };

  // Render profile picture or letter avatar
  const renderProfilePicture = () => {
    if (profileImage) {
      return (
        <Image
          style={[styles.profileImage, { borderColor: colors.cardBackground }]}
          source={{ uri: profileImage }}
        />
      );
    } else {
      return (
        <LetterAvatar 
          name={displayName} 
          size={110} 
          borderWidth={3} 
          borderColor={colors.cardBackground}
          style={styles.profileImage}
        />
      );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          {renderProfilePicture()}
          <TouchableOpacity 
            style={styles.editImageButton} 
            onPress={profileImage ? removeProfilePicture : pickImage} 
            disabled={loading}
          >
            <Feather name={profileImage ? "trash-2" : "camera"} size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.nameText, { color: colors.text }]}>{displayName}</Text>
        <View style={styles.usernameContainer}>
          <TouchableOpacity onPress={copyUsername} style={styles.usernameTouchable}>
            <Text style={styles.usernameText}>@{username}</Text>
          </TouchableOpacity>
          {showCopied && (
            <View style={styles.copiedToast}>
              <Text style={styles.copiedText}>Copied!</Text>
            </View>
          )}
        </View>
        
        <View style={[styles.bioContainer, { backgroundColor: colors.cardBackground }]}>
          {isEditingBio ? (
            <TextInput
              style={[styles.bioInput, { color: colors.text }]}
              multiline
              value={bio}
              onChangeText={setBio}
              placeholder="Add your bio"
              placeholderTextColor={colors.subText}
              autoFocus
            />
          ) : (
            <>
              <Text style={[styles.bioTitle, { color: colors.text }]}>About Me</Text>
              <Text style={[styles.bioText, { color: colors.text }]}>{bio || "Add a bio to tell people about yourself"}</Text>
            </>
          )}
          
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={[styles.menuSectionTitle, { color: colors.subText }]}>Account</Text>
        <MenuOption 
          icon="edit-2" 
          iconLibrary="Feather" 
          title="Edit Profile" 
          onPress={navigateToEditProfile}
          />
        
        <Text style={[styles.menuSectionTitle, { color: colors.subText }]}>Settings</Text>
        <MenuOption 
          icon="color-palette-outline" 
          title="Appearance" 
          onPress={() => navigation.navigate('Appearance')}
          />
        <MenuOption 
          icon="settings-outline" 
          title="Accessibility" 
          onPress={() => navigation.navigate('Test')}
          />
        
        <Text style={[styles.menuSectionTitle, { color: colors.subText }]}>Actions</Text>
        <MenuOption 
          icon="exit-outline" 
          title="Log Out" 
          color={colors.danger} 
          onPress={handleLogout}
          />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.subText }]}>Version 1.0.3</Text>
      </View>
    </ScrollView>
</>
  );
};

const styles = StyleSheet.create({
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
    fontFamily:'Lexend-Bold',
    fontSize: 30,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2e71e5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Lexend-Bold',
  },
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  usernameTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  usernameText: {
    color: '#2e71e5',
    fontSize: 18,
    fontFamily: 'Lexend',
  },
  copyIcon: {
    marginLeft: 6,
    opacity: 0.8,
  },
  copiedToast: {
    position: 'absolute',
    top: -24,
    backgroundColor: 'rgba(46, 113, 229, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    zIndex: 100,
    alignSelf: 'center',
  },
  copiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Lexend-Medium',
  },
  bioContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    position: 'relative',
  },
  bioTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Lexend-Bold',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Lexend',
  },
  bioInput: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    padding: 0,
    fontFamily: 'Lexend',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 8,
    fontFamily: 'Lexend-SemiBold',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Lexend',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Lexend',
  },
});

export default AccountScreen;