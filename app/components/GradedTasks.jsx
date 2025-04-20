import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Task from './Repeats/Task';
import { Ionicons } from '@expo/vector-icons';
import GradedtasksData from '../gradedtasks.json';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const GradedTaskCard = ({ task }) => {
  const { colors } = useTheme();
  
  // Helper function to determine grade color
  const getGradeColor = (grade) => {
    if (grade >= 9) return '#66BB6A'; // A - Green
    if (grade >= 8) return '#81C784'; // B - Light Green
    if (grade >= 7) return '#FFA726'; // C - Orange
    if (grade >= 6) return '#FF7043'; // D - Light Red
    return '#FF5252'; // F - Red
  };

  // Format the graded date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${month} ${day} at ${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <View 
      style={[styles.taskCard, { backgroundColor: colors.cardBackground }]}
    >
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.taskName}</Text>
          <View style={[styles.gradeCircle, { backgroundColor: getGradeColor(task.grade) }]}>
            <Text style={styles.gradeText}>{task.grade}</Text>
          </View>
        </View>
        <Text style={styles.groupName}>{task.groupName}</Text>
        <Text style={[styles.gradedText, { color: colors.subText }]}>Graded: {formatDate(task.dateGraded)}</Text>
        <Text style={[styles.feedbackText, { color: colors.text }]}>{task.feedback}</Text>
      </View>
    </View>
  );
};

const GradedTasks = () => {
  const { colors } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState('all'); // 'all', or a specific groupId

  // Get the graded tasks data
  const gradedTasks = GradedtasksData.gradedAssignments;
  
  // Get unique groups from the data
  const groups = [...new Set(gradedTasks.map(task => task.groupName))];
  
  // Filter tasks based on the selected group
  const getFilteredTasks = () => {
    if (selectedGroup === 'all') {
      return gradedTasks;
    } else {
      return gradedTasks.filter(task => task.groupName === selectedGroup);
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.filterContainer, { backgroundColor: colors.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: colors.cardBackground },
              selectedGroup === 'all' && {
        backgroundColor: '#7a92af', // Use your active color from theme
      }
            ]}
            onPress={() => setSelectedGroup('all')}
          >
            <Text style={[styles.filterText, { color: 'white'}]}>All Groups</Text>
          </TouchableOpacity>
          
          {groups.map(group => (
            <TouchableOpacity 
              key={group}
              style={[
                styles.filterButton, 
                { backgroundColor: colors.cardBackground },
                selectedGroup === group && {
        backgroundColor: '#7a92af', // Use your active color from theme
      }
              ]}
              onPress={() => setSelectedGroup(group)}
            >
              <Text style={[styles.filterText, { color: 'white' }]}>{group}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {getFilteredTasks().map(task => (
          <GradedTaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterContainer: {
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterScrollView: {
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  filterText: {
    fontWeight: '500',
  },
  taskCard: {
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  taskCardContent: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  gradeCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  groupName: {
    color: '#4C89F5',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  gradedText: {
    fontSize: 14,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GradedTasks;