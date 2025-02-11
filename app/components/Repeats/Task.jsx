import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Task = () => {
  return (
    <TouchableOpacity style={{backgroundColor:'black',width:360,height:110,borderRadius:20,marginVertical:10}}>
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
  )
}

export default Task

const styles = StyleSheet.create({})