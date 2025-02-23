// components/GroupCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import PropTypes from 'prop-types';


const GroupCard = ({ group, onPress }) => {
    
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Unread Messages Badge */}
      {group.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{group.unreadCount}</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.title} numberOfLines={1}>{group.name}</Text>
          <Text style={styles.members}>{group.members} members</Text>
        </View>

        {/* Middle Section - Message Preview */}
        {group.latestMessage && (
          <View style={styles.messagePreview}>
            <Feather 
              name="message-square" 
              size={12} 
              color="#888" 
              style={styles.messageIcon}
            />
            <Text 
              style={styles.messageText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {group.latestMessage}
            </Text>
          </View>
        )}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.statusContainer}>
            <MaterialIcons 
              name="circle" 
              size={10} 
              color={group.active ? '#00c9bd' : '#888'} 
            />
            <Text style={styles.statusText}>
              {group.active ? 'Active' : 'Ended'}
            </Text>
          </View>
          <Text style={styles.date}>
            {group.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    active: PropTypes.bool,
    latestMessage: PropTypes.string,
    unreadCount: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 100,
        backgroundColor: 'black',
        borderRadius: 12,
        marginRight: 10,
        padding: 12,
      },
      content: {
        flex: 1,
        justifyContent: 'space-between',
      },
      topSection: {
        flex: 1,
      },
      title: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        marginBottom: 4,
      },
      members: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
      },
      bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statusText: {
        color: '#888',
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        marginLeft: 4,
      },
      date: {
        color: '#888',
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
      },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  messageIcon: {
    marginRight: 6,
  },
  messageText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#00c9bd',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
});

export default GroupCard;