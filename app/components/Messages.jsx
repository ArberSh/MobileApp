import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Account from "./Repeats/account";
import Groups from './Groups';
import Friends from "./Friends";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from './ThemeContext'; // Import theme hook
import Text from './CustomText';

const Chats = () => {
  const Tab = createMaterialTopTabNavigator();
  const { colors } = useTheme(); // Get theme colors
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.headerBackground }]}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{
          fontSize: 32,
          fontFamily:'Lexend-Bold',
          color:colors.text
        }}>
          Messages
        </Text>
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.headerBackground }],
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: [styles.indicator, { backgroundColor: colors.text }],
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.subText,
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
  },
  tabBar: {
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
    height: 2,
  },
});

export default Chats;