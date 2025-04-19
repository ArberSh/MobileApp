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
  Platform
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
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

const EditProfileScreen = () => {
  // Move useTheme inside the component
  const { colors, isDark } = useTheme();
  
  const navigation = useNavigation();
  const route = useRoute();
  
  // Receive props from AccountScreen
  const { profileData } = route.params || {
    profileData: {
      image: 'https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg',
      name: 'Arber Shaska',
      username: 'arbershaska',
      bio: 'Mobile app developer passionate about creating beautiful UI experiences. Working with React Native & Flutter.'
    }
  };

  // Initialize state with passed data
  const [profileImage, setProfileImage] = useState(profileData.image);
  const [name, setName] = useState(profileData.name);
  const [username, setUsername] = useState(profileData.username);
  const [bio, setBio] = useState(profileData.bio);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { width } = Dimensions.get('window');
  const [dimensions, setDimensions] = useState({ widthWindow: width });
  const [fontsLoaded] = useFonts({
    'Lexend': require('../assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ widthWindow: window.width });
    });
    return () => subscription?.remove();
  }, []);

  const handleSave = () => {
    // Here you would typically save the data to your backend
    // For now, we'll just navigate back with the new data
    navigation.navigate('pagechat', {
      screen: 'Account',
      params: {
        updatedProfile: {
          image: profileImage,
          name: name,
          username: username, // Note: username isn't editable
          bio: bio
        }
      }
    });
  };

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
      // After picking an image, close the zoomed view if we're in it
      if (isImageZoomed) {
        setIsImageZoomed(false);
      }
    }
  };

  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed);
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="close-outline" size={28} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
      <TouchableOpacity onPress={handleSave}>
        <Text style={styles.saveButton}>Save</Text>
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
        <Image
          source={{ uri: profileImage }}
          style={styles.zoomedImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={[styles.zoomedImageActions, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity style={styles.imageAction} onPress={pickImage}>
          <View style={styles.imageActionIconContainer}>
            <Feather name="camera" size={22} color="white" />
          </View>
          <Text style={[styles.imageActionText, { color: colors.text }]}>Gallery</Text>
        </TouchableOpacity>
        
        {profileImage !== profileData.image && (
          <TouchableOpacity 
            style={styles.imageAction} 
            onPress={() => setProfileImage(profileData.image)}
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
            <Image
              style={[styles.profileImage, { borderColor: colors.cardBackground }]}
              source={{ uri: profileImage }}
            />
            <View style={styles.editImageButton}>
              <Feather name="camera" size={18} color="white" />
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
          </View>

          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: colors.subText }]}>Username</Text>
            <View style={[styles.usernameContainer, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.usernamePrefix, { color: colors.subText }]}>@</Text>
              <Text style={[styles.usernameText, { color: colors.subText }]}>{username}</Text>
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
            />
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