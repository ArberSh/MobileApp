import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Introduction from './components/introduction';
import SplashScreen from '../SplashScreenView'; // Adjust the path as necessary
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import login from "./components/login"
import register from './components/register';
import pagechat from './components/Tabs/PageChat';

const _layout = () => {
  const [isSplashScreen, setSplashScreen] = useState(true);

  const Stack = createStackNavigator();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isSplashScreen ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Introduction" component={Introduction} />
          <Stack.Screen name="login" component={login} />
          <Stack.Screen name="register" component={register} />
          <Stack.Screen name="pagechat" component={pagechat} />
          </Stack.Navigator>

        </NavigationContainer>
      )}
    </>
  );
};

export default _layout;
