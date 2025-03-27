import { StyleSheet, Text, TouchableOpacity, View,Image} from 'react-native'
import React from 'react'

const GroupCard = ({name,photo,description,color}) => {
  return (
    <TouchableOpacity style={{
      height:120,
      borderRadius:16,
      marginTop:10,
         }}>
      <View style={{
        backgroundColor:color,
        height:'59%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding:10
      }}>
        <View style={{
          flexDirection:'row',
          alignItems:'center'
          
        }}>
          <Image source={{ uri: photo}} style={{
            width:50,
            height:50,
            borderColor:'black',
            borderWidth:1,
            borderRadius:100
          }}/>
          <Text style={{
            fontSize:20,
            marginLeft:10
          }}>
            {name}
          </Text>
        </View>
      </View>
      <View style={{
        backgroundColor:'#D9D9D9',
        height:'41%',
        borderBottomLeftRadius:16,
        borderBottomRightRadius:16
      }}>
        <View style={{
          padding:10
        }}>
        <Text style={{
          
        }}>
          {description}
        </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default GroupCard

const styles = StyleSheet.create({})