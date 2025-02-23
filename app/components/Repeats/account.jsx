import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const Account = ({ name, image, text , notification}) => {
  const [imageError, setImageError] = useState(false)
  
  const randomColor = `hsl(${Math.random() * 360}, 50%, 50%)`
  const [Notification,hasNotification] = useState(false)
      const navigation = useNavigation();

  useEffect(()=>{
    if(notification !== null){
        hasNotification(true)
  }
  },[])
  //Change here up when you will import the database.

  return (
    <View>
      <TouchableOpacity
      onPress={() => navigation.navigate("ChatRoom")}
        style={{
          backgroundColor: "black",
          width: 360,
          borderRadius: 20,
          paddingVertical: 10,
        }}
      >
        <View style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
          <View>
            {(!image || imageError) ? (
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                backgroundColor: randomColor,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold' , fontSize:24}}>
                  {name?.charAt(0)}
                </Text>
              </View>
            ) : (
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                }}
                source={{ uri: image }}
                onError={() => setImageError(true)}
              />
            )}
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <View>
              <Text style={{ color: "white", fontWeight: "800", fontSize: 20 }}>
                {name}
              </Text>
            </View>
            <View>
              <Text style={{ color: "#d3d3d3", fontSize: 16 }}>
                {text}
              </Text>
            </View>
          </View>
          <View style={{
  paddingRight: 24,
  flex: 1,
  alignItems: 'flex-end',
  justifyContent: 'flex-end'
}}>
  {notification > 0 && (
    <View style={{
      backgroundColor: '#00c9bd',
      borderRadius: 100,
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
        lineHeight: 22 // Ensures vertical centering
      }}>
        {notification > 9 ? '9+' : notification.toString()}
      </Text>
    </View>
  )}

            
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})


export default Account
