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

  return (
    <View style={[styles.safeArea, { height: dimensions.heightWindow }]}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Dashboard</Text>
            {/* Updated bell icon with custom animation navigation */}
            <TouchableOpacity onPress={navigateToNotifications}>
              <Ionicons size={32} color={'white'} name="notifications-outline" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Friends Section - Updated to display online users from JSON */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Friends</Text>
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
                            <Text style={{ color: "white", textAlign: "center", marginTop: 4 }}>
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
                    <Ionicons name="people-outline" size={24} color="#888" />
                    <Text style={styles.noOnlineUsersText}>
                      No friends are online at the moment
                    </Text>
                  </View>
                )}
              </View>
            </View> 

            {/* Groups Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Groups</Text>
              <View style={styles.groupsContainer}>
              <View
            style={{
              flexDirection: "row",
            }}
            >
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
              <Text style={{ color: "white", textAlign: "center" }}>
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
              <Text style={{ color: "white", textAlign: "center" }}>
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
              <Text style={{ color: "white", textAlign: "center" }}>
                group3
              </Text>
            </View>
          </View>
              </View>
            </View>

            {/* Tasks Section - Updated to display only overdue and due soon tasks from newest to oldest */}
            <View style={styles.tasksSection}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <View style={styles.tasksContainer}>
                {/* Display only overdue tasks, sorted newest to oldest */}
                {categorizeTasks().overdue.map(task => {
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
                    />
                  );
                })}
                
                {/* Display only due soon tasks, sorted newest to oldest */}
                {categorizeTasks().dueSoon.map(task => {
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
                    />
                  );
                })}
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
    backgroundColor: "#1E1E1E",
  },
  section: {
    marginTop: 20,
    backgroundColor: '#3F414A',
    paddingHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: "white",
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
    backgroundColor: "#1E1E1E",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontFamily:'Lexend-Bold'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tasksSection: {
    marginTop: 20,
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
    color: '#888',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
  }
});

export default PageChat;