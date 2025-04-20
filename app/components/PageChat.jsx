import {
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router/stack";
import { ScrollView } from "react-native-gesture-handler";
import GroupCard from "./Repeats/GroupCard";
import { useNavigation } from "@react-navigation/core";
import TaskCard from "./Repeats/TaskCard";
import tasks from '../tasks.json';
import users from '../users.json'; // Import users data
import Text from './CustomText';
import { useTheme } from './ThemeContext'; // Import the useTheme hook

// Color generation utility - creates a deterministic color from a string
const generateConsistentColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 50%)`;
};

const PageChat = () => {
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");
  const { colors, isDark, toggleTheme } = useTheme(); // Get theme context

  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(false);
  const [dimensions, setDimensions] = useState({ heightWindow: height });
  const [bigger, setBigger] = useState(false);
  const [tasksData] = useState(tasks.tasks);
  
  // Create a memo-ized map of user colors that will be consistent and not change on re-renders
  const userColorMap = useMemo(() => {
    const colorMap = {};
    users.forEach(user => {
      // Generate a consistent color using the user's ID
      colorMap[user.id] = generateConsistentColor(user.id);
    });
    return colorMap;
  }, []); // Empty dependency array means this runs only once
  
  // Filter to find only online users - MOVED HERE to avoid duplicate declaration
  const onlineUsers = users.filter(user => user.isOnline === true);

  useEffect(() => {
    if (dimensions.heightWindow < 700) setBigger(true);
  }, [dimensions.heightWindow]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ heightWindow: window.height });
    });
    return () => subscription?.remove();
  }, []);

  // Function to get avatar image URI or use default based on first letter of name
  const getAvatarSource = (user) => {
    if (user.profilePicture) {
      return { uri: user.profilePicture };
    }
    
    // Use the consistent color from our memo-ized map
    return { 
      isDefaultAvatar: true,
      initial: user.name.charAt(0).toUpperCase(),
      color: userColorMap[user.id]
    };
  };

  // Function to navigate with animation
  const navigateToNotifications = () => {
    navigation.navigate('Notifications', {}, {
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 300,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 300,
          },
        },
      },
      cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        };
      },
    });
  };

  const categorizeTasks = () => {
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);
    
    const overdueItems = [];
    const dueSoonItems = [];
    const completedItems = [];
    const upcomingItems = [];
    
    tasks.tasks.forEach(task => {
      // Skip tasks with missing or invalid properties
      if (!task || !task.dueDate || !task.title || !task.id || isNaN(new Date(task.dueDate).getTime())) {
        return;
      }
      
      if (task.completed) {
        completedItems.push({ ...task, status: 'completed' });
        return;
      }
      
      const dueDate = new Date(task.dueDate);
      if (dueDate < currentDate) {
        overdueItems.push({ ...task, status: 'overdue' });
      } else if (dueDate <= threeDaysFromNow) {
        dueSoonItems.push({ ...task, status: 'dueSoon' });
      } else {
        upcomingItems.push({ ...task, status: 'upcoming' });
      }
    });
    
    // Sort each category by date (newest to oldest)
    const sortByDateDesc = (a, b) => new Date(b.dueDate) - new Date(a.dueDate);
    
    overdueItems.sort(sortByDateDesc);
    dueSoonItems.sort(sortByDateDesc);
    completedItems.sort(sortByDateDesc);
    upcomingItems.sort(sortByDateDesc);
    
    return { 
      overdue: overdueItems, 
      dueSoon: dueSoonItems, 
      completed: completedItems, 
      upcoming: upcomingItems 
    };
  };

  // Function to get all tasks sorted by date (newest to oldest)
  const getAllTasksSorted = () => {
    const categories = categorizeTasks();
    
    // Combine all tasks into one array
    const allTasks = [
      ...categories.overdue,
      ...categories.dueSoon,
      ...categories.upcoming,
      ...categories.completed
    ];
    
    // Filter out unknown tasks (those with missing or invalid dates/properties)
    const validTasks = allTasks.filter(task => {
      // Check if task has valid date and other required properties
      return task && 
             task.dueDate && 
             task.title && 
             task.id &&
             !isNaN(new Date(task.dueDate).getTime());
    });
    
    // Sort by date (newest to oldest)
    return validTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  };

  // Render a default avatar for users without profile pictures
  const renderDefaultAvatar = (avatarInfo) => {
    return (
      <View 
        style={{
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: avatarInfo.color,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{
          color: 'white',
          fontSize: 26,
          fontWeight: 'bold'
        }}>
          {avatarInfo.initial}
        </Text>
      </View>
    );
  };
  
  // Filter tasks based on selected filter
  const getFilteredTasks = () => {
    const allTaskCategories = categorizeTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    
    const endOfWeek = new Date(today);
    // Set to the end of this week (next Sunday)
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // By default, don't include completed tasks in any filter
    let filteredTasks = [];
    
    switch (filter) {
      case 'today':
        filteredTasks = [...allTaskCategories.overdue, ...allTaskCategories.dueSoon, ...allTaskCategories.upcoming]
          .filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate <= endOfToday;
          });
        break;
      case 'week':
        filteredTasks = [...allTaskCategories.overdue, ...allTaskCategories.dueSoon, ...allTaskCategories.upcoming]
          .filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate <= endOfWeek;
          });
        break;
      case 'month':
        filteredTasks = [...allTaskCategories.overdue, ...allTaskCategories.dueSoon, ...allTaskCategories.upcoming]
          .filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate <= endOfMonth;
          });
        break;
      case 'overdue':
        filteredTasks = allTaskCategories.overdue;
        break;
      case 'all':
      default:
        // Still exclude completed tasks from 'all' filter
        filteredTasks = [
          ...allTaskCategories.overdue,
          ...allTaskCategories.dueSoon,
          ...allTaskCategories.upcoming
        ];
        break;
    }
    
    // Sort by date (newest first)
    return filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  };
  
  // Filter button component
  const FilterButton = ({ title, value }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === value ? '#7a92af' : 'transparent',
          borderColor: '#7a92af',
          borderWidth: 1,
        },
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: filter === value ? 'white' : colors.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.safeArea, { 
      height: dimensions.heightWindow,
      backgroundColor: colors.background, // Apply theme background color
    }]}>
      <View style={styles.container}>
        <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                <Ionicons 
                  size={28} 
                  color={colors.text} 
                  name={isDark ? "sunny-outline" : "moon-outline"} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToNotifications}>
                <Ionicons size={32} color={colors.text} name="notifications-outline" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView>
            {/* Friends Section - Updated to display online users from JSON */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Friends</Text>
              <View style={styles.friendsContainer}>
                {onlineUsers.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {onlineUsers.map(user => {
                      const avatarSource = getAvatarSource(user);
                      return (
                        <TouchableOpacity
                          key={user.id}
                          onPress={() => {
                            navigation.navigate("ChatRoom", { userId: user.id });
                          }}
                        >
                          <View style={{ marginHorizontal: 12 }}>
                            {avatarSource.isDefaultAvatar ? (
                              // Render colored circle with initials for default avatar
                              <View style={{ marginTop: 10 }}>
                                {renderDefaultAvatar(avatarSource)}
                              </View>
                            ) : (
                              // Render image for users with profile pictures
                              <Image
                                style={{
                                  marginTop: 10,
                                  width: 60,
                                  height: 60,
                                  borderRadius: 100,
                                }}
                                source={avatarSource}
                              />
                            )}
                            <Text style={{ color: colors.text, textAlign: "center", marginTop: 4 }}>
                              {user.name.split(' ')[0]} {/* Show only first name */}
                            </Text>
                            <View style={styles.onlineIndicator} />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.noOnlineUsersContainer}>
                    <Ionicons name="people-outline" size={24} color={colors.subText} />
                    <Text style={[styles.noOnlineUsersText, { color: colors.subText }]}>
                      No friends are online at the moment
                    </Text>
                  </View>
                )}
              </View>
            </View> 

            {/* Groups Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Groups</Text>
              <View style={styles.groupsContainer}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginHorizontal: 12 }}>
                    <View
                      style={{
                        backgroundColor: "lightgreen",
                        marginTop: 10,
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                      }}
                    ></View>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                      group1
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: 12 }}>
                    <View
                      style={{
                        backgroundColor: "lightblue",
                        marginTop: 10,
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                      }}
                    ></View>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                      group2
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: 12 }}>
                    <View
                      style={{
                        backgroundColor: "lightyellow",
                        marginTop: 10,
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                      }}
                    ></View>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                      group3
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Tasks Section with filters */}
            <View style={styles.tasksSection}>
              <View style={styles.tasksSectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
              </View>
              
              {/* Task filters */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContentContainer}
              >
                <FilterButton title="All" value="all" />
                <FilterButton title="Today" value="today" />
                <FilterButton title="This Week" value="week" />
                <FilterButton title="This Month" value="month" />
                <FilterButton title="Overdue" value="overdue" />
              </ScrollView>
              
              <View style={styles.tasksContainer}>
                {getFilteredTasks().length > 0 ? (
                  getFilteredTasks().map(task => {
                    const dueDate = new Date(task.dueDate);
                    return (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        date={dueDate.toLocaleDateString('en-CA')}
                        clock={dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        status={task.status}
                        description={task.description}
                        assignedBy={task.assignedBy}
                        theme={colors} // Pass theme colors to TaskCard
                      />
                    );
                  })
                ) : (
                  <View style={[styles.noTasksContainer, { backgroundColor: colors.cardBackground }]}>
                    <Ionicons name="calendar-outline" size={32} color={colors.subText} />
                    <Text style={[styles.noTasksText, { color: colors.subText }]}>
                      No tasks found for this filter
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: "Lexend-SemiBold",
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingBottom: 6
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontFamily:'Lexend-Bold'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    marginRight: 16,
  },
  tasksSection: {
    marginTop: 20,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  filtersContentContainer: {
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
  },
  tasksContainer: {
    marginVertical: 10,
  },
  friendsContainer: {
    width: "100%",
    minHeight: 100,
  },
  groupsContainer: {
    flexDirection: "row",
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#3F414A',
  },
  noOnlineUsersContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
  },
  noOnlineUsersText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
  },
  noTasksContainer: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTasksText: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    marginTop: 8,
  }
});

export default PageChat;