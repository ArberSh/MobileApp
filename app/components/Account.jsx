import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      }}>
      <Text style={styles.text}>Profile</Text>
      <TouchableOpacity>
        <View style={{
          width:50,
          height:50,
          borderRadius:8,
          backgroundColor:'gray'
        }}></View>
      </TouchableOpacity>
      </View>
      <View style={{
        flexDirection:'row'
      }}>
        <View
        style={{
          backgroundColor:'green',
          width:140,
          height:140,
          borderRadius:100
        }}>
        </View>
        {/* <Image/> */}
        <View>
          <Text style={styles.text}>Nickname</Text>
          <Text style={styles.text}>Arber</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    paddingVertical:26,
    backgroundColor: 'black',
  },
  text: {
    padding:10,
    color: 'white',
    fontSize: 36,
    fontFamily:'Poppins-Bold'
  },
});

export default AccountScreen;