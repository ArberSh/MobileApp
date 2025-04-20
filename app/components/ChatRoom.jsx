import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  StatusBar,
  Keyboard,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Text from './CustomText';
import { useTheme } from './ThemeContext'; // Import useTheme hook
import messageData from '../messages.json';

const { width, height } = Dimensions.get('window');

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDark } = useTheme(); // Get current theme colors
  
  // Get chat info from route params or use defaults
  const chatInfo = route.params || {};
  const { name = 'Chat', image = null, status = 'Offline' } = chatInfo;
  
  const [message, setMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation for the screen position
  const screenPosition = useRef(new Animated.Value(0)).current;
  
  // Profile sheet state and animation
  const [profileVisible, setProfileVisible] = useState(false);
  const profileTranslateY = useRef(new Animated.Value(height)).current;
  
  // Add state for profile menu dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Reference for ScrollView to auto-scroll to bottom
  const scrollViewRef = useRef();
  
  // Current user ID - this will determine which messages appear on the right
  const currentUserID = "1";

  // Load messages from your external JSON file
  useEffect(() => {
    // In a real app, you would import and process your messages.json file
    // For this example, we'll assume we're using the second document from your paste
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
  try {
    // Get the ID of the person we're chatting with from route params
    const receiverID = route.params?.id || "2"; // Default to user 2 if no ID provided
    
    // Filter messages to show only the conversation between current user and selected user
    const processedMessages = messageData
      .filter(msg => 
        msg.type === 'direct' && 
        ((msg.senderID === currentUserID && msg.receiverID === receiverID) ||
         (msg.receiverID === currentUserID && msg.senderID === receiverID))
      )
      .map(msg => ({
        id: msg.time,
        senderID: msg.senderID,
        text: msg.message,
        timestamp: msg.time,
        isCurrentUser: msg.senderID === currentUserID
      }));
    
    setMessages(processedMessages);
    
    // Scroll to bottom when messages are loaded
    setTimeout(scrollToBottom, 100);
  } catch (error) {
    console.error("Error loading messages:", error);
  }
};
  
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Request permissions and set up keyboard listeners
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos');
      }
    })();
    
    // Set up keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollToBottom();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Setup profile sheet pan responder
  const profilePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        profileTranslateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        hideProfile();
      } else {
        Animated.timing(profileTranslateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }).start();
      }
    }
  });

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal gestures that start from the left edge
        return gestureState.dx > 20 && 
               Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
               evt.nativeEvent.pageX < 50;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Move the screen with the gesture
        screenPosition.setValue(Math.max(0, gestureState.dx));
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swipe is more than 1/3 of the screen width, go back
        if (gestureState.dx > width / 3) {
          // Animate the rest of the way
          Animated.timing(screenPosition, {
            toValue: width,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            // Go back after animation completes
            navigation.goBack();
          });
        } else {
          // Otherwise, reset the position
          Animated.spring(screenPosition, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const showProfile = () => {
    setProfileVisible(true);
    profileTranslateY.setValue(height);
    Animated.timing(profileTranslateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  const hideProfile = () => {
    // Also hide the profile menu if it's open
    setShowProfileMenu(false);
    
    Animated.timing(profileTranslateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setProfileVisible(false);
    });
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileMenuOption = (option) => {
    // Handle the selected profile menu option
    switch (option) {
      case 'copy':
        Alert.alert('Copied', `Username "${name}" copied to clipboard`);
        break;
      case 'group':
        Alert.alert('Add to Group', 'User will be added to a group');
        break;
      case 'block':
        Alert.alert('Block User', 'Are you sure you want to block this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Block', style: 'destructive' }
        ]);
        break;
      case 'report':
        Alert.alert('Report User', 'Are you sure you want to report this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Report', style: 'destructive' }
        ]);
        break;
    }
    setShowProfileMenu(false);
  };

  const handleAttachmentPress = () => {
    setShowAttachmentOptions(true);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setShowAttachmentOptions(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      setShowAttachmentOptions(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setShowAttachmentOptions(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
      setShowAttachmentOptions(false);
    }
  };

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      const newMessage = {
        id: Date.now().toString(),
        senderID: currentUserID,
        text: message,
        file: selectedFile,
        timestamp: new Date().toISOString(),
        isCurrentUser: true
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setSelectedFile(null);
      
      // Scroll to bottom after sending a message
      setTimeout(scrollToBottom, 100);
    }
  };

  const goBack = () => {
    // Check if we can go back
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If we can't go back, navigate to the home screen
      navigation.navigate('pagechat');
    }
  };

  // For demo purposes, we'll create some mock message data
  // This would normally come from your JSON file
  const messageData = [
    {
      "senderID": "1",
      "receiverID": "2",
      "type": "direct",
      "time": "2024-02-04T12:30:00Z",
      "message": "Hey, how are you?"
    },
    {
      "senderID": "2",
      "receiverID": "1",
      "type": "direct",
      "time": "2024-02-04T12:31:00Z",
      "message": "I'm good! What about you?"
    },
    {
      "senderID": "1",
      "receiverID": "2",
      "type": "direct",
      "time": "2024-02-04T12:32:30Z",
      "message": "Doing great, just working on a project."
    },
    {
      "senderID": "3",
      "receiverID": "1",
      "type": "direct",
      "time": "2024-02-04T13:00:00Z",
      "message": "Hey! Are you free to hop on a call?"
    },
    {
      "senderID": "1",
      "receiverID": "3",
      "type": "direct",
      "time": "2024-02-04T13:01:00Z",
      "message": "Sure, give me 5 minutes to finish something up"
    },
    {
      "senderID": "3",
      "receiverID": "1",
      "type": "direct",
      "time": "2024-02-04T13:01:30Z",
      "message": "Perfect, I'll set up the meeting"
    }
  ];

  // Process messages for display right at render time
  useEffect(() => {
    const processedMessages = messageData.map(msg => ({
      id: msg.time,
      senderID: msg.senderID,
      text: msg.message,
      timestamp: msg.time,
      isCurrentUser: msg.senderID === currentUserID
    }));
    
    setMessages(processedMessages);
    
    // Scroll to bottom when messages are loaded
    setTimeout(scrollToBottom, 100);
  }, []);

  return (
    <Animated.View 
      style={[
        styles.safeArea, 
        keyboardVisible && styles.keyboardVisible,
        { 
          backgroundColor: colors.background, 
          transform: [{ translateX: screenPosition }] 
        }
      ]} 
      {...panResponder.panHandlers}
    >
      <StatusBar 
        backgroundColor={colors.input} 
        barStyle={isDark ? "light-content" : "dark-content"} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[styles.container, { backgroundColor: colors.background }]}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.input }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerCenterContent} 
              onPress={showProfile}
            >
              <View style={{ marginHorizontal: 10 }}>
                {image ? (
                  <Image 
                    source={{ uri: image }} 
                    style={styles.avatar} 
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                  </View>
                )}
                {status && (
                  <View 
                    style={[
                      styles.statusIndicator, 
                      { 
                        backgroundColor: status === 'Online' ? '#44b700' : '#ccc',
                        borderColor: colors.headerBackground 
                      }
                    ]} 
                  />
                )}
              </View>
              
              <Text style={[styles.headerText, { color: colors.text }]}>{name}</Text>
            </TouchableOpacity>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="videocam-outline" size={28} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="call-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <View style={[styles.chatArea, { backgroundColor: colors.background }]}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble, 
                  msg.senderID === currentUserID ? styles.myMessage : styles.theirMessage,
                  { 
                    backgroundColor: msg.senderID === currentUserID ? '#7a92af' : colors.cardBackground,
                  }
                ]}
              >
                {msg.file && (
                  <Image
                    source={{ uri: msg.file.uri }}
                    style={styles.filePreview}
                    resizeMode="contain"
                  />
                )}
                <Text 
                  style={[
                    styles.messageText, 
                    { 
                      color: msg.senderID === currentUserID ? '#fff' : colors.text
                    }
                  ]}
                >
                  {msg.text}
                </Text>
                <Text 
                  style={[
                    styles.timestamp, 
                    { 
                      color: msg.senderID === currentUserID ? 'rgba(255,255,255,0.8)' : colors.subText 
                    }
                  ]}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Attachment Modal */}
        <Modal
          visible={showAttachmentOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAttachmentOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                <Ionicons name="image" size={28} color="#7a92af" />
                <Text style={[styles.optionText, { color: colors.text }]}>Photo & Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton} onPress={pickDocument}>
                <Ionicons name="document" size={28} color="#7a92af" />
                <Text style={[styles.optionText, { color: colors.text }]}>Document</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAttachmentOptions(false)}
              >
                <Text style={[styles.cancelText, { color: "#7a92af" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Input Container */}
        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
          <View style={[styles.inputContainer, { backgroundColor: colors.input }]}>
            <TouchableOpacity 
              style={styles.attachmentButton} 
              onPress={handleAttachmentPress}
            >
              <Ionicons name="add" size={28} color="#7a92af" />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Message"
              placeholderTextColor={colors.subText}
              value={message}
              onChangeText={setMessage}
              multiline
              keyboardAppearance={isDark ? "dark" : "light"}
            />

            <TouchableOpacity style={[styles.sendButton, { backgroundColor: "#7a92af" }]} onPress={handleSend}>
              <Ionicons 
                name={message || selectedFile ? "paper-plane" : "mic-outline"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Profile Sheet */}
      {profileVisible && (
        <>
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={hideProfile}
          />
          <Animated.View 
            style={[
              styles.profileSheet,
              { 
                backgroundColor: colors.cardBackground,
                transform: [{ translateY: profileTranslateY }] 
              }
            ]}
          >
            <View {...profilePanResponder.panHandlers} style={styles.swipeHandler}>
              <View style={[styles.dragIndicator, { backgroundColor: colors.text }]} />
            </View>
            
            {/* Profile Info */}
            <View style={styles.profileContainer}>
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>{name.charAt(0)}</Text>
                </View>
              )}
              
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={[styles.profileName, { color: colors.text }]}>{name}</Text>
                  <View style={styles.menuButtonContainer}>
                    <TouchableOpacity 
                      style={styles.menuButton} 
                      onPress={toggleProfileMenu}
                    >
                      <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
                    </TouchableOpacity>
                    
                    {/* Profile Menu Dropdown */}
                    {showProfileMenu && (
                      <View style={[styles.profileMenuDropdown, { backgroundColor: colors.menuBackground }]}>
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('copy')}
                        >
                          <Ionicons name="copy-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.text }]}>Copy Username</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('group')}
                        >
                          <Ionicons name="people-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.text }]}>Add to Group</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('block')}
                        >
                          <Ionicons name="ban-outline" size={20} color={colors.danger} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.danger }]}>Delete User</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text style={[styles.description, { color: colors.text }]}>
                  Nickname
                </Text>
              </View>
            </View>
            
            <View style={[styles.profileActions, { borderTopColor: isDark ? '#333' : '#e0e0e0' }]}>
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="call-outline" size={24} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="videocam-outline" size={24} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Video</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{padding:20, paddingHorizontal:24}}>
              <Text style={{color: colors.text, fontWeight:'bold', fontSize:20}}>Bio:</Text>
              <Text style={{color: colors.text, fontSize:18}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo neque sit amet convallis rutrum. Proin eget arcu vitae justo semper dictum quis ac ex.
              </Text>
            </View>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardVisible: {
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  filePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  attachmentButton: {
    marginRight: 8,
    padding: 6,
  },
  sendButton: {
    borderRadius: 100,
    padding: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Profile sheet styles
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  profileSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
    overflow: 'hidden',
    minHeight: 400,
  },
  swipeHandler: {
    width: '100%',
    height: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImageText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuButtonContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 5,
  },
  description: {
    fontSize: 18,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  profileAction: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
  },
  
  // Profile menu dropdown styles
  profileMenuDropdown: {
    position: 'absolute',
    right: 0,
    top: 35,
    width: 180,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4a4a4a',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
  },
});

export default ChatRoom;