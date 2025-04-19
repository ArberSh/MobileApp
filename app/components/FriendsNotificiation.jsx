import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Text from './CustomText';


const FriendsNotificiation = ({ notifications, markAsRead, formatRelativeTime }) => {
  // Move hooks inside the component
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null); // Track which notification has an open menu
  
  const toggleProfileMenu = (itemId) => {
    // If clicking the same item, toggle menu, otherwise show menu for new item
    if (activeItemId === itemId) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setActiveItemId(itemId);
      setShowProfileMenu(true);
    }
  };

  const handleProfileMenuOption = (option, name = "User") => {
    // Handle the selected profile menu option
    switch (option) {
      case 'copy':
        Alert.alert('Copied', `Username "${name}" copied to clipboard`);
        break;
      case 'group':
        Alert.alert('Add to Group', 'User will be added to a group');
        break;
      case 'block':
        Alert.alert('Block User', 'Are you sure you want to block this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Block', style: 'destructive' }
        ]);
        break;
      case 'report':
        Alert.alert('Report User', 'Are you sure you want to report this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Report', style: 'destructive' }
        ]);
        break;
    }
    setShowProfileMenu(false);
  };

  const renderItem = ({ item }) => (
    <View 
      style={styles.notificationItem}
    >
      <View style={[styles.notificationDot, !item.read && styles.unreadDot]} />
      <View style={styles.notificationContent}>
        <View>
          <TouchableOpacity onPress={() => markAsRead(item.id)}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>{formatRelativeTime(item.time)}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Show action buttons for all friend requests */}
        <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => toggleProfileMenu(item.id)}>
                <Ionicons name='ellipsis-vertical' size={24} color="white" />
            </TouchableOpacity>
                {showProfileMenu && activeItemId === item.id && (
                  <View style={styles.profileMenuDropdown}>
                    <TouchableOpacity 
                      style={styles.profileMenuItem}
                      onPress={() => handleProfileMenuOption('copy')}
                    >
                      <Ionicons name="copy-outline" size={20} color="white" style={styles.menuItemIcon} />
                      <Text style={styles.menuItemText}>Copy Username</Text>
                    </TouchableOpacity>                    
                    <TouchableOpacity 
                      style={styles.profileMenuItem}
                      onPress={() => handleProfileMenuOption('block')}
                    >
                      <Ionicons name="ban-outline" size={20} color="#ff5252" style={styles.menuItemIcon} />
                      <Text style={[styles.menuItemText, { color: '#ff5252' }]}>Block User</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.profileMenuItem}
                      onPress={() => handleProfileMenuOption('report')}
                    >
                      <Ionicons name="flag-outline" size={20} color="#ff5252" style={styles.menuItemIcon} />
                      <Text style={[styles.menuItemText, { color: '#ff5252' }]}>Report User</Text>
                    </TouchableOpacity>
                  </View>
                )}
            <View style={styles.responseButtons}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Ionicons size={20} color='black' name='checkmark' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton}>
                  <Ionicons size={20} color='white' name='close' />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
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
          <Text style={styles.emptyText}>No friend notifications</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 10 
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
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#3F414A',
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'column',
    marginVertical: 5,
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  responseButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  acceptButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    width: 36,
    height: 36,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#27272C',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
  },
  profileMenuDropdown: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#27272C',
    borderRadius: 8,
    padding: 8,
    zIndex: 100,
    minWidth: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Lexend',
  },
});


export default FriendsNotificiation;