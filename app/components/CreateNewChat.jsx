import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import Account from './Repeats/account'
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CreateNewChat = () => {
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const navigation = useNavigation();

  const handleCheckboxToggle = (accountId) => {
    setSelectedAccounts(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  return (
    <View style={{
      paddingVertical: 30,
      paddingHorizontal:20,
      flex: 1,
      backgroundColor: '#1E1E1E'
    }}>
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      
      </View>
      <View>
        <Text style={{
          color: "white",
          fontSize: 26,
          fontFamily: "Poppins-Bold",
          textAlign:'center'
        }}>
         Add Friend
        </Text>
        <Text style={{
          color: "#6E6E6E",
          fontSize: 14,
          fontFamily: "Poppins-Bold",
          textAlign:'center'
        }}>
          Enter a username to send them a request.
        </Text>
        <View style={{
          marginTop:16,
        }}>
          <Text style={{
            color:'white',
            fontSize:14,
          fontFamily: "Poppins-Bold",
          }}>
            Username
          </Text>
          <View>
            <Ionicons name="at-outline" size={24} color="#5E5E5E"/>
          </View>
          <TextInput style={{
            backgroundColor:'#5E5E5E',
            padding:10,
            borderRadius:10,
            color:'white',
            fontSize:16,
          }}>

          </TextInput>
        </View>
      </View>
      
    </View>
  )
}

export const styles = StyleSheet.create({
  checkbox: {
    paddingRight:100
  }
});

export default CreateNewChat;