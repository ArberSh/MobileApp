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
        <Account name="Arber" text="Arber: Hello, How are you" image={"https://wallpapers.com/images/hd/oscar-zahn-skeleton-headphones-unique-cool-pfp-rboah21ctf7m37o0.jpg"}/>
        <Account name="John" text="You: yo how did you do that" notification='10' image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVmRIWVvmruhUAHnOsuPJPocXeyqGyX4TcPQ&s"}/>
        <Account name="Kevin" text="Kevin: What's up " notification='1' image={"https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"}/>
        <Account name="Laura" text="Laura: hii" />
        <Account name="Maria" />
        <Account name='User1' image={"https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/237140455/original/a3ff1f2f90f5d52cec530bc529fbcf169a6cb9d6/draw-a-simple-aesthetics-pfp-or-lock-screen-image-for-you.png"}/>
        <Account name='User4' image={"https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg"}/>
        <Account name='User19' />
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
    paddingTop:0,
    paddingBottom: 80, 
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