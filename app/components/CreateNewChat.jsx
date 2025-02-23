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
      flex: 1,
      backgroundColor: 'black'
    }}>
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:20,
        paddingVertical:10
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#00c9bd" />
        </TouchableOpacity>
        <Text style={{
          color: "white",
          fontSize: 26,
          fontFamily: "Poppins-Bold",
          paddingHorizontal: 20
        }}>
          Create a new chat
        </Text>
      </View>
      <View>
        <View style={{marginHorizontal:20,flexDirection:'row',alignItems:'center',borderColor:'#00c9bd',borderWidth:1,borderRadius:6,padding:6}}>
          <Ionicons name="person" size={30} color="#00c9bd"></Ionicons>
        <TextInput style={{paddingHorizontal:10,color:'white',}}></TextInput>
        </View>
      </View>
      <ScrollView style={{
        width:'100%',
        paddingHorizontal: 10,
        paddingBottom: 80,
      }}>
        {/* Account 1 */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Account 
            name="Aleks" 
            image={"https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg"} 
          />
          <Checkbox 
            style={styles.checkbox} 
            value={selectedAccounts.aleks || false} 
            onValueChange={() => handleCheckboxToggle('aleks')} 
          />
        </View>

        {/* Account 2 */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Account 
            name="Mario" 
            image={"https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg"} 
          />
          <Checkbox 
            style={styles.checkbox} 
            value={selectedAccounts.mario || false} 
            onValueChange={() => handleCheckboxToggle('mario')} 
          />
        </View>

        {[
          { id: 'arber', name: "Arber",  image: "https://wallpapers.com/images/hd/oscar-zahn-skeleton-headphones-unique-cool-pfp-rboah21ctf7m37o0.jpg" },
          { id: 'user1', name: "user1",  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVmRIWVvmruhUAHnOsuPJPocXeyqGyX4TcPQ&s" },
          { id: 'user2', name: "user2" },
          { id: 'user4', name: "user4" },
          { id: 'karen', name: "user11" },
        ].map((account) => (
          <View key={account.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Account {...account} />
            <Checkbox
              style={styles.checkbox}
              value={selectedAccounts[account.id] || false}
              onValueChange={() => handleCheckboxToggle(account.id)}
            />
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

export const styles = StyleSheet.create({
  checkbox: {
    paddingRight:100
  }
});

export default CreateNewChat;