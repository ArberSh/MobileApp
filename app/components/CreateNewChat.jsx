import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { FriendsContext } from './FriendsContext'; // Make sure this path is correct
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const CreateNewChat = () => {
  const { colors } = useTheme();
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

  // Create styles with current theme colors
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 26,
      fontFamily: "Lexend-Bold",
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: "Lexend-Bold",
      textAlign: 'center',
      marginBottom: 30,
    },
    inputLabel: {
      color: colors.text,
      fontSize: 14,
      fontFamily: "Lexend-Bold",
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      backgroundColor: colors.input,
      borderRadius: 10,
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      padding: 12,
      color: colors.text,
      fontSize: 16,
      fontFamily: "Lexend",
    },
    successTitle: {
      color: colors.text,
      fontSize: 24,
      fontFamily: "Lexend-Bold",
      marginBottom: 16,
    },
    successText: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: "Lexend",
      marginBottom: 8,
    },
    successSubtext: {
      color: colors.subText,
      fontSize: 14,
      textAlign: 'center',
      fontFamily: "Lexend",
      marginTop: 20,
    }
  });

  return (
    <View style={themedStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={themedStyles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {requestSent ? (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-outline" size={40} color="white" />
          </View>
          <Text style={themedStyles.successTitle}>Friend Request Sent!</Text>
          <Text style={themedStyles.successText}>
            Your friend request to @{username} has been sent successfully.
          </Text>
          <Text style={themedStyles.successSubtext}>
            Redirecting back to friends list...
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={themedStyles.title}>
            Add Friend
          </Text>
          <Text style={themedStyles.subtitle}>
            Enter a username to send them a request.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={themedStyles.inputLabel}>
              Username
            </Text>
            <View style={themedStyles.inputWrapper}>
              <Ionicons name="at-outline" size={24} color={colors.subText} style={styles.inputIcon}/>
              <TextInput 
                style={themedStyles.input}
                placeholder="Enter username"
                placeholderTextColor={colors.subText}
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
              style={[styles.cancelButton,,{backgroundColor:colors.input}]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText,{backgroundColor:colors.text}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton ]}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 16,
  },
  inputIcon: {
    marginRight: 8,
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
});

export default CreateNewChat;