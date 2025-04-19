import { StyleSheet,  TouchableOpacity, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { FriendsContext } from './FriendsContext'; // Make sure this path is correct
import Text from './CustomText';

const CreateNewChat = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const navigation = useNavigation();
  const { addFriend } = useContext(FriendsContext); // Make sure FriendsContext exists and provides addFriend

  const handleUsernameChange = (text) => {
    setUsername(text);
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSendRequest = () => {
    if (!username.trim()) {
      setErrorMessage('Please enter a username');
      return;
    }
    
    // Create a new friend object
    const newFriend = {
      id: Date.now().toString(), // Generate a unique ID
      name: username,
      bio: "New friend",
      isOnline: true, // Default to online
      profilePicture: null, // Default profile picture (you can add a placeholder)
      notification: 0
    };
    
    // Add the friend to the context
    addFriend(newFriend);
    
    // Show success message
    setRequestSent(true);
    
    // Navigate back after a delay
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
      
      {requestSent ? (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-outline" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>Friend Request Sent!</Text>
          <Text style={styles.successText}>
            Your friend request to @{username} has been sent successfully.
          </Text>
          <Text style={styles.successSubtext}>
            Redirecting back to friends list...
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>
            Add Friend
          </Text>
          <Text style={styles.subtitle}>
            Enter a username to send them a request.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Username
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="at-outline" size={24} color="#5E5E5E" style={styles.inputIcon}/>
              <TextInput 
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor="#9E9E9E"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendRequest}
            >
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontFamily: "Lexend-Bold",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: "#6E6E6E",
    fontSize: 14,
    fontFamily: "Lexend-Bold",
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: "Lexend-Bold",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#2A2C32',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    color: 'white',
    fontSize: 16,
    fontFamily: "Lexend",
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Lexend",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  cancelButton: {
    backgroundColor: '#3f4147',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#1c9121',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "Lexend-Bold",
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2ca831',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    marginBottom: 16,
  },
  successText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Lexend",
    marginBottom: 8,
  },
  successSubtext: {
    color: '#6E6E6E',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: "Lexend",
    marginTop: 20,
  }
});

export default CreateNewChat;