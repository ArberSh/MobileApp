import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Import components for tabs
import UnreadNotifications from './Unread';
import Mentions from './Mentions';
import FriendsNotificiation from './FriendsNotificiation';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

// Import notifications data
import notificationsData from '../notification.json';
import { formatRelativeTime } from './notificationUtils';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  const { colors } = useTheme();
  
  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  
  // Load notifications on component mount
  useEffect(() => {
    // Get all notifications from the nested structure in notification.json
    if (notificationsData && typeof notificationsData === 'object') {
      let allNotifications = [];
      
      // Get notifications from each user ID
      Object.keys(notificationsData).forEach(userId => {
        if (Array.isArray(notificationsData[userId])) {
          allNotifications = [...allNotifications, ...notificationsData[userId]];
        }
      });
      
      setNotifications(allNotifications);
    }
  }, []);
  
  // Function to mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Create styles with theme colors
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 15,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 5,
    },
    placeholder: {
      width: 28,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontFamily: 'Lexend-Bold',
    },
    tabBar: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBackground,
    },
    tabLabel: {
      fontFamily: 'Lexend-Medium',
      fontSize: 18,
      textTransform: 'none',
    },
    indicator: {
      backgroundColor: colors.tabBarIndicator,
      height: 3,
    },
  });
  
  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <TouchableOpacity 
          style={themedStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={themedStyles.title}>Notifications</Text>
        <View style={themedStyles.placeholder} />
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: themedStyles.tabBar,
          tabBarLabelStyle: themedStyles.tabLabel,
          tabBarIndicatorStyle: themedStyles.indicator,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.tabBarInactive,
        }}
      >
        <Tab.Screen 
          name="Unread" 
          children={() => (
            <UnreadNotifications 
              notifications={notifications.filter(n => !n.read)}
              markAsRead={markAsRead}
              formatRelativeTime={formatRelativeTime}
            />
          )}
          options={{ title: 'Unread' }}
        />
        <Tab.Screen 
          name="Mentions" 
          children={() => (
            <Mentions 
              notifications={notifications.filter(n => n.type === 'mention')}
              markAsRead={markAsRead}
              formatRelativeTime={formatRelativeTime}
            />
          )}
          options={{ title: 'Mentions' }}
        />
        <Tab.Screen 
          name="Friends" 
          children={() => (
            <FriendsNotificiation 
              notifications={notifications.filter(n => n.type === 'friend_request')}
              markAsRead={markAsRead}
              formatRelativeTime={formatRelativeTime}
            />
          )}
          options={{ title: 'Friends' }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default NotificationsScreen;