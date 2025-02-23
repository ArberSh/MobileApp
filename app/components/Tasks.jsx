import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Task from './Repeats/Task';
import { ScrollView } from 'react-native-gesture-handler';

const Tasks = () => {
  return (
    <View style={{
      flex:1,
      backgroundColor:'black',
    }}>
      <Text style={styles.text}>Tasks</Text>
    <ScrollView style={styles.container}>
      <Text style={{color:'white',fontSize:24,fontFamily:'Poppins-Bold'}}>Ongoing Tasks</Text>
      <Task
    finished={false}
    name="User2"
    group="Group5"
    title="Prepare Lecture Notes"
    description="Summarize key concepts from chapters 4-6 about quantum physics for the study group session. Include diagrams and example problems."
  />
  <Task
    finished={false}
    name="User5"
    group="Group3"
    title="Database Setup"
    description="Implement PostgreSQL database schema for user management system including tables for users, roles, and permissions."
  />
  <Task
    finished={false}
    name="User6"
    group="Group1"
    title="Prototype Development"
    description="Build interactive prototype using Figma for the e-commerce checkout flow, including payment gateway integration steps."
  />
      <Text style={{color:'white',fontSize:24,fontFamily:'Poppins-Bold'}}>Finished Tasks</Text>
      <Task
    finished={true}
    name="User1"
    group="Group4"
    title="Create PowerPoint Presentation"
    description="Develop a 15-slide deck about climate change impacts, including statistical data and visual infographics. Deadline: Friday."
  />
  <Task
    finished={true}
    name="User3"
    group="Group6"
    title="Write Final Report"
    description="Compile research findings about AI ethics into a 10-page document with proper citations and references."
  />
  <Task
    finished={true}
    name="User4"
    group="Group2"
    title="Wireframe Design"
    description="Create low-fidelity wireframes for the new mobile app featuring 5 main screens: home, profile, settings, search, and notifications."
  />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontFamily:'Poppins-Bold',
    paddingHorizontal:20,
    paddingTop:32
  },
});

export default Tasks;