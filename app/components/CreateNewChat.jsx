import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Text from './CustomText';
import { useTheme } from './ThemeContext';
import { useFriends } from './FriendsContext';

const AddFriendScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { sendFriendRequest, findUsersByUsername } = useFriends();
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleUsernameChange = (text) => {
    setUsername(text);
    // Clear messages when user types
    setErrorMessage('');
    setSuccessMessage('');
    
    // If we have at least 3 characters, enable search mode
    if (text.length >= 3) {
      setSearchMode(true);
      handleSearch(text);
    } else {
      setSearchMode(false);
      setSearchResults([]);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      if (searchTerm.length < 3) return;
      
      setSearching(true);
      const results = await findUsersByUsername(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (targetUsername) => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const userToAdd = targetUsername || username;
      
      if (!userToAdd.trim()) {
        setErrorMessage('Please enter a username');
        return;
      }
      
      await sendFriendRequest(userToAdd);
      
      // Show success message
      setSuccessMessage(`Friend request sent to @${userToAdd}`);
      
      // Clear input and results
      setUsername('');
      setSearchResults([]);
      setSearchMode(false);
      
      // Navigate back after a delay
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setUsername(user.username);
    setSearchResults([]);
    setSearchMode(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.input }]}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Friend</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {successMessage ? (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-outline" size={40} color="white" />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Friend Request Sent!
          </Text>
          <Text style={[styles.successText, { color: colors.text }]}>
            {successMessage}
          </Text>
          <Text style={[styles.successSubtext, { color: colors.subText }]}>
            Redirecting back to friends list...
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            Enter a username to send them a friend request.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Username
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.input }]}>
              <Ionicons name="at-outline" size={24} color={colors.subText} style={styles.inputIcon}/>
              <TextInput 
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter username"
                placeholderTextColor={colors.subText}
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
              {username.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setUsername('');
                    setSearchResults([]);
                    setSearchMode(false);
                  }}
                >
                  <Ionicons name="close-circle" size={20} color={colors.subText} />
                </TouchableOpacity>
              )}
            </View>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
          
          {searchMode && (
            <View style={styles.searchResultsContainer}>
              {searching ? (
                <ActivityIndicator size="small" color="#2e71e5" style={styles.searchingIndicator} />
              ) : searchResults.length > 0 ? (
                <>
                  <Text style={[styles.resultsTitle, { color: colors.subText }]}>
                    Search Results
                  </Text>
                  {searchResults.map(user => (
                    <TouchableOpacity
                      key={user.id}
                      style={[styles.userResultItem, { backgroundColor: colors.cardBackground }]}
                      onPress={() => handleUserSelect(user)}
                    >
                      <View style={styles.userAvatar}>
                        {user.profilePicture ? (
                          <Image
                            source={{ uri: user.profilePicture }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <View style={[styles.avatarPlaceholder, { backgroundColor: '#2e71e5' }]}>
                            <Text style={styles.avatarText}>
                              {(user.name || user.username || '').charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>
                          {user.name || user.username}
                        </Text>
                        <Text style={[styles.userUsername, { color: colors.subText }]}>
                          @{user.username}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleSendRequest(user.username)}
                      >
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </>
              ) : username.length >= 3 ? (
                <Text style={[styles.noResultsText, { color: colors.subText }]}>
                  No users found with this username
                </Text>
              ) : null}
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.input }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (!username.trim() || loading) && styles.disabledButton
              ]}
              onPress={() => handleSendRequest()}
              disabled={!username.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Send Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Lexend',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Lexend-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Lexend',
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Lexend',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#2e71e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#85aae1',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lexend-SemiBold',
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
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Lexend-Bold',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Lexend',
  },
  successSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Lexend',
  },
  searchResultsContainer: {
    marginBottom: 24,
  },
  searchingIndicator: {
    marginVertical: 20,
  },
  resultsTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Lexend-Medium',
  },
  userResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'Lexend-Bold',
  },
  userUsername: {
    fontSize: 14,
    fontFamily: 'Lexend',
  },
  addButton: {
    backgroundColor: '#2e71e5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Lexend',
  },
});

export default AddFriendScreen;