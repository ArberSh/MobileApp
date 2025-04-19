import React, { useState, useContext, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Account from "./Repeats/account";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { FriendsContext } from '../components/FriendsContext'; // Import the context
import Text from './CustomText';

// Color generation utility - creates a deterministic color from a string
const generateConsistentColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 50%)`;
};

const Friends = ({ drawerNavigation, onSelectChat }) => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const screenHeight = Dimensions.get('window').height;
  
  // Use the friends data from context instead of local state
  const { friends } = useContext(FriendsContext);

  // Create color map once and reuse it to ensure consistent colors
  const friendColorMap = useMemo(() => {
    const colorMap = {};
    friends.forEach(friend => {
      // Generate a consistent color using the friend's ID
      colorMap[friend.id] = generateConsistentColor(friend.id);
    });
    return colorMap;
  }, [friends]); // Dependency on friends array, but will only change if friends list changes

  // Filter friends based on selected filter and search query
  const filteredFriends = friends.filter(friend => {
    // Apply status filter
    if (selectedFilter === 'All') {
      // Just apply search filter
    } else if (selectedFilter === 'Online' && !friend.isOnline) {
      return false;
    } else if (selectedFilter === 'Offline' && friend.isOnline) {
      return false;
    }
    
    // Apply search filter if there is a search query
    if (searchQuery) {
      return friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleFriendSelect = (friend) => {
    // Call the callback to notify ChatRoom
    if (onSelectChat) {
      onSelectChat(friend);
    }
  };

  // Function to get user avatar color consistently
  const getFriendAvatarColor = (friend) => {
    return friendColorMap[friend.id] || 'gray'; // Fallback color if ID not found
  };

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
        marginTop: '4%',
        height: 46,
        marginBottom: 10
      }}>
        <View style={{
          backgroundColor: '#5E5E5E',
          width: '84%',
          borderRadius: 15,
        }}>
          <TextInput
            style={{
              backgroundColor: '#5E5E5E',
              borderRadius: 15,
              flex: 1,
              color: 'white',
              paddingVertical: 10,
              fontSize: 16,
              paddingHorizontal: 8,
            }}
            maxLength={30}
            placeholder="Search Friends..."
            placeholderTextColor='white'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.activeFilterButton]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter-outline" color='white' size={24} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2%',
          marginBottom: '4%'
        }}>
          <TouchableOpacity
            style={[styles.filterBtn, selectedFilter === 'All' && styles.selectedFilter]}
            onPress={() => {
              setSelectedFilter('All');
            }}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, selectedFilter === 'Online' && styles.selectedFilter]}
            onPress={() => {
              setSelectedFilter('Online');
            }}
          >
            <Text style={styles.filterText}>Online</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, selectedFilter === 'Offline' && styles.selectedFilter]}
            onPress={() => {
              setSelectedFilter('Offline');
            }}
          >
            <Text style={styles.filterText}>Offline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={[styles.contentWrapper]}>
        <ScrollView 
          contentContainerStyle={styles.content}
        >
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleFriendSelect(friend)}
              >
                <Account
                  name={friend.name}
                  text={friend.bio || "No bio available"}
                  notification={friend.notification || 0}
                  image={friend.profilePicture}
                  status={friend.isOnline ? 'online' : 'offline'}
                  avatarColor={getFriendAvatarColor(friend)} // Pass consistent color to Account component
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noFriendsContainer}>
              <Ionicons name="people-outline" size={64} color="#5E5E5E" />
              <Text style={styles.noFriendsText}>No friends found</Text>
              <Text style={styles.noFriendsSubtext}>
                {searchQuery ? 
                  "Try a different search term or filter" : 
                  "Add friends to start chatting"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNewChat')}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add-outline" size={28} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1D20',
  },
  content: {
    backgroundColor: '#2B2D31',
    paddingHorizontal: 10,
    paddingBottom: 20,
    minHeight: 300, // Ensure there's enough space for the no friends message
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#2B2D31',
    padding: 4,
    borderRadius: 16
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
  },
  fabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: '14%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  activeFilterButton: {
    backgroundColor: '#5E5E5E'
  },
  filterBtn: {
    alignItems: 'center',
    color: 'white',
    width: 80,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12
  },
  filterText: {
    color: 'white',
    fontSize: 20
  },
  selectedFilter: {
    backgroundColor: '#5E5E5E',
    color: 'black'
  },
  noFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noFriendsText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noFriendsSubtext: {
    color: '#9e9e9e',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  }
});

export default Friends;