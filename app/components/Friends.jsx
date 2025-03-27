import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Account from "./Repeats/account";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';

const Friends = ({ drawerNavigation }) => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const screenHeight = Dimensions.get('window').height;

  const friendsData = [
    { name: "Aleks", status: 'Online', text: "Aleks: Hey I need your help", notification: '2', image: "https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg" },
    { name: "Mario", status: 'Offline', text: "You: Actually i like it", image: "https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg" },
    { name: "Arber", status: 'Offline', text: "Arber: Hello, How are you", notification: '2', image: "https://wallpapers.com/images/hd/oscar-zahn-skeleton-headphones-unique-cool-pfp-rboah21ctf7m37o0.jpg" },
    { name: "John", status: 'Offline', text: "You: yo how did you do that", notification: '2', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVmRIWVvmruhUAHnOsuPJPocXeyqGyX4TcPQ&s" },
    { name: "Kevin", status: 'Online', text: "Kevin: What's up ", image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/237140455/original/a3ff1f2f90f5d52cec530bc529fbcf169a6cb9d6/draw-a-simple-aesthetics-pfp-or-lock-screen-image-for-you.png" },
    { name: "Maria", status: 'Online', text: "You: yo how did you do that", image: "https://i.pinimg.com/originals/dc/4f/40/dc4f402448b8b309879645aefa1dde46.jpg" },
  ]

  const filteredFriends = friendsData.filter(friend => {
    if (selectedFilter === 'All') return true;
    return friend.status === selectedFilter;
  });

  const handleFriendSelect = (friend) => {
    // Call the callback to notify ChatRoom
    if (onSelectChat) {
      onSelectChat(friend);
    }
    
    // Close the drawer
    if (drawerNavigation && drawerNavigation.closeDrawer) {
      drawerNavigation.closeDrawer();
    } else {
      // If not in drawer, navigate normally
      navigation.navigate('ChatRoom', { 
        name: friend.name,
        image: friend.photo,
        status: friend.status
      });
    }
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
            placeholderTextColor='white' />
        </View>
        <TouchableOpacity style={[styles.filterButton,
        showFilters && styles.activeFilterButton
        ]}
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
        <ScrollView contentContainerStyle={styles.content}>
          {filteredFriends.map((friend, index) => (
            <TouchableOpacity key={index} onPress={() => handleFriendSelect(friend)}>
              <Account
                name={friend.name}
                text={friend.text}
                notification={friend.notification}
                image={friend.image}
                status={friend.status}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => { navigation.navigate('CreateNewChat') }}
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
    paddingBottom: 20, // Add extra padding at the bottom
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
    backgroundColor: '#00c9bd',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1, // Ensure it stays on top
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
  }

});

export default Friends;