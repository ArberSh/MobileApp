import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Task from './Repeats/Task';
import { Ionicons } from '@expo/vector-icons';
import GradedtasksData from '../gradedtasks.json';
import Text from './CustomText';

const GradedTaskCard = ({ task }) => {
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
    <TouchableOpacity 
      style={styles.taskCard}
    >
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.taskName}</Text>
          <View style={[styles.gradeCircle, { backgroundColor: getGradeColor(task.grade) }]}>
            <Text style={styles.gradeText}>{task.grade}</Text>
          </View>
        </View>
        <Text style={styles.groupName}>{task.groupName}</Text>
        <Text style={styles.gradedText}>Graded: {formatDate(task.dateGraded)}</Text>
        <Text style={styles.feedbackText}>{task.feedback}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GradedTasks = () => {
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest'

  // Get the graded tasks data
  const gradedTasks = GradedtasksData.gradedAssignments;

  // Sort the tasks based on the selected filter
  const getSortedTasks = () => {
    switch(sortBy) {
      case 'highest':
        return [...gradedTasks].sort((a, b) => b.grade - a.grade);
      case 'lowest':
        return [...gradedTasks].sort((a, b) => a.grade - b.grade);
      case 'recent':
      default:
        return [...gradedTasks].sort((a, b) => 
          new Date(b.dateGraded) - new Date(a.dateGraded)
        );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.filterContainer}>
        <Text style={styles.headerText}>Graded Assignments</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'recent' && styles.activeFilter]}
            onPress={() => setSortBy('recent')}
          >
            <Text style={styles.filterText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'highest' && styles.activeFilter]}
            onPress={() => setSortBy('highest')}
          >
            <Text style={styles.filterText}>Highest</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'lowest' && styles.activeFilter]}
            onPress={() => setSortBy('lowest')}
          >
            <Text style={styles.filterText}>Lowest</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.container}>
        {getSortedTasks().map(task => (
          <GradedTaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E1E',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#3F414A',
  },
  activeFilter: {
    backgroundColor: '#555766',
  },
  filterText: {
    color: 'white',
    fontWeight: '500',
  },
  taskCard: {
    backgroundColor: '#3F414A',
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
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  gradeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupName: {
    color: '#4C89F5',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  gradedText: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 8,
  },
  feedbackText: {
    color: '#c8c8c8',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GradedTasks;