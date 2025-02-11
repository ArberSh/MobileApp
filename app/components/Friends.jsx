import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Account from "./Repeats/account";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Friends = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Account name="Aleks" text="Aleks: Hey I need your help" notification='2' image={"https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg"}/>
        <Account name="Mario" text="You: Actually i like it" image={"https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg"}/>
        <Account name="Arber" text="ngl hit hard" image={"https://wallpapers.com/images/hd/oscar-zahn-skeleton-headphones-unique-cool-pfp-rboah21ctf7m37o0.jpg"}/>
        <Account name="Makina" text="yo how did you do that" notification='10' image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVmRIWVvmruhUAHnOsuPJPocXeyqGyX4TcPQ&s"}/>
        <Account name="Helikopter" text="What's up " notification='1' image={"https://coin-images.coingecko.com/nft_contracts/images/15175/large/chill-guy-pfp.png?1732114825"}/>
        <Account name="Ligma" />
        <Account name="Karen" />
        <Account image={"data:image/jpeg;base64,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"}/>
        <Account image={"https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg"}/>
        <Account />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={()=>{navigation.navigate('CreateNewChat')}} // Add your action here
      >
        <View style={styles.fabContent}>
          <Ionicons name="add-outline" size={28} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    padding: 20,
    paddingBottom: 80, // Add space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00c9bd',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1, // Ensure it stays on top
  },
  fabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Friends;