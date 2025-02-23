// Groups.jsx
import React, { useEffect, useState } from 'react';
import { View,Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Account from "./Repeats/account";
import { Ionicons } from '@expo/vector-icons';

const Groups = () => {

    const { height } = Dimensions.get('window'); 

        const [dimensions, setDimensions] = useState({
          heightWindow: height,
        });
      
        useEffect(() => {
          const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({ heightWindow: window.height }); 
          });
      
          return () => subscription?.remove(); 
        }, []);
      
        console.log('Window Height222:', dimensions.heightWindow);

  return (
    <View style={{
      flex:1,
      backgroundColor:'black'
    }}>

    <ScrollView style={{padding: 20,
        backgroundColor: 'black',
      }} >
      <Account name="Work Team" text="Project discussion" notification='5' image={"https://example.com/group1.jpg"}/>
      <Account name="Math Team" text="Project discussion"  image={"https://example.com/group1.jpg"}/>
      <Account name="Biology Team" text="Project discussion" image={"https://example.com/group1.jpg"}/>
      
    </ScrollView>
    <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('Add friend pressed')} // Add your action here
        >
        <View style={styles.fabContent}>
          <Ionicons name="add-outline" size={28} color="white" />
        </View>
      </TouchableOpacity>
        </View>
    
  );
};

const styles = StyleSheet.create({
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
        elevation: 4, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 1,
      },
      fabContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default Groups;