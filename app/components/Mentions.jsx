import React from 'react';
import { View,  StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Text from './CustomText';


const Mentions = ({ notifications, markAsRead, formatRelativeTime }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.notificationDot, !item.read && styles.unreadDot]} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatRelativeTime(item.time)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No mentions</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding:10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9DA0A8',
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  unreadDot: {
    backgroundColor: 'white',
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3F414A',
    marginRight: 16,
    marginTop: 5,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Lexend',
    marginBottom: 6,
  },
  notificationTime: {
    color: '#9DA0A8',
    fontSize: 14,
    fontFamily: 'Lexend',
  },
  notificationItem: {
    borderRadius:20,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: '#3F414A',
    marginBottom:10
  },
});


export default Mentions;