import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import Introduction from './components/introduction';
import Login from './components/login';
import Register from './components/register';
import PageChat from './components/PageChat';
import FriendsScreen from './components/Messages';
import AccountScreen from './components/Account'; 
import EditProfileScreen from './components/EditProfileScreen';
import SplashScreen from '../SplashScreenView';
import Ionicons from '@expo/vector-icons/Ionicons';
import Tasks from './components/Tasks';
import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateNewChat from './components/CreateNewChat';
import ChatRoom from './components/ChatRoom';
import NotificationsScreen from './components/NotificationsScreen';
import CreateNewGroup from './components/CreateNewGroup';
import { FriendsProvider } from './components/FriendsContext';
import { GroupsProvider } from './components/GroupsContext';
import TaskMoreDetail from './components/TaskMoreDetail';
import Test from './components/Test';
import Appearance from './components/Appearance';
import { ThemeProvider } from './components/ThemeContext';
import { useTheme } from './components/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This is the component for the bottom tabs
const TabNavigator = () => {
  // Move useTheme hook inside the component
  const { colors, isDark } = useTheme();
  
  const [fontsLoaded] = useFonts({
    'Lexend': require('./assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('./assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('./assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('./assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

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
        tabBarActiveTintColor: '#7a92af',
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { 
          backgroundColor: colors.background,
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
          fontFamily: 'Lexend-Medium',
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
    <FriendsProvider>
      <GroupsProvider>
        <ThemeProvider>
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
                <Stack.Screen name="Notifications" options={{ animationTypeForReplace:'pop', animation:'slide_from_right',presentation: 'modal',gestureEnabled:true, gestureDirection:'horizontal'}} component={NotificationsScreen} />
                <Stack.Screen name="pagechat" component={TabNavigator} />
                <Stack.Screen name="CreateNewChat" component={CreateNewChat} />
                <Stack.Screen name="CreateNewGroup" component={CreateNewGroup} />
                <Stack.Screen name="TaskMoreDetail" component={TaskMoreDetail} />
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Appearance" component={Appearance} />
                <Stack.Screen 
                  name="EditProfile" 
                  component={EditProfileScreen} 
                  options={{
                    animation: 'slide_from_right',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal'
                  }}
                />
                <Stack.Screen name="ChatRoom" options={{animation:'slide_from_right',gestureEnabled:true,gestureDirection:'horizontal'}} component={ChatRoom} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </GroupsProvider>
    </FriendsProvider>
  );
};

export default _layout;