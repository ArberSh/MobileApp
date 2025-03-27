import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Introduction from './components/introduction';
import Login from './components/login';
import Register from './components/register';
import PageChat from './components/PageChat';
import FriendsScreen from './components/Messages';
import AccountScreen from './components/Account'; 
import SplashScreen from '../SplashScreenView';
import Ionicons from '@expo/vector-icons/Ionicons';
import Tasks from './components/Tasks';
import { StatusBar } from 'react-native'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateNewChat from './components/CreateNewChat';
import ChatRoom from './components/ChatRoom';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This is the component for the bottom tabs
const TabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } 

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#00c9bd',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          backgroundColor: '#1C1D20',
          height: 80, 
          paddingBottom: 8, 
          paddingTop: 8, 
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 60, 
          margin: 4, 
        },
        tabBarLabelStyle: {
          fontSize: 12, 
          marginBottom: 8, 
          fontFamily: 'Poppins-Medium',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={PageChat} />
      <Tab.Screen name="Chats" component={FriendsScreen} />
      <Tab.Screen name="Tasks" component={Tasks} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

// Main layout
const _layout = () => {
  const [isSplashScreen, setSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Introduction" component={Introduction} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="pagechat" component={TabNavigator} />
          <Stack.Screen name="CreateNewChat" component={CreateNewChat} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default _layout;