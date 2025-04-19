import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext } from 'react'
import { TextInput, ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GroupsContext } from '../components/GroupsContext';
import Text from './CustomText';


const CreateNewGroup = () => {
  // General state
  const navigation = useNavigation();
  const { addGroup } = useContext(GroupsContext);
  const [isJoinMode, setIsJoinMode] = useState(false);
  
  // Create group state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);
  
  // Join group state
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Generate a random color for the group
  const getRandomColor = () => {
    const colors = [
      '#4ea4a6', // teal
      '#6a7de8', // blue
      '#e87d7d', // red
      '#e8c77d', // yellow
      '#a67de8', // purple
      '#7de88f', // green
      '#e87dcc'  // pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Input handlers
  const handleGroupNameChange = (text) => {
    setGroupName(text);
    if (nameError) setNameError('');
  };

  const handleGroupDescriptionChange = (text) => {
    setGroupDescription(text);
    if (descriptionError) setDescriptionError('');
  };

  const handleInviteCodeChange = (text) => {
    setInviteCode(text);
    if (inviteCodeError) setInviteCodeError('');
  };

  // Action handlers
  const handleCreateGroup = () => {
    let hasError = false;

    if (!groupName.trim()) {
      setNameError('Please enter a group name');
      hasError = true;
    }

    if (!groupDescription.trim()) {
      setDescriptionError('Please enter a group description');
      hasError = true;
    }

    if (hasError) return;
    
    // Create a new group with a random color
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      photo: null, // No photo upload functionality
      color: getRandomColor() // Assign a random color to the group
    };
    
    addGroup(newGroup);
    setGroupCreated(true);
    
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const handleJoinGroup = () => {
    if (!inviteCode.trim()) {
      setInviteCodeError('Please enter an invite code');
      return;
    }
    
    // In a real app, you would validate the invite code with your backend
    // Create a joined group with a random color
    const newGroup = {
      id: Date.now().toString(),
      name: "Joined Group",
      description: "You joined this group using invite code: " + inviteCode,
      photo: null,
      color: getRandomColor() // Assign a random color to the joined group
    };
    
    addGroup(newGroup);
    setJoinSuccess(true);
    
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  // Switch between create and join modes
  const toggleMode = () => {
    setIsJoinMode(!isJoinMode);
  };

  // Render UI based on status
  if (groupCreated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-outline" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>Group Created!</Text>
          <Text style={styles.successText}>
            Your group "{groupName}" has been created successfully.
          </Text>
          <Text style={styles.successSubtext}>
            Redirecting back to groups list...
          </Text>
        </View>
      </View>
    );
  }

  if (joinSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-outline" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>Group Joined!</Text>
          <Text style={styles.successText}>
            You've successfully joined the group!
          </Text>
          <Text style={styles.successSubtext}>
            Redirecting back to groups list...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {isJoinMode ? (
          // Join Group UI
          <>
            <Text style={styles.title}>Join group</Text>
            <Text style={styles.subtitle}>
              Enter an invite code to join an existing group.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Invite Code</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={24} color="#5E5E5E" style={styles.inputIcon}/>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter invite code"
                  placeholderTextColor="#9E9E9E"
                  value={inviteCode}
                  onChangeText={handleInviteCodeChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                />
              </View>
              {inviteCodeError ? (
                <Text style={styles.errorText}>{inviteCodeError}</Text>
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
                style={styles.joinButton}
                onPress={handleJoinGroup}
              >
                <Text style={styles.buttonText}>Join group</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleModeContainer}>
              <Text style={styles.toggleModeText}>
                Want to create a new group instead?
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleModeLink}>Create a group</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Create Group UI
          <>
            <Text style={styles.title}>Create New Group</Text>
            <Text style={styles.subtitle}>
              Fill in the details to create a new group
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="people-outline" size={24} color="#5E5E5E" style={styles.inputIcon}/>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter group name"
                  placeholderTextColor="#9E9E9E"
                  value={groupName}
                  onChangeText={handleGroupNameChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={true}
                />
              </View>
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Description</Text>
              <View style={styles.descriptionWrapper}>
                <Ionicons name="information-circle-outline" size={24} color="#5E5E5E" style={styles.inputIcon}/>
                <TextInput 
                  style={styles.descriptionInput}
                  placeholder="Enter group description"
                  placeholderTextColor="#9E9E9E"
                  value={groupDescription}
                  onChangeText={handleGroupDescriptionChange}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              {descriptionError ? (
                <Text style={styles.errorText}>{descriptionError}</Text>
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
                style={styles.createButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.buttonText}>Create Group</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toggleModeContainer}>
              <Text style={styles.toggleModeText}>Have an invite already?</Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleModeLink}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
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
    marginBottom: 16,
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
  descriptionWrapper: {
    flexDirection: 'row',
    backgroundColor: '#2A2C32',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    color: 'white',
    fontSize: 16,
    fontFamily: "Lexend",
  },
  descriptionInput: {
    flex: 1,
    padding: 12,
    color: 'white',
    fontSize: 16,
    fontFamily: "Lexend",
    height: 100,
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
    marginBottom: 20,
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
  createButton: {
    backgroundColor: 'rgb(37 99 235)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: 'rgb(37 99 235)',
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
  },
  divider: {
    height: 1,
    backgroundColor: '#3f4147',
    marginVertical: 20,
  },
  toggleModeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  toggleModeText: {
    color: '#9E9E9E',
    fontSize: 14,
    fontFamily: "Lexend",
    marginBottom: 8,
  },
  toggleModeLink: {
    color: 'rgb(37 99 235)',
    fontSize: 14,
    fontFamily: "Lexend-Bold",
  },
});

export default CreateNewGroup;