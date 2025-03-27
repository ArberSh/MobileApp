import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
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

const { width, height } = Dimensions.get('window');

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
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
        id: Date.now(),
        text: message,
        file: selectedFile,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setSelectedFile(null);
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

  return (
    <Animated.View 
      style={[
        styles.safeArea, 
        keyboardVisible && styles.keyboardVisible,
        { transform: [{ translateX: screenPosition }] }
      ]} 
      {...panResponder.panHandlers}
    >
      <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={28} color="white" />
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
                      { backgroundColor: status === 'Online' ? '#44b700' : '#ccc' }
                    ]} 
                  />
                )}
              </View>
              
              <Text style={styles.headerText}>{name}</Text>
            </TouchableOpacity>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="videocam-outline" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="call-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <View style={styles.chatArea}>
          <ScrollView 
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageBubble}>
                {msg.file && (
                  <Image
                    source={{ uri: msg.file.uri }}
                    style={styles.filePreview}
                    resizeMode="contain"
                  />
                )}
                {msg.text && <Text style={styles.messageText}>{msg.text}</Text>}
                <Text style={styles.timestamp}>
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
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                <Ionicons name="image" size={28} color="#00c9bd" />
                <Text style={styles.optionText}>Photo & Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton} onPress={pickDocument}>
                <Ionicons name="document" size={28} color="#00c9bd" />
                <Text style={styles.optionText}>Document</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAttachmentOptions(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Input Container */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.attachmentButton} 
              onPress={handleAttachmentPress}
            >
              <Ionicons name="add" size={28} color="#00c9bd" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Message"
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              multiline
              keyboardAppearance="dark"
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
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
              { transform: [{ translateY: profileTranslateY }] }
            ]}
          >
            <View {...profilePanResponder.panHandlers} style={styles.swipeHandler}>
              <View style={styles.dragIndicator} />
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
                  <Text style={styles.profileName}>{name}</Text>
                  <View style={styles.menuButtonContainer}>
                    <TouchableOpacity 
                      style={styles.menuButton} 
                      onPress={toggleProfileMenu}
                    >
                      <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>
                    
                    {/* Profile Menu Dropdown */}
                    {showProfileMenu && (
                      <View style={styles.profileMenuDropdown}>
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('copy')}
                        >
                          <Ionicons name="copy-outline" size={20} color="white" style={styles.menuItemIcon} />
                          <Text style={styles.menuItemText}>Copy Username</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('group')}
                        >
                          <Ionicons name="people-outline" size={20} color="white" style={styles.menuItemIcon} />
                          <Text style={styles.menuItemText}>Add to Group</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('block')}
                        >
                          <Ionicons name="ban-outline" size={20} color="#ff5252" style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: '#ff5252' }]}>Block User</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('report')}
                        >
                          <Ionicons name="flag-outline" size={20} color="#ff5252" style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: '#ff5252' }]}>Report User</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text style={styles.description}>
                  Nickname
                </Text>
              </View>
            </View>
            
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="call-outline" size={24} color="white" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="videocam-outline" size={24} color="white" />
                <Text style={styles.actionText}>Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="search-outline" size={24} color="white" />
                <Text style={styles.actionText}>Search</Text>
              </TouchableOpacity>
            </View>
            <View style={{padding:20,paddingHorizontal:24}}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>Bio:</Text>
              <Text style={{color:'white',fontSize:18}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo neque sit amet convallis rutrum. Proin eget arcu vitae justo semper dictum quis ac ex. </Text>
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
    backgroundColor: 'black',
  },
  keyboardVisible: {
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 15,
    backgroundColor: '#1a1a1a',
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
    borderColor: '#1a1a1a',
  },
  headerText: {
    color: 'white',
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
    backgroundColor: 'black',
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timestamp: {
    color: '#888',
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
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 25,
  },
  input: {
    flex: 1,
    color: 'white',
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
    backgroundColor: '#00c9bd',
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
    backgroundColor: '#2d2d2d',
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
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#00c9bd',
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
    backgroundColor: '#2B2D31',
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
    backgroundColor: 'white',
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
    color: 'white',
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
    color: 'white',
    fontSize: 18,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  profileAction: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 8,
  },
  
  // Profile menu dropdown styles
  profileMenuDropdown: {
    position: 'absolute',
    right: 0,
    top: 35,
    width: 180,
    backgroundColor: '#3a3a3a',
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
    color: 'white',
    fontSize: 14,
  },
});

export default ChatRoom;