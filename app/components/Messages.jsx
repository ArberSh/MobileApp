import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Account from "./Repeats/account";
import Groups from './Groups';
import Friends from "./Friends";
import { TextInput } from "react-native-gesture-handler";
import Text from './CustomText';


const Chats = () => {
  const Tab = createMaterialTopTabNavigator();

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{color: "white",
    fontSize: 32,
    fontFamily:'Lexend-Bold',}}>
          Messages
        </Text>
        
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.indicator,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        
        <Tab.Screen 
          name="Friends" 
          component={Friends}
          options={{ title: 'Friends' }}
        />
        <Tab.Screen 
          name="Groups" 
          component={Groups}
          options={{ title: 'Groups' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1D20",
  },
  tabBar: {
    backgroundColor: '#1C1D20',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    textTransform: 'capitalize',
  },
  indicator: {
    backgroundColor: 'white',
    height: 2,
  },
});

export default Chats;