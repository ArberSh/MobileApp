import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Text from './CustomText';
import RegularTasks from './RegularTasks';
import GradedTasks from './GradedTasks';
import { useTheme } from './ThemeContext';

const Tasks = () => {
  const { colors, isDark } = useTheme();
  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{paddingHorizontal: 20}}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          Assignments
        </Text>
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.background }],
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: { backgroundColor: colors.text, height: 2 },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.subText,
        }}
      >
        <Tab.Screen 
          name="Tasks" 
          component={RegularTasks}
          options={{ title: 'Tasks' }}
        />
        <Tab.Screen 
          name="GradedTasks" 
          component={GradedTasks}
          options={{ title: 'Graded Tasks' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontFamily: 'Lexend-Bold',
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    textTransform: 'capitalize',
  },
});

export default Tasks;