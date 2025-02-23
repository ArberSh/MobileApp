import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'


const Task = ({finished,name,group,pfp,title,description}) => {

    const [Clicked,setClicked] = useState(false)

    useEffect(()=>{
        if(Clicked){
        console.log('Pressed')
    } 
    })
   

  return (
    <TouchableOpacity onPress={() => setClicked(true)} style={{backgroundColor:'#2a2a2a',width:340, paddingTop:10,paddingBottom:20,borderRadius:20,marginVertical:10}}>
                    <View style={{padding:12,flexDirection:'row'}}>
                        <View> 
                             <View style={{
                                backgroundColor:'lightgreen',
                                width:40,
                                height:40,
                                borderRadius:100
                            }}></View>
                        </View>
                        <View style={{justifyContent:'space-between',flexDirection:'row',width:'84%'}}>
                            <View style={{marginLeft:10}}>
                            <Text style={{color:'white',fontWeight:'800'}}>{name}</Text>
                            <Text style={{color:'white'}}>{group}</Text>
                        </View>
                        <View>
                        {finished && (
            <View style={{
              backgroundColor:'#00c9bd',
              width:26,
              height:26,
              borderRadius:100,
              justifyContent:'center',
              alignItems:'center'
            }}>
              <Ionicons name='checkmark' color='white' size={18} />
            </View>
          )}
        </View>
                        </View>
                        
                    </View>
                    <View>
                        <Text style={{color:'white',fontWeight:'700',marginHorizontal:20,fontSize:18}}>{title} </Text>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={{color:'#c8c8c8',fontWeight:'500',marginHorizontal:20,fontSize:14,paddingTop:6}}>{description} </Text>
                    </View>
                </TouchableOpacity>
  )
}

export default Task

const styles = StyleSheet.create({})