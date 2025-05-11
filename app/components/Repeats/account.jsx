import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Text from '../CustomText';
import { useTheme } from '../ThemeContext';

const Account = ({ id, name, image, text, notification = 0, status = 'offline' }) => {
  const [imageError, setImageError] = useState(false)
  const { colors } = useTheme();
  
  const randomColor = `hsl(${Math.random() * 360}, 50%, 50%)`
  const navigation = useNavigation();

  console.log(id)
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log("Navigating to chat with ID:", id);
          navigation.navigate("ChatRoom", {
            id: id, // Add the ID parameter here
            name: name,
            image: image,
            status: status === 'online' ? 'Online' : 'Offline'
          });
        }}
        
        style={{
          backgroundColor: colors.background2,
          borderRadius: 20,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.isDark ? "#5E5E5E" : "#E0E0E0"
        }}
      >
        <View style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
          {/* Profile Image Container - now with status indicator */}
          <View style={{ position: 'relative' }}>
            {(!image || imageError) ? (
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                backgroundColor: randomColor,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
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
            
            {/* Status indicator dot */}
            <View style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: status === 'online' ? '#44b700' : '#9e9e9e',
              borderWidth: 2,
              borderColor: colors.background2
            }} />
          </View>

          <View style={{ marginHorizontal: 10 }}>
            <View>
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 20 }}>
                {name}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.subText, fontSize: 16 }}>
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

export default Account