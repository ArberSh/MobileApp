import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Account from "./Repeats/account";
import Groups from './Groups';
import Friends from "./Friends";


const Chats = () => {
  const Tab = createMaterialTopTabNavigator();

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{color: "white",
    fontSize: 32,
    fontFamily: "Poppins-Bold",}}>
          Chats
        </Text>
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