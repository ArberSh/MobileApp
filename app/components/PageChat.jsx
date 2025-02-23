import { View, Text, SafeAreaView, Dimensions, StyleSheet, TouchableOpacity,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router/stack';
import { ScrollView } from 'react-native-gesture-handler';
import GroupCard from './Repeats/GroupCard';
import { useNavigation } from '@react-navigation/core';


const PageChat = () => {
 
  const navigation = useNavigation();
  

  const { height } = Dimensions.get('window'); 

  const [dimensions, setDimensions] = useState({
    heightWindow: height,
  });
  const [bigger,setbigger] = useState(false)

  useEffect(() => {
    if(dimensions.heightWindow < 700)
    setbigger(true); 
  }, [dimensions.heightWindow]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ heightWindow: window.height }); 
    });

    return () => subscription?.remove(); 
  }, []);

  console.log('Window Height:', dimensions.heightWindow);

  return (
    <SafeAreaView style={[styles.safeArea, { height: dimensions.heightWindow }]}>
      <View style={styles.container}>
        <View style={[styles.mainContent, { height: dimensions.heightWindow }]}>
          <Text style={styles.title}>Dashboard</Text>
          <View>
                    <View>
                <Text style={styles.sectionTitle}>Friends
                </Text>
                </View>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('ChatRoom')}}>
                    <View style={{marginHorizontal:12}}>
                    <Image style={{marginTop:10,width:60,height:60,borderRadius:100}} source={{ uri: 'https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000' }} />
                    <Text style={{color:'white',textAlign:'center'}}>Kevin</Text>
                    </View>
                      </TouchableOpacity>            
                    <TouchableOpacity onPress={()=>{navigation.navigate('ChatRoom')}}>
                    <View style={{marginHorizontal:12}}>
                    <Image style={{marginTop:10,width:60,height:60,borderRadius:100}} source={{ uri: 'https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg' }} />
                    <Text style={{color:'white',textAlign:'center'}}>Aleks</Text>     
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.navigate('ChatRoom')}}>
                    <View style={{marginHorizontal:12}}>
                    <Image style={{marginTop:10,width:60,height:60,borderRadius:100}} source={{ uri: 'https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000' }} />
                    <Text style={{color:'white',textAlign:'center'}}>user1</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Groups</Text>  
                </View>
                <View style={{
                  flexDirection:'row'
                }}>
                    <View style={{marginHorizontal:12}}>
                    <View style={{backgroundColor:'lightgreen' ,marginTop:10,width:60,height:60,borderRadius:100 }}></View>
                    <Text style={{color:'white',textAlign:'center'}}>group1</Text>
                    </View>
                    <View style={{marginHorizontal:12}}>
                    <View style={{backgroundColor:'lightblue' ,marginTop:10,width:60,height:60,borderRadius:100 }}></View>
                    <Text style={{color:'white',textAlign:'center'}}>group2</Text>
                    </View>
                    <View style={{marginHorizontal:12}}>
                    <View style={{backgroundColor:'lightyellow' ,marginTop:10,width:60,height:60,borderRadius:100 }}></View>
                    <Text style={{color:'white',textAlign:'center'}}>group3</Text>
                    </View>
                </View>
                <View>
                <View style={{marginTop:20}}>
                <Text style={{
                    color:'white',
                    fontSize:32,
                    fontFamily:'Poppins-Bold'
                }}>Tasks
                </Text>
                </View>
                <TouchableOpacity style={{backgroundColor:'#2a2a2a',width:'100%',height:110,borderRadius:20,marginBottom:10}}>
                    <View style={{padding:12,flexDirection:'row'}}>
                        <View> 
                             <View style={{
                                backgroundColor:'pink',
                                width:40,
                                height:40,
                                borderRadius:100
                            }}></View>
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text style={{color:'white',fontWeight:'800'}}>User1</Text>
                            <Text style={{color:'white'}}>Group1</Text>
                        </View>
                    </View>
                        <View>
                        <Text style={{color:'white',fontWeight:'700',marginHorizontal:20,fontSize:18}}>Build a Home-Page Website</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'#2a2a2a',width:'100%',height:110,borderRadius:20}}>
                    <View style={{padding:12,flexDirection:'row'}}>
                        <View> 
                             <View style={{
                                backgroundColor:'lightgreen',
                                width:40,
                                height:40,
                                borderRadius:100
                            }}></View>
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text style={{color:'white',fontWeight:'800'}}>User2</Text>
                            <Text style={{color:'white'}}>Group4</Text>
                        </View>
                    </View>
                        <View>
                        <Text style={{color:'white',fontWeight:'700',marginHorizontal:20,fontSize:18}}>Create a PowerPoint </Text>
                    </View>
                </TouchableOpacity>
                {bigger ? <TouchableOpacity style={{backgroundColor:'black',width:360,height:110,borderRadius:20,marginVertical:10}}>
                    <View style={{padding:12,flexDirection:'row'}}>
                        <View> 
                             <View style={{
                                backgroundColor:'orange',
                                width:40,
                                height:40,
                                borderRadius:100
                            }}></View>
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text style={{color:'white',fontWeight:'800'}}>User6</Text>
                            <Text style={{color:'white'}}>Group6</Text>
                        </View>
                    </View>
                        <View>
                        <Text style={{color:'white',fontWeight:'700',marginHorizontal:20,fontSize:18}}>Import DataBase</Text>
                    </View>
                </TouchableOpacity> : <></>}
                
                </View>
             
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarTop: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sidebarBottom: {
    paddingHorizontal: 20,
  },
  sidebarText: {
    color: 'white',
  },
  icon: {
    marginVertical: 12,
  },
  mainContent: {
    width: '100%',
    backgroundColor: 'black',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
  },
});

export default PageChat;
