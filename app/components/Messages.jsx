import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Account from "./Repeats/account";
import Groups from './Groups';
import Friends from "./Friends";
import { TextInput } from "react-native-gesture-handler";


const Chats = () => {
  const Tab = createMaterialTopTabNavigator();

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{color: "white",
    fontSize: 32,
    fontFamily: "Poppins-Bold",}}>
          Messages
        </Text>
        <View style={{
  flexDirection: 'row',
  backgroundColor: '#1E1E1E',
  alignItems: 'center',
  paddingHorizontal: 12,
  borderRadius: 8, 
  height: 40, 
  height:50
}}>
  <TextInput
    style={{
      flex: 1, 
      color: 'white',
      height: '100%',
      paddingVertical: 10,
      fontSize:16
    }}
          maxLength={30}
          placeholder="Search to message..."
          placeholderTextColor='gray'
          />
          <TouchableOpacity>
            <Ionicons name="search-outline" color='white' size={20}/>
          </TouchableOpacity>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.indicator,
          tabBarActiveTintColor: '#00c9bd',
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
    backgroundColor: "black",
  },
  tabBar: {
    backgroundColor: '#000',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  indicator: {
    backgroundColor: '#00c9bd',
    height: 2,
  },
});

export default Chats;