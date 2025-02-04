import { View, Text, SafeAreaView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router/stack';


const PageChat = () => {
 

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
                <Text style={{
                    color:'white',
                    fontSize:32,
                    fontFamily:'Poppins-Bold'
                }}>Friends
                </Text>
                </View>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <View style={{marginHorizontal:12}}>
                    <Ionicons style={{marginTop:10}} name="person-circle" size={50} color="white" />
                    <Text style={{color:'white',textAlign:'center'}}>user1</Text>
                    </View>
                    <View style={{marginHorizontal:12}}>
                    <Ionicons style={{marginTop:10}} name="person-circle" size={50} color="white" />
                    <Text style={{color:'white',textAlign:'center'}}>user1</Text>
                    </View>
                    <View style={{marginHorizontal:12}}>
                    <Ionicons style={{marginTop:10}} name="person-circle" size={50} color="white" />
                    <Text style={{color:'white',textAlign:'center'}}>user1</Text>
                    </View>
                </View>
                </View>
                <View>
                <View style={{marginTop:20}}>
                <Text style={{
                    color:'white',
                    fontSize:32,
                    fontFamily:'Poppins-Bold'
                }}>Groups
                </Text>
                </View>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <View style={{marginHorizontal:12}}>
                    <Ionicons style={{marginTop:10}} name="person-circle" size={50} color="white" />
                    <Text style={{color:'white',textAlign:'center'}}>group 1</Text>
                    </View>
                    <View style={{marginHorizontal:12}}>
                    <Ionicons style={{marginTop:10}} name="person-circle" size={50} color="white" />
                    <Text style={{color:'white',textAlign:'center'}}>group 2</Text>
                    </View>
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
                <TouchableOpacity style={{backgroundColor:'black',width:360,height:110,borderRadius:20,marginBottom:10}}>
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
                <TouchableOpacity style={{backgroundColor:'black',width:360,height:110,borderRadius:20}}>
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
    backgroundColor: '#2A2C32',
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
