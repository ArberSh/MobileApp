import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Account from './Repeats/account'
import Checkbox from 'expo-checkbox';

const CreateNewChat = () => {
  // Track selected accounts using an object with account identifiers
  const [selectedAccounts, setSelectedAccounts] = useState({});

  // Handle checkbox toggle for specific account
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
      <View>
        <Text style={{
          color: "white",
          fontSize: 32,
          fontFamily: "Poppins-Bold",
          paddingHorizontal: 20
        }}>
          Create Chat with...
        </Text>
      </View>
      <ScrollView style={{
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
          { id: 'makina', name: "Makina",  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVmRIWVvmruhUAHnOsuPJPocXeyqGyX4TcPQ&s" },
          { id: 'helikopter', name: "Helikopter",  image: "https://coin-images.coingecko.com/nft_contracts/images/15175/large/chill-guy-pfp.png?1732114825" },
          { id: 'ligma', name: "Ligma" },
          { id: 'karen', name: "Karen" },
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

const styles = StyleSheet.create({
  checkbox: {
    marginLeft: 10,
    marginRight: 20
  }
});

export default CreateNewChat;