import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';


const Login = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Display a fallback UI while fonts load
  }

    const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login Here</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          style={styles.input}
          accessibilityLabel="Enter your email"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          style={styles.input}
          accessibilityLabel="Enter your password"
        />
      </View>
      <View>
<TouchableOpacity>
      <Text
      style={{
          fontFamily:'Poppins-Medium',
          fontSize:16,
          color:'#00c9bd',
          alignSelf:'flex-end',
          marginTop:12,
        }}
        >
        Forgot your Password?
      </Text>
</TouchableOpacity>
      <TouchableOpacity style={{
        padding:16,
        backgroundColor:'#00c9bd',
        marginVertical:24,
        borderRadius:8,
      }}>
         <Text
         style={{
            fontFamily:'Poppins-Bold',
            color:'white',
            textAlign:'center',
            fontSize:20,
         }}
         >Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        padding:16,
        width:'60%',
        alignSelf:'center'
      }}>
         <Text
         style={{
            fontFamily:'Poppins-Medium',
            color:'black',
            textAlign:'center',
            fontSize:16,
         }}
         onPress={() => navigation.navigate("register")}
         >Create new account</Text>
      </TouchableOpacity>

      <View 
        style={{
            marginVertical:16
        }}
      >
      <Text
         style={{
            fontFamily:'Poppins-Medium',
            color:'#00c9bd',
            textAlign:'center',
            fontSize:16,
         }}
         >Or continue with</Text>
      </View>
         <View
         style={{
            marginTop:8,
            flexDirection:'row',
            justifyContent: 'center',
         }}
         >
            <TouchableOpacity
            style={{
                padding:8,
                backgroundColor:'#e8fcf6',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-google" size={32} color="black" />
            </TouchableOpacity><TouchableOpacity
            style={{
                padding:8,
                backgroundColor:'#e8fcf6',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-facebook" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
            style={{
                padding:8,
                backgroundColor:'#e8fcf6',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-apple" size={32} color="black" />
            </TouchableOpacity>
         </View>

          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 100,
    alignItems: "center",
    paddingVertical: 6,
  },
  title: {
    color: "#00c9bd",
    fontFamily: "Poppins-Bold",
    fontSize: 30,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 20,
    alignItems:'center'
  },
  input: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    padding: 20,
    backgroundColor: "#e8fcf6",
    borderRadius: 5,
    color: "black",
    marginTop:20,
    width:'95%'
  },
});

export default Login;
