import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Introduction from './components/introduction';
import Login from './components/login';
import Register from './components/register';
import PageChat from './components/PageChat';
import FriendsScreen from './components/Chats'; // Create these
import AccountScreen from './components/Account'; // Create these
import SplashScreen from '../SplashScreenView';
import Ionicons from '@expo/vector-icons/Ionicons';
import Tasks from './components/Tasks';
import { StatusBar } from 'react-native'; // Change this import
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
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
              }else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              } 
    
              return <Ionicons name={iconName} size={28} color={color} />;
            },
            tabBarActiveTintColor: '#00c9bd',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { 
              backgroundColor: '#000',
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


const _layout = () => {
  const [isSplashScreen, setSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content" // Force white icons
        backgroundColor="transparent"
        translucent={true}
      />
      {isSplashScreen ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Introduction" component={Introduction} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="pagechat" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default _layout;