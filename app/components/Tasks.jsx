import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import Task from './Repeats/Task';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Alert from '../assets/danger.png'

const Tasks = () => {
  return (
    <View style={{
      flex:1,
      backgroundColor:'#1E1E1E',
    }}>
      <Text style={styles.text}>Assignments</Text>
    <ScrollView style={styles.container}>
      <View style={{
        backgroundColor:'#27272C',
        padding:10,
        borderRadius:20,
      }}>
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        gap:6
      }}>
        <Image style={{width:24,resizeMode : 'contain',height:24}} source={require("../assets/danger.png")}></Image>
      <Text style={{color:'#FF5252',fontSize:24,fontFamily:'Poppins-Bold',paddingTop:2}}>Overdue</Text>
      </View>
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
    </View>
    <View style={{
        backgroundColor:'#27272C',
        padding:10,
        borderRadius:20,
        marginTop:14
      }}>
        <View style={{
        flexDirection:'row',
        alignItems:'center',
        gap:6
      }}>
        <Ionicons name='alert-circle-outline' color='#FFA726' size={28}></Ionicons>
      <Text style={{color:'#FFA726',fontSize:24,fontFamily:'Poppins-Bold'}}>Due Soon</Text>
      </View>
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
    </View>
    <View style={{
        backgroundColor:'#27272C',
        padding:10,
        borderRadius:20,
        marginTop:14
      }}>
        <View style={{
        flexDirection:'row',
        alignItems:'center',
        gap:6
      }}>
        <Ionicons name='checkmark-outline' color='#66BB6A' size={28}></Ionicons>
      <Text style={{color:'#66BB6A',fontSize:24,fontFamily:'Poppins-Bold'}}>Completed</Text>
      </View>
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
    </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
    backgroundColor: '#1E1E1E',
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