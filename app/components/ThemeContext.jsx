import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a theme context
const ThemeContext = createContext();

// Define color themes
export const lightTheme = {
  background: '#ffffff',
  headerBackground: '#ffffff',
  cardBackground: '#f0f2f5',
  notificationItem: '#E9EBEE',
  text: '#121212',
  subText: '#666666',
  primary: '#2e71e5',
  danger: '#e53935',
  background2: '#e7e7eb',
  input: '#E5E6E7',
  unreadDot: '#121212',
  tabBarIndicator: '#2e71e5',
  tabBarInactive: '#888888',
  menuBackground: '#E9EBEE',
  isDark: false,
};

export const darkTheme = {
  background: '#1E1E1E',
  headerBackground: '#1C1D20',
  cardBackground: '#3F414A',
  notificationItem: '#3F414A',
  text: '#ffffff',
  subText: '#9DA0A8',
  primary: '#2e71e5',
  danger: '#e53935',
  background2: '#2B2D31',
  input: '#2B2D31',
  unreadDot: 'white',
  tabBarIndicator: 'white',
  tabBarInactive: 'gray',
  menuBackground: '#27272C',
  isDark: true,
};

// Create the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Initialize with dark theme by default (true), ignoring system preference
  const [isDark, setIsDark] = useState(true);
  
  // Load saved theme preference from AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // If no saved preference, use dark theme as default
          setIsDark(true);
          // Save the dark theme as default
          await AsyncStorage.setItem('themePreference', 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };
  
  // Get current theme colors
  const colors = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      colors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;