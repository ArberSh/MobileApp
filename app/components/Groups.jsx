import React, { useState, useContext } from 'react';
import { View, Dimensions, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GroupCard from './Repeats/GroupCard';
import { GroupsContext } from './GroupsContext'; // Import the context
import { useTheme } from './ThemeContext'; // Import theme hook
import Text from './CustomText';

const Groups = ({ drawerNavigation }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get('window');
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme(); // Get theme colors
  
  const [dimensions, setDimensions] = useState({
    heightWindow: height,
  });

  // Use the groups data from context instead of local state
  const { groups = [] } = useContext(GroupsContext) || {};

  // Handle group selection
  const handleGroupSelect = (group) => {
    // If drawer navigation is provided (we're in drawer mode), close it first
    if (drawerNavigation) {
      drawerNavigation.closeDrawer();
    }
    
    // Navigate to ChatRoom or ChatRoomDrawer based on context
    if (drawerNavigation) {
      // We're already in the drawer, so just close it and update chat
      // This could be done through a context or state management if needed
    } else {
      // We're coming from the groups list, so navigate to drawer-wrapped chat
      navigation.navigate('ChatRoomDrawer', {
        screen: 'ChatRoomScreen',
        params: {
          name: group.name,
          description: group.description,
          photo: group.photo
        }
      });
    }
  };

  // Handle search clearing
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter groups based on search query - with null safety
  const filteredGroups = (groups || []).filter(group => {
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    const name = (group?.name || '').toLowerCase();
    const description = (group?.description || '').toLowerCase();
    
    return name.includes(query) || description.includes(query);
  });

  // Determine what message to show when no groups are found
  const getNoGroupsMessage = () => {
    if (searchQuery && groups && groups.length > 0) {
      return `No groups found matching "${searchQuery}"`;
    } else if (!groups || groups.length === 0) {
      return "You don't have any groups yet";
    } else {
      return "No groups found";
    }
  };

  // Determine what subtext to show
  const getNoGroupsSubtext = () => {
    if (searchQuery && groups && groups.length > 0) {
      return "Try a different search term";
    } else if (!groups || groups.length === 0) {
      return "Create a new group to start chatting";
    } else {
      return "Create a new group to start chatting";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBackground }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.input }]}>
          <Ionicons name="search-outline" size={20} color={colors.subText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            maxLength={30}
            placeholder="Search Groups..."
            placeholderTextColor={colors.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.subText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: colors.background2 }]}>
        <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background2 }]}>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleGroupSelect(group)}
              >
                <GroupCard 
                  name={group.name || 'Unnamed Group'} 
                  description={group.description || 'No description'} 
                  photo={group.photo} 
                  color={group.color || '#4ea4a6'} 
                  themeColors={colors} // Pass theme colors to GroupCard component
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noGroupsContainer}>
              <Ionicons name="people-outline" size={64} color={colors.subText} />
              <Text style={styles.noGroupsText}>{getNoGroupsMessage()}</Text>
              <Text style={[styles.noGroupsSubtext, { color: colors.subText }]}>
                {getNoGroupsSubtext()}
              </Text>
              
              {searchQuery && (
                <TouchableOpacity 
                  style={[styles.clearSearchButton, { backgroundColor: colors.cardBackground }]}
                  onPress={clearSearch}
                >
                  <Text style={styles.clearSearchText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.cardBackground }]}
        onPress={() => navigation.navigate('CreateNewGroup')}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add-outline" size={28} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginHorizontal: '5%',
    marginTop: '4%',
    marginBottom: 10,
  },
  searchInputContainer: {
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    minHeight: 300, // Ensure there's enough space for the no groups message
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 10,
    padding: 4,
    borderRadius: 16
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
  noGroupsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noGroupsText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noGroupsSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  clearSearchButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default Groups;