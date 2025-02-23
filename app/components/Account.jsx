import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

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
  const { width } = Dimensions.get('window');
  const [dimensions, setDimensions] = useState({ widthWindow: width });
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg');

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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.profileImage}
              source={{ uri: profileImage }}
            />
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <View style={styles.editButtonInner}>
                <Feather name="edit-2" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.nameText}>Arber Shaska</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>arbershaska1@gmail.com</Text>
        </View>
      </View>
      <View style={{marginTop:20,paddingTop:10,borderTopColor:'gray',borderWidth:2}}>
      <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:16}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Feather name="edit-2" size={24} color="white" />
          <Text style={{color:'white',paddingHorizontal:10,fontSize:18}}>Edit Profile</Text>
          </View>
            <Ionicons name='chevron-forward-outline' size={24} color='white'></Ionicons> 
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:40}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Ionicons name="card-outline" size={24} color="white" />
          <Text style={{color:'white',paddingHorizontal:10,fontSize:18}}>Subscriptions</Text>
          </View>
            <Ionicons name='chevron-forward-outline' size={24} color='white'></Ionicons> 
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:40}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Ionicons name="help-outline" size={24} color="white" />
          <Text style={{color:'white',paddingHorizontal:10,fontSize:18}}>Support</Text>
          </View>
            <Ionicons name='chevron-forward-outline' size={24} color='white'></Ionicons> 
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:40}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={{color:'white',paddingHorizontal:10,fontSize:18}}>Settings</Text>
          </View>
            <Ionicons name='chevron-forward-outline' size={24} color='white'></Ionicons> 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('register')}} style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:40}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Ionicons name="exit-outline" size={24} color="#ff3939" />
          <Text style={{color:'#ff3939',paddingHorizontal:10,fontSize:18}}>Log Out</Text>
          </View>
            <Ionicons name='chevron-forward-outline' size={24} color='#ff3939'></Ionicons> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 38,
    zIndex: 2,
  },
  editButtonInner: {
    backgroundColor: '#1E1E1E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailContainer: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emailText: {
    color: '#bfbfbf',
    fontSize: 16,
  },
});

export default AccountScreen;