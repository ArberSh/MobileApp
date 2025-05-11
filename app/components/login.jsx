import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import Text from './CustomText';
import { useAuth } from './Auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  
  const navigation = useNavigation();
  const { login, resetPassword } = useAuth();

  const [fontsLoaded] = useFonts({
    "Lexend-Medium": require("../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  // Render error message below input field
  const renderErrorMessage = (errorText) => {
    if (!errorText) return null;
    return (
      <Text style={styles.errorText}>{errorText}</Text>
    );
  };

  const handleLogin = async () => {
    // Reset previous errors
    setErrors({
      email: '',
      password: '',
      general: ''
    });

    // Validate inputs
    let hasError = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigation.navigate("pagechat");
    } catch (error) {
      let errorMessage = "Failed to login. Please check your credentials.";
      
      if (error.code === 'auth/user-not-found') {
        newErrors.email = "No user found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        newErrors.password = "Incorrect password.";
      } else {
        newErrors.general = errorMessage;
      }
      
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Reset previous errors
    setErrors({
      email: '',
      password: '',
      general: ''
    });

    if (!email) {
      setErrors({...errors, email: 'Please enter your email address'});
      return;
    }

    try {
      await resetPassword(email);
      setErrors({...errors, general: 'Password reset email sent!'});
    } catch (error) {
      setErrors({...errors, general: 'Failed to send password reset email. Please try again.'});
    }
  };

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
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {renderErrorMessage(errors.email)}
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {renderErrorMessage(errors.password)}
        
        {/* General error or success message */}
        {errors.general ? (
          <Text style={[
            styles.errorText, 
            errors.general.includes('sent') ? styles.successText : null
          ]}>
            {errors.general}
          </Text>
        ) : null}
      </View>
      <View>
        <TouchableOpacity 
          style={{
            padding:16,
            backgroundColor: loading ? '#8ba5c4' : '#7a92af',
            marginVertical:24,
            borderRadius:8,
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text
            style={{
              fontFamily:'Lexend-Bold',
              color:'white',
              textAlign:'center',
              fontSize:20,
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Text>
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
    color: "#7a92af",
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
    color: "white",
    marginTop:20,
    width:'95%'
  },
  errorText: {
    color: '#ff6347',
    textAlign: 'left',
    width: '95%',
    marginTop: 5,
    fontSize: 12,
    fontFamily: "Lexend-Medium"
  },
  successText: {
    color: '#7a92af'
  }
});

export default Login;