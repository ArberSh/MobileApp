import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './CustomText';
import { useTheme } from './ThemeContext';
import { useFriends } from './FriendsContext';
import { doc, collection, query, where, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from './Auth';

const FriendRequestHandler = () => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const { acceptFriendRequest, declineFriendRequest, pendingRequests } = useFriends();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);

  // Format time to relative format (e.g. "2 hours ago")
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Load notifications from Firestore
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const notificationsRef = collection(firestore, "users", currentUser.uid, "notifications");
    
    // Filter for only unread friend request notifications
    const q = query(notificationsRef, where("type", "==", "friend_request"), where("read", "==", false));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: 'Friend Request',
          message: `${data.fromUserName || 'Someone'} sent you a friend request`,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          read: data.read,
          time: data.createdAt,
          type: data.type
        };
      });
      
      setNotifications(notificationData);
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [currentUser]);

  // Handle friend request acceptance
  const handleAcceptRequest = async (notification) => {
    try {
      setProcessing(notification.id);
      
      // Accept the friend request using the method from FriendsContext
      await acceptFriendRequest(notification.fromUserId);
      
      // Mark notification as read
      const notificationRef = doc(firestore, "users", currentUser.uid, "notifications", notification.id);
      await updateDoc(notificationRef, { read: true });
      
      // Remove from notifications list
      setNotifications(prev => prev.filter(item => item.id !== notification.id));
      
      Alert.alert("Success", `You are now friends with ${notification.fromUserName}`);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", `Failed to accept friend request: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  // Handle friend request decline
  const handleDeclineRequest = async (notification) => {
    try {
      setProcessing(notification.id);
      
      // Decline the friend request
      await declineFriendRequest(notification.fromUserId);
      
      // Mark notification as read
      const notificationRef = doc(firestore, "users", currentUser.uid, "notifications", notification.id);
      await updateDoc(notificationRef, { read: true });
      
      // Remove from notifications list
      setNotifications(prev => prev.filter(item => item.id !== notification.id));
    } catch (error) {
      console.error("Error declining friend request:", error);
      Alert.alert("Error", `Failed to decline friend request: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  // Toggle profile menu
  const toggleProfileMenu = (itemId) => {
    // If clicking the same item, toggle menu, otherwise show menu for new item
    if (activeItemId === itemId) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setActiveItemId(itemId);
      setShowProfileMenu(true);
    }
  };

  // Handle profile menu options
  const handleProfileMenuOption = (option, notification) => {
    switch (option) {
      case 'copy':
        // In a real app, you would use Clipboard API here
        Alert.alert('Copied', `Username "${notification.fromUserName}" copied to clipboard`);
        break;
      case 'block':
        Alert.alert('Block User', 'Are you sure you want to block this user?', [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Block', 
            style: 'destructive',
            onPress: () => {
              // Implement block user logic here
              handleDeclineRequest(notification);
              Alert.alert("Blocked", `User has been blocked`);
            } 
          }
        ]);
        break;
      case 'report':
        Alert.alert('Report User', 'Are you sure you want to report this user?', [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Report', 
            style: 'destructive',
            onPress: () => {
              // Implement report user logic here
              Alert.alert("Reported", "User has been reported to moderators");
            } 
          }
        ]);
        break;
    }
    setShowProfileMenu(false);
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(firestore, "users", currentUser.uid, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => 
          item.id === notificationId ? { ...item, read: true } : item
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10 
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    emptyText: {
      color: colors.subText,
      fontSize: 16,
      fontFamily: 'Lexend',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
    },
    unreadDot: {
      backgroundColor: colors.unreadDot || '#2e71e5',
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: colors.notificationItem || colors.cardBackground,
      padding: 16,
      borderRadius: 20,
      marginBottom: 10,
    },
    notificationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.cardBackground,
      marginRight: 16,
      marginTop: 5,
    },
    notificationContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between'
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
      backgroundColor: '#2e71e5', // Changed to blue for better visibility
      borderRadius: 8,
      width: 36,
      height: 36,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    declineButton: {
      backgroundColor: colors.background2 || '#f0f0f0',
      borderRadius: 8,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileMenuDropdown: {
      position: 'absolute',
      right: 0,
      top: 40,
      backgroundColor: colors.menuBackground || colors.cardBackground,
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
      color: colors.text,
      fontSize: 14,
      fontFamily: 'Lexend',
    },
  });

  const renderItem = ({ item }) => (
    <View style={themedStyles.notificationItem}>
      <View style={[themedStyles.notificationDot, !item.read && themedStyles.unreadDot]} />
      <View style={themedStyles.notificationContent}>
        <View>
          <TouchableOpacity onPress={() => markAsRead(item.id)}>
            <Text style={themedStyles.notificationTitle}>{item.title}</Text>
            <Text style={themedStyles.notificationMessage}>{item.message}</Text>
            <Text style={themedStyles.notificationTime}>{formatRelativeTime(item.time)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={themedStyles.actionButtons}>
          <TouchableOpacity onPress={() => toggleProfileMenu(item.id)}>
            <Ionicons name='ellipsis-vertical' size={24} color={colors.text} />
          </TouchableOpacity>
          
          {showProfileMenu && activeItemId === item.id && (
            <View style={themedStyles.profileMenuDropdown}>
              <TouchableOpacity 
                style={themedStyles.profileMenuItem}
                onPress={() => handleProfileMenuOption('copy', item)}
              >
                <Ionicons name="copy-outline" size={20} color={colors.text} style={themedStyles.menuItemIcon} />
                <Text style={themedStyles.menuItemText}>Copy Username</Text>
              </TouchableOpacity>                    
              <TouchableOpacity 
                style={themedStyles.profileMenuItem}
                onPress={() => handleProfileMenuOption('block', item)}
              >
                <Ionicons name="ban-outline" size={20} color="#ff5252" style={themedStyles.menuItemIcon} />
                <Text style={[themedStyles.menuItemText, { color: '#ff5252' }]}>Block User</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={themedStyles.profileMenuItem}
                onPress={() => handleProfileMenuOption('report', item)}
              >
                <Ionicons name="flag-outline" size={20} color="#ff5252" style={themedStyles.menuItemIcon} />
                <Text style={[themedStyles.menuItemText, { color: '#ff5252' }]}>Report User</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={themedStyles.responseButtons}>
            <TouchableOpacity 
              style={themedStyles.acceptButton}
              onPress={() => handleAcceptRequest(item)}
              disabled={processing === item.id}
            >
              {processing === item.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons size={20} color='white' name='checkmark' />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={themedStyles.declineButton}
              onPress={() => handleDeclineRequest(item)}
              disabled={processing === item.id}
            >
              {processing === item.id ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Ionicons size={20} color={colors.text} name='close' />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[themedStyles.container, themedStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary || '#2e71e5'} />
      </View>
    );
  }

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
          <Text style={themedStyles.emptyText}>No friend requests</Text>
        </View>
      )}
    </View>
  );
};

export default FriendRequestHandler;