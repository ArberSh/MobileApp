import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';

const { height } = Dimensions.get("window");

const Login = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Display a fallback UI while fonts load
  }
  const navigation = useNavigation();

  // Navigate directly to the pagechat screen
  const handleLogin = () => {
    navigation.navigate('pagechat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us today and unlock the power of collaboration.</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your email"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your password"
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your password"
        />
      </View>
      <View>

      <TouchableOpacity style={{
        padding:16,
        backgroundColor:'#00c9bd',
        marginVertical:24,
        borderRadius:8,
      }} onPress={handleLogin}>
         <Text
         style={{
            fontFamily:'Poppins-Bold',
            color:'white',
            textAlign:'center',
            fontSize:20,
         }}
         
         >Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        padding:16,
        width:'70%',
        alignSelf:'center'
      }}onPress={() => navigation.navigate("login")}>
         <Text
         style={{
            fontFamily:'Poppins-Medium',
            color:'white',
            textAlign:'center',
            fontSize:16,
         }}
         
         >Already have an account</Text>
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
                backgroundColor:'#1E1E1E',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-google" size={32} color="#00c9bd" />
            </TouchableOpacity><TouchableOpacity
            style={{
                padding:8,
                backgroundColor:'#1E1E1E',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-facebook" size={32} color="#00c9bd" />
            </TouchableOpacity>
            <TouchableOpacity
            style={{
                padding:8,
                backgroundColor:'#1E1E1E',
                borderRadius:4,
                marginHorizontal:16
            }}
            >
            <Ionicons name="logo-apple" size={32} color="#00c9bd" />
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
    backgroundColor: "black",
  },
  header: {
    marginTop: height / 14,
    alignItems: "center",
    paddingVertical: 6,
  },
  title: {
    color: "#00c9bd",
    fontFamily: "Poppins-Bold",
    fontSize: 30,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins-Medium",
    marginTop: 10,
    textAlign:'center',
    color:'white'
  },
  inputContainer: {
    marginTop: 20,
    alignItems:'center'
  },
  input: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
    color: "white",
    marginTop:20,
    width:'95%'
  },
});

export default Login;