import React, { useEffect, useState } from 'react';
import { View, Dimensions, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GroupCard from './Repeats/GroupCard';

const Groups = ({ drawerNavigation }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get('window');

  const [dimensions, setDimensions] = useState({
    heightWindow: height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ heightWindow: window.height });
    });

    return () => subscription?.remove();
  }, []);

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

  // Group data
  const groupsData = [
    { name: "Ariel1", description: "Nuk di cfar te them", photo: "https://www.pfpgeeks.com/static/images/gojo-pfp/webp/gojo-pfp-10.webp", color: 'lightblue' },
    { name: "Arber's Team", description: "We are the best", photo: "https://mrwallpaper.com/images/hd/lee-hoon-happy-birthday-unique-cool-pfp-fanart-wgafs58ve2sakhc2.jpg", color: 'lightgreen' },
    { name: "Billy's Team", description: "Project Duh", photo: "https://i.imgflip.com/3hurx9.jpg?a483936", color: 'pink' },
    { name: "Gaming Squad", description: "Let's play tonight", photo: "https://i.imgflip.com/3hurx9.jpg?a483936", color: 'purple' },
    { name: "Study Group", description: "Exam prep session", photo: "https://i.imgflip.com/3hurx9.jpg?a483936", color: 'orange' },
  ];

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
          width: '100%',
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
            placeholder="Search Groups..."
            placeholderTextColor='white' />
        </View>
      </View>

      <View style={[styles.contentWrapper]}>
        <ScrollView contentContainerStyle={styles.content}>
          {groupsData.map((group, index) => (
            <TouchableOpacity key={index} onPress={() => handleGroupSelect(group)}>
              <GroupCard 
                name={group.name} 
                description={group.description} 
                photo={group.photo} 
                color={group.color} 
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

});

export default Groups;