import React, { useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, TextInput, Clipboard, ToastAndroid, Platform } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const getPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please allow access to your photos to change your profile picture');
    return false;
  }
  return true;
};

const AccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = Dimensions.get('window');
  const [dimensions, setDimensions] = useState({ widthWindow: width });
  const { colors, isDark } = useTheme(); // Use the theme

  // Get profile updates from navigation params if available
  const updatedProfile = route.params?.updatedProfile;
  
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg');
  const [displayName, setDisplayName] = useState('Arber Shaska');
  const [username, setUsername] = useState('arbershaska');
  const [bio, setBio] = useState('Mobile app developer passionate about creating beautiful UI experiences. Working with React Native & Flutter.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const [fontsLoaded] = useFonts({
    'Lexend': require('../assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  // Update profile if coming back from edit screen
  useEffect(() => {
    if (updatedProfile) {
      setProfileImage(updatedProfile.image);
      setDisplayName(updatedProfile.name);
      setBio(updatedProfile.bio);
    }
  }, [updatedProfile]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ widthWindow: window.width });
    });
    return () => subscription?.remove();
  }, []);

  const pickImage = async () => {
    const hasPermission = await getPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const copyUsername = () => {
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
          <Image
            style={[styles.profileImage, { borderColor: colors.cardBackground }]}
            source={{ uri: profileImage }}
          />
          <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
            <Feather name="camera" size={18} color="white" />
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
          onPress={() => navigation.navigate('register')}
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
  },
  bioText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  bioInput: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    padding: 0,
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
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
  },
});

export default AccountScreen;