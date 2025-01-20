import { View, Text, SafeAreaView, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';



const PageChat = () => {

    const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });
    const { height } = Dimensions.get('window');

  return (
    <SafeAreaView>
        <View
        style={{
            flex:1,
            flexDirection:'row'
        }}
        >
            <View
            style={[styles.container, { height }]}
            >
                <View
                    style={{
                    paddingHorizontal:20,
                    paddingTop:30
                    }}>
                <Text style={{
                    color:'white'
                }}>
                    Logo here
                </Text>

                 
                <Ionicons style={{marginVertical:12,marginTop:32}} name="home" size={32} color="white" />
                <Ionicons style={{marginVertical:12}} name="search" size={32} color="white" />
                <Ionicons style={{marginVertical:12}} name="reader-outline" size={32} color="white" />
                </View>

                <View style={{
      paddingHorizontal:20

                }}>
                <Ionicons style={{marginVertical:10}} name="settings" size={32} color="white" />
                <Ionicons style={{marginVertical:10}} name="person-circle" size={32} color="white" />
                </View>

            </View>
            <View
            style={{
                width:'80%',
                height:'1000',
                backgroundColor:'#5d5d5d',
                paddingTop:30,
                paddingHorizontal:10
            }}
            >
                <Text style={{
                    color:'white',
                    fontSize:40,
                    fontFamily:'Poppins-Bold'
                }}>Dashboard
                </Text>
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
                <View style={{backgroundColor:'black',width:300,height:140}}></View>
                <View style={{marginTop:20,backgroundColor:'black',width:300,height:140}}></View>
                </View>
            </View>
        </View>
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      width: '20%',
      backgroundColor: 'black',
      paddingVertical:20,
      justifyContent:'space-between',
    },
  });

export default PageChat