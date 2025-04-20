import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const UnreadNotifications = ({ notifications, markAsRead, formatRelativeTime }) => {
  const { colors } = useTheme();
  
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: colors.subText,
      fontSize: 16,
      fontFamily: 'Lexend',
    },
    notificationItem: {
      borderRadius: 20,
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      backgroundColor: colors.notificationItem,
      marginBottom: 10
    },
    notificationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.unreadDot,
      marginRight: 16,
      marginTop: 5,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      color: colors.text,
      fontSize: 18,
      fontFamily: 'Lexend-SemiBold',
      marginBottom: 4,
    },
    notificationMessage: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'Lexend',
      marginBottom: 6,
      opacity: 0.8,
    },
    notificationTime: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: 'Lexend',
    },
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={themedStyles.notificationItem}
      onPress={() => markAsRead(item.id)}
    >
      <View style={themedStyles.notificationDot} />
      <View style={themedStyles.notificationContent}>
        <Text style={themedStyles.notificationTitle}>{item.title}</Text>
        <Text style={themedStyles.notificationMessage}>{item.message}</Text>
        <Text style={themedStyles.notificationTime}>{formatRelativeTime(item.time)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={themedStyles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={themedStyles.emptyContainer}>
          <Text style={themedStyles.emptyText}>No unread notifications</Text>
        </View>
      )}
    </View>
  );
};

export default UnreadNotifications;