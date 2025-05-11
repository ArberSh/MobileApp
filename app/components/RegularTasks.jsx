import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Task from './Repeats/Task';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import tasks from '../tasks.json';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const RegularTasks = () => {
  const { colors } = useTheme();
  const [tasksData] = useState(tasks.tasks.filter(task => !task.isGraded));
  const [showCompleted, setShowCompleted] = useState(false);

  // Function to categorize tasks
  const categorizeTasks = () => {
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);
    
    const overdueItems = [];
    const dueSoonItems = [];
    const upcomingItems = []; // Added for upcoming tasks
    const completedItems = [];
    
    tasksData.forEach(task => {
      if (task.completed) {
        completedItems.push(task);
        return;
      }
      
      const dueDate = new Date(task.dueDate);
      
      if (dueDate < currentDate) {
        overdueItems.push(task);
      } else if (dueDate <= threeDaysFromNow) {
        dueSoonItems.push(task);
      } else {
        // Tasks due more than 3 days from now
        upcomingItems.push(task);
      }
    });
    
    return {
      overdue: overdueItems,
      dueSoon: dueSoonItems,
      upcoming: upcomingItems, // Added upcoming tasks to returned object
      completed: completedItems
    };
  };
  
  const categorizedTasks = categorizeTasks();

  // Toggle completed tasks visibility
  const toggleCompletedTasks = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Overdue Tasks */}
        {categorizedTasks.overdue.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: colors.background2 }]}>
            <View style={styles.sectionHeader}>
              <Image style={styles.icon} source={require("../assets/danger.png")}></Image>
              <Text style={styles.overdueText}>Overdue</Text>
            </View>
            {categorizedTasks.overdue.map(task => (
              <Task
                key={task.id}
                finished={task.completed}
                name={task.assignedBy}
                group={task.group}
                title={task.title}
                description={task.description}
                date={task.dueDate.split('T')[0]}
                clock={task.dueDate.split('T')[1].substring(0, 5)}
              />
            ))}
          </View>
        )}
        
        {/* Due Soon Tasks */}
        {categorizedTasks.dueSoon.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: colors.background2 }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name='alert-circle-outline' color='#FFA726' size={28}></Ionicons>
              <Text style={styles.dueSoonText}>Due Soon</Text>
            </View>
            {categorizedTasks.dueSoon.map(task => (
              <Task
                key={task.id}
                finished={task.completed}
                name={task.assignedBy}
                group={task.group}
                title={task.title}
                description={task.description}
                date={task.dueDate.split('T')[0]}
                clock={task.dueDate.split('T')[1].substring(0, 5)}
              />
            ))}
          </View>
        )}

        {/* Upcoming Tasks */}
        {categorizedTasks.upcoming.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: colors.background2 }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name='calendar-outline' color='#42A5F5' size={28}></Ionicons>
              <Text style={styles.upcomingText}>Upcoming</Text>
            </View>
            {categorizedTasks.upcoming.map(task => (
              <Task
                key={task.id}
                finished={task.completed}
                name={task.assignedBy}
                group={task.group}
                title={task.title}
                description={task.description}
                date={task.dueDate.split('T')[0]}
                clock={task.dueDate.split('T')[1].substring(0, 5)}
              />
            ))}
          </View>
        )}
        
        {/* Completed Tasks */}
        {categorizedTasks.completed.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: colors.background2 }]}>
            <TouchableOpacity 
              onPress={toggleCompletedTasks}
              style={styles.completedHeader}
            >
              <View style={styles.sectionHeader}>
                <Ionicons name='checkmark-outline' color='#66BB6A' size={28}></Ionicons>
                <Text style={styles.completedText}>
                  Completed 
                </Text>
              </View>
              <Ionicons 
                name={showCompleted ? 'chevron-up-outline' : 'chevron-down-outline'} 
                color='#66BB6A' 
                size={24}
              />
            </TouchableOpacity>
            
            {showCompleted && categorizedTasks.completed.map(task => (
              <Task
                key={task.id}
                finished={task.completed}
                name={task.assignedBy}
                group={task.group}
                title={task.title}
                description={task.description}
                date={task.dueDate.split('T')[0]}
                clock={task.dueDate.split('T')[1].substring(0, 5)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: 10
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionContainer: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 14
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  icon: {
    width: 24,
    resizeMode: 'contain',
    height: 24
  },
  overdueText: {
    color: '#FF5252',
    fontSize: 24,
    paddingTop: 2,
    fontFamily: 'Lexend-Bold'
  },
  dueSoonText: {
    color: '#FFA726',
    fontSize: 24,
    fontFamily: 'Lexend-Bold'
  },
  upcomingText: {
    color: '#42A5F5',
    fontSize: 24,
    fontFamily: 'Lexend-Bold'
  },
  completedText: {
    color: '#66BB6A',
    fontSize: 24,
    fontFamily: 'Lexend-Bold'
  }
});

export default RegularTasks;