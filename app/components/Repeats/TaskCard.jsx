import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Text from '../CustomText';
import { useTheme } from '../ThemeContext';

const TaskCard = ({ title, date, clock, status, description, assignedBy, onPress }) => {
  // Get theme colors
  const { colors } = useTheme();
  
  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  let statusColor;
  let statusText;
  
  switch(status) {
    case 'overdue':
      statusColor = '#FF5252';
      statusText = 'Overdue';
      break;
    case 'dueSoon':
      statusColor = '#FFA726'; 
      statusText = 'Due Soon';
      break;
    case 'upcoming':
      statusColor = '#2196F3';
      statusText = 'Upcoming';
      break;
    case 'completed':
      statusColor = '#4CAF50';
      statusText = 'Completed';
      break;
    default:
      statusColor = '#2196F3';
      statusText = 'Upcoming';
  }

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
    >
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons size={18} color={colors.subText} name='time-outline' />
          <Text style={[styles.dateText, { color: colors.subText }]}>
            {formatDate(date)} at {clock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the indicator doesn't break the card's rounded corners
    elevation: 2, // Adds a subtle shadow on Android
  },
  statusIndicator: {
    width: 6, // Increased width to match the screenshot
  },
  contentContainer: {
    flex: 1,
    padding: 16, // Increased padding to match the screenshot
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18, // Increased font size
    fontWeight: '500',
    flex: 1, // Takes available space, pushes badge to the right
  },
  statusBadge: {
    paddingHorizontal: 10, // Increased horizontal padding
    paddingVertical: 4, // Added vertical padding
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
  }
})