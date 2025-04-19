import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Alert,ScrollView } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import Text from './CustomText';

const { height } = Dimensions.get("window");

const Register = () => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for validation errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigation = useNavigation();

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle registration
  const handleSignUp = () => {
    if (validateForm()) {
      // This is where Firebase registration will go
      console.log('Form is valid, proceed with registration');
      // For now, navigate to the chat page
      navigation.navigate('pagechat');
    } else {
      // Display an alert with all validation errors
      const errorMessages = Object.values(errors).filter(err => err !== '');
      // if (errorMessages.length > 0) {
      //   Alert.alert(
      //     "Registration Error",
      //     errorMessages.join('\n'),
      //     [{ text: "OK" }]
      //   );
      // }
    }
  };

  // Render error message below input field
  const renderErrorMessage = (errorText) => {
    if (!errorText) return null;
    return (
      <Text style={styles.errorText}>{errorText}</Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us today and unlock the power of collaboration.</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        {renderErrorMessage(errors.username)}
        
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
        
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {renderErrorMessage(errors.confirmPassword)}
      </View>
      <View>
        <TouchableOpacity 
          style={{
            padding: 16,
            backgroundColor: '#00c9bd',
            marginVertical: 24,
            borderRadius: 8,
          }} 
          onPress={handleSignUp}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{
            padding: 16,
            width: '70%',
            alignSelf: 'center'
          }}
          onPress={() => navigation.navigate("login")}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Already have an account
          </Text>
        </TouchableOpacity>

        <View 
          style={{
            marginVertical: 16
          }}
        >
          <Text
            style={{
              color: '#00c9bd',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Or continue with
          </Text>
        </View>
        
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: '#1E1E1E',
              borderRadius: 4,
              marginHorizontal: 16
            }}
          >
            <Ionicons name="logo-google" size={32} color="#00c9bd" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: '#1E1E1E',
              borderRadius: 4,
              marginHorizontal: 16
            }}
          >
            <Ionicons name="logo-facebook" size={32} color="#00c9bd" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: '#1E1E1E',
              borderRadius: 4,
              marginHorizontal: 16
            }}
          >
            <Ionicons name="logo-apple" size={32} color="#00c9bd" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    fontFamily: "Lexend-Bold",
    fontSize: 30,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Lexend-Medium",
    marginTop: 10,
    textAlign: 'center',
    color: 'white'
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  input: {
    fontFamily: "Lexend-Medium",
    fontSize: 14,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
    color: "white",
    marginTop: 20,
    width: '95%'
  },
  errorText: {
    color: '#ff6347',
    textAlign: 'left',
    width: '95%',
    marginTop: 5,
    fontSize: 12
  }
});

export default Register;