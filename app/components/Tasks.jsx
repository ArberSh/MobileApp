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
      <Task></Task>
      <Task></Task>
      <Task></Task>
      <Text style={{color:'white',fontSize:24,fontFamily:'Poppins-Bold'}}>Finished Tasks</Text>
      <Task></Task>
      <Task></Task>
      <Task></Task>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    paddingTop:30,
    backgroundColor: '#2A2C32',
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