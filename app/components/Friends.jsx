import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { useFriends } from './FriendsContext';
import { useTheme } from './ThemeContext';
import Text from './CustomText';
import LetterAvatar from './LetterAvatar';
import Account from './Repeats/account';

// Component for displaying a friend in the list
const FriendItem = ({ friend, onSelect, colors }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={[styles.friendItem, { backgroundColor: colors.cardBackground }]} 
      onPress={() => onSelect(friend)}
    >
      <View style={styles.friendAvatar}>
        {friend.profilePicture ? (
          <Image 
            source={{ uri: friend.profilePicture }} 
            style={styles.avatarImage} 
          />
        ) : (
          <LetterAvatar
            name={friend.name || friend.username}
            size={50}
            borderWidth={0}
          />
        )}
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: friend.isOnline ? '#44b700' : '#ccc' }
          ]} 
        />
      </View>
      
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: colors.text }]}>
          {friend.name || friend.username}
        </Text>
        <Text style={[styles.friendBio, { color: colors.subText }]} numberOfLines={1}>
          {friend.bio || "No bio available"}
        </Text>
      </View>
      
      {friend.notification > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>
            {friend.notification > 99 ? '99+' : friend.notification}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Component for displaying a friend request
const FriendRequestItem = ({ request, onAccept, onDecline, colors }) => {
  return (
    <View style={[styles.requestItem, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.requestAvatar}>
        {request.profilePicture ? (
          <Image 
            source={{ uri: request.profilePicture }} 
            style={styles.avatarImage} 
          />
        ) : (
          <LetterAvatar
            name={request.name || request.username}
            size={50}
            borderWidth={0}
          />
        )}
      </View>
      
      <View style={styles.requestInfo}>
        <Text style={[styles.friendName, { color: colors.text }]}>
          {request.name || request.username}
        </Text>
        <Text style={[styles.requestUsername, { color: colors.subText }]}>
          @{request.username}
        </Text>
      </View>
      
      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.acceptButton]} 
          onPress={() => onAccept(request)}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.declineButton]} 
          onPress={() => onDecline(request)}
        >
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendsScreen = ({ onSelectChat }) => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const { colors } = useTheme();
  
  // Use the friends context
  const { 
    friends, 
    pendingRequests, 
    loading, 
    error,
    acceptFriendRequest,
    declineFriendRequest
  } = useFriends();

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
      const query = searchQuery.toLowerCase();
      return (
        (friend.name && friend.name.toLowerCase().includes(query)) ||
        (friend.username && friend.username.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Handle friend selection
  const handleFriendSelect = (friend) => {
    // Log the friend data to verify it has the id
    console.log("Navigating to chat with friend:", friend);
    
    // Make sure we have a valid id to pass
    if (!friend || !friend.id) {
      console.error("Cannot navigate to chat: Missing friend ID", friend);
      Alert.alert("Error", "Unable to open chat at this time.");
      return;
    }
  
    
    // Navigate with all the necessary parameters including receiverId
    navigation.navigate('ChatRoom', { 
      id: friend.id,
      receiverId: friend.id,  // Add this line - this is what your chat screen is looking for
      name: friend.name || friend.username || "Chat",
      image: friend.profilePicture || null,
      status: friend.isOnline ? 'Online' : 'Offline'
    });
  };

  // Handle refreshing the friend list
  const onRefresh = async () => {
    setRefreshing(true);
    // Wait for 1 second to simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle accepting a friend request
  const handleAcceptRequest = async (request) => {
    try {
      await acceptFriendRequest(request.id);
      Alert.alert('Success', `You are now friends with ${request.name || request.username}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle declining a friend request
  const handleDeclineRequest = async (request) => {
    try {
      await declineFriendRequest(request.id);
      Alert.alert('Friend Request', `Request from ${request.name || request.username} declined`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBackground }]}>
      {/* Search and Filter Header */}
      <View style={styles.headerContainer}>
        <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            maxLength={30}
            placeholder="Search Friends..."
            placeholderTextColor={colors.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.activeFilterButton, 
            { backgroundColor: showFilters ? colors.input : 'transparent' }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter-outline" color={colors.text} size={24} />
        </TouchableOpacity>
      </View>
      
      {/* Friend Request Count Button */}
      {pendingRequests.length > 0 && (
        <TouchableOpacity 
          style={[styles.requestsButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowRequests(!showRequests)}
        >
          <View style={styles.requestsBadge}>
            <Text style={styles.requestsBadgeText}>{pendingRequests.length}</Text>
          </View>
          <Text style={[styles.requestsButtonText, { color: colors.text }]}>
            {pendingRequests.length === 1 ? '1 Friend Request' : `${pendingRequests.length} Friend Requests`}
          </Text>
          <Ionicons 
            name={showRequests ? "chevron-up" : "chevron-down"} 
            color={colors.text} 
            size={20} 
          />
        </TouchableOpacity>
      )}
      
      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterBtn, 
              selectedFilter === 'All' && styles.selectedFilter,
              { backgroundColor: selectedFilter === 'All' ? colors.input : 'transparent' }
            ]}
            onPress={() => setSelectedFilter('All')}
          >
            <Text style={[styles.filterText, { color: colors.text }]}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn, 
              selectedFilter === 'Online' && styles.selectedFilter,
              { backgroundColor: selectedFilter === 'Online' ? colors.input : 'transparent' }
            ]}
            onPress={() => setSelectedFilter('Online')}
          >
            <Text style={[styles.filterText, { color: colors.text }]}>Online</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn, 
              selectedFilter === 'Offline' && styles.selectedFilter,
              { backgroundColor: selectedFilter === 'Offline' ? colors.input : 'transparent' }
            ]}
            onPress={() => setSelectedFilter('Offline')}
          >
            <Text style={[styles.filterText, { color: colors.text }]}>Offline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Friend Requests Section */}
      {showRequests && pendingRequests.length > 0 && (
        <View style={[styles.requestsContainer, { backgroundColor: colors.background2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Friend Requests</Text>
          {pendingRequests.map((request) => (
            <FriendRequestItem
              key={request.id}
              request={request}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
              colors={colors}
            />
          ))}
        </View>
      )}
      
      {/* Main Content Area */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background2 }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7a92af" />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading friends...</Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <Account
                  key={friend.id}
                  id={friend.id}
                  name={friend.name || friend.username}
                  image={friend.profilePicture}
                  text={friend.bio || "Say hello!"}
                  notification={friend.notification}
                  status={friend.isOnline ? 'online' : 'offline'}
                  onPress={() => handleFriendSelect(friend)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color={colors.subText} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No friends found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.subText }]}>
                  {searchQuery ? 
                    "Try a different search term or filter" : 
                    "Add friends to start chatting"}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Add Friend FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.cardBackground }]}
        onPress={() => navigation.navigate('CreateNewChat')}
      >
        <Ionicons name="add-outline" size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: 16,
    marginBottom: 10,
    height: 46,
  },
  searchContainer: {
    width: '84%',
    borderRadius: 15,
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  filterButton: {
    width: '14%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  activeFilterButton: {
    // Background color is applied conditionally
  },
  filtersContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  filterBtn: {
    alignItems: 'center',
    width: 80,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
  },
  selectedFilter: {
    // Background color is applied conditionally
  },
  requestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  requestsBadge: {
    backgroundColor: '#FF5252',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  requestsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Bold',
  },
  requestsButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  requestsContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Lexend-Bold',
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    fontFamily: 'Lexend-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontFamily: 'Lexend',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  friendAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Lexend-Bold',
  },
  friendBio: {
    fontSize: 14,
    fontFamily: 'Lexend',
  },
  notificationBadge: {
    backgroundColor: '#FF5252',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Bold',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  requestAvatar: {
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestUsername: {
    fontSize: 14,
    fontFamily: 'Lexend',
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  declineButton: {
    backgroundColor: '#FF5252',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
  },
});

export default FriendsScreen;