import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import Text from './CustomText';
import { useAuth } from './Auth';

const { height } = Dimensions.get("window");

const Register = () => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for validation errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigation = useNavigation();
  const { signup } = useAuth();

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
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers and underscores';
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
  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await signup(email, password, username);
        // Navigate directly without Alert
        navigation.navigate('pagechat');
      } catch (error) {
        let errorMessage = "Failed to create an account.";
        
        if (error.code === 'auth/email-already-in-use') {
          setErrors(prev => ({ ...prev, email: "Email is already in use." }));
        } else if (error.code === 'auth/invalid-email') {
          setErrors(prev => ({ ...prev, email: "Invalid email format." }));
        } else if (error.code === 'auth/weak-password') {
          setErrors(prev => ({ ...prev, password: "Password is too weak." }));
        } else if (error.code === 'auth/username-already-in-use') {
          setErrors(prev => ({ ...prev, username: "Username is already taken. Please choose another." }));
        }
      
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    // Update the field value
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':  
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    
    // Clear the error for this field if there is one
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          onChangeText={(text) => handleInputChange('username', text)}
          autoCapitalize="none"
        />
        {renderErrorMessage(errors.username)}
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Enter your email"
          value={email}
          onChangeText={(text) => handleInputChange('email', text)}
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
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />
        {renderErrorMessage(errors.password)}
        
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          style={styles.input}
          accessibilityLabel="Confirm your password"
          value={confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          secureTextEntry
        />
        {renderErrorMessage(errors.confirmPassword)}
      </View>
      <View>
        <TouchableOpacity 
          style={{
            padding: 16,
            backgroundColor: loading ? '#8ba5c4' : '#7a92af',
            marginVertical: 24,
            borderRadius: 8,
          }} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
            }}
          >
            {loading ? "Creating Account..." : "Sign up"}
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
    color: "#7a92af",
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