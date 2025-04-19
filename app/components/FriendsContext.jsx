import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const FriendsContext = createContext();

// Create a provider component
export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load friends data from JSON file
  useEffect(() => {
    const loadFriends = async () => {
      try {
        setLoading(true);
        // Import the users.json file
        const usersData = require('../users.json');
        
        // Add notification field if it doesn't exist
        const processedData = usersData.map(user => ({
          ...user,
          notification: user.notification || 0
        }));
        
        setFriends(processedData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading users data: ", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadFriends();
  }, []);

  // Add a new friend
  const addFriend = (newFriend) => {
    setFriends(prevFriends => [...prevFriends, newFriend]);
  };

  // Remove a friend
  const removeFriend = (friendId) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
  };

  // Update a friend's information
  const updateFriend = (friendId, updatedInfo) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === friendId ? { ...friend, ...updatedInfo } : friend
      )
    );
  };

  // Get all friends
  const getAllFriends = () => {
    return friends;
  };

  // Get a specific friend by ID
  const getFriendById = (friendId) => {
    return friends.find(friend => friend.id === friendId);
  };

  // Set a friend's online status
  const setFriendOnlineStatus = (friendId, isOnline) => {
    updateFriend(friendId, { isOnline });
  };

  // Add or update notification count
  const updateNotification = (friendId, count) => {
    const friend = getFriendById(friendId);
    if (friend) {
      const newCount = (friend.notification || 0) + count;
      updateFriend(friendId, { notification: newCount < 0 ? 0 : newCount });
    }
  };

  // Clear a friend's notifications
  const clearNotifications = (friendId) => {
    updateFriend(friendId, { notification: 0 });
  };

  // Find a friend by username
  const findFriendByUsername = (username) => {
    return friends.find(friend => friend.username === username);
  };

  // Context value
  const value = {
    friends,
    loading,
    error,
    addFriend,
    removeFriend,
    updateFriend,
    getAllFriends,
    getFriendById,
    setFriendOnlineStatus,
    updateNotification,
    clearNotifications,
    findFriendByUsername
  };

  return (
    <FriendsContext.Provider value={value}>
      {children}
    </FriendsContext.Provider>
  );
};