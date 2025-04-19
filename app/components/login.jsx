import React from 'react';
import { SafeAreaView, StyleSheet,  TextInput, TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import Text from './CustomText';



const Login = () => {
  const [fontsLoaded] = useFonts({
    "Lexend-Medium": require("../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
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
      </View>
      <View>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily:'Lexend-Medium',
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
              fontFamily:'Lexend-Bold',
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
              fontFamily:'Lexend-Medium',
              color:'white',
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
              fontFamily:'Lexend-Medium',
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
          </TouchableOpacity>
          <TouchableOpacity
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
    marginTop: 100,
    alignItems: "center",
    paddingVertical: 6,
  },
  title: {
    color: "#00c9bd",
    fontFamily: "Lexend-Bold",
    fontSize: 30,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Lexend-Medium",
    marginTop: 10,
    color:'white'
  },
  inputContainer: {
    marginTop: 20,
    alignItems:'center'
  },
  input: {
    fontFamily: "Lexend-Medium",
    fontSize: 14,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
    color: "black",
    marginTop:20,
    width:'95%'
  },
});


export default Login;
