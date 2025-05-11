import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions, 
  Image,
  ActivityIndicator,
  Modal,
  Animated,
  PanResponder,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from './ThemeContext';
import { GroupsContext } from './GroupsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from './CustomText';

const { width, height } = Dimensions.get('window');

const ChatRoomGroups = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const { groupId, name, description, photo, color } = params || {};
  
  const { getGroupById } = useContext(GroupsContext);
  const groupData = groupId ? getGroupById(groupId) : null;
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef();
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  // Profile sheet state and animation
  const [profileVisible, setProfileVisible] = useState(false);
  const profileTranslateY = useRef(new Animated.Value(height)).current;
  
  // Add state for profile menu dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Mock user ID for demo purposes
  const currentUserId = "1";
  
  // Updated navigation header code
  useEffect(() => {
    // Set up navigation header
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <TouchableOpacity 
          style={styles.headerTitleContainer}
          onPress={() => handleInfoPress()}
          disabled={profileVisible} // Disable when profile sheet is visible
        >
          <View style={[styles.groupAvatar, { backgroundColor: color || '#4ea4a6' }]}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.groupPhoto} />
            ) : (
              <Text style={styles.groupInitial}>{(name || 'Group').charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View style={styles.headerTextContainer}>
            <Text 
              style={[
                styles.headerTitle, 
                { 
                  color: profileVisible ? colors.subText : colors.text, // Dim text when profile sheet visible
                  opacity: profileVisible ? 0.7 : 1 // Dim opacity when profile sheet visible
                }
              ]} 
              numberOfLines={1}
            >
              {name || 'Group Chat'}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
          disabled={profileVisible} // Disable when profile sheet is visible
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={profileVisible ? colors.subText : colors.text} // Dim icon when profile sheet visible
            style={{ opacity: profileVisible ? 0.7 : 1 }} // Dim opacity when profile sheet visible
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowHeaderMenu(!showHeaderMenu)}
            disabled={profileVisible} // Disable when profile sheet is visible
          >
            <Ionicons 
              name="ellipsis-vertical" 
              size={24} 
              color={profileVisible ? colors.subText : colors.text} // Dim icon when profile sheet visible
              style={{ opacity: profileVisible ? 0.7 : 1 }} // Dim opacity when profile sheet visible
            />
          </TouchableOpacity>
          
          {/* Header Menu Dropdown */}
          {showHeaderMenu && !profileVisible && (
            <View style={[styles.profileMenuDropdown, { backgroundColor: colors.menuBackground, top: 45 }]}>
              <TouchableOpacity 
                style={styles.profileMenuItem}
                onPress={() => handleProfileMenuOption('edit')}
              >
                <Ionicons name="create-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Group</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.profileMenuItem}
                onPress={() => handleProfileMenuOption('members')}
              >
                <Ionicons name="people-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Group Members</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.profileMenuItem}
                onPress={() => handleProfileMenuOption('leave')}
              >
                <Ionicons name="exit-outline" size={20} color={colors.danger} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: colors.danger }]}>Leave Group</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
    });
  
    // Load messages
    loadMessages();
  }, [navigation, colors, name, description, showHeaderMenu, profileVisible]);

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

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch messages from your backend
      // For demo purposes, we'll create some sample messages
      const sampleMessages = [
        {
          id: '1',
          senderId: '2',
          senderName: 'Alex Johnson',
          text: 'Hey everyone! Welcome to our new group.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
        {
          id: '2',
          senderId: '3',
          senderName: 'Jamie Smith',
          text: 'Thanks for adding me!',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: '3',
          senderId: '1',
          senderName: 'You',
          text: 'Let\'s use this group to coordinate our upcoming project.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '4',
          senderId: '4',
          senderName: 'Taylor Lee',
          text: 'Sounds good to me! When should we schedule our first meeting?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      
      setMessages(sampleMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleInfoPress = () => {
    // Show profile sheet
    showProfile();
  };

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
    // Also hide both menus
    setShowProfileMenu(false);
    setShowHeaderMenu(false);
    
    Animated.timing(profileTranslateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setProfileVisible(false);
    });
  };

  const toggleProfileMenu = () => {
    // If header menu is open, close it
    if (showHeaderMenu) {
      setShowHeaderMenu(false);
    }
    // Toggle the menu in profile sheet
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileMenuOption = (option) => {
    // Handle the selected profile menu option
    switch (option) {
      case 'edit':
        Alert.alert('Edit Group', 'You can edit group details here');
        break;
      case 'members':
        Alert.alert('Group Members', 'View and manage group members');
        break;
      case 'leave':
        Alert.alert('Leave Group', 'Are you sure you want to leave this group?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive' }
        ]);
        break;
    }
    // Close both menus
    setShowProfileMenu(false);
    setShowHeaderMenu(false);
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleAttachmentPress = () => {
    setShowAttachmentOptions(true);
  };

  const handleSend = () => {
    if (inputMessage.trim() === '') return;
    
    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    // Add message to state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Clear input
    setInputMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
        });
      }
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryButton} />
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {Object.keys(groupedMessages).map(date => (
              <View key={date}>
                <View style={styles.dateHeaderContainer}>
                  <Text style={[styles.dateHeader, { color: colors.subText }]}>{date}</Text>
                </View>
             
                {groupedMessages[date].map((message, index) => {
  const isCurrentUser = message.senderId === currentUserId;
  const messageDate = new Date(message.timestamp);
  const formattedDate = `${messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric'
  })}`;
  
  return (
    <View 
      key={message.id} 
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
      ]}
    >
      <View style={[
        styles.messageBubble,
        isCurrentUser 
          ? styles.sentBubble
          : [styles.receivedBubble, {backgroundColor: colors.cardBackground}]
      ]}>
        {!isCurrentUser && (
          <Text style={[styles.senderName, { color: getColorForId(message.senderId) }]}>
            {message.senderName}
          </Text>
        )}
        <Text style={[
          styles.messageText,
          { color: isCurrentUser ? (isDark ? '#ffffff' : '#ffffff') : colors.text }
        ]}>
          {message.text}
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={[
            styles.dateTimeText,
            { color: isCurrentUser ? (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.8)') : colors.subText }
          ]}>
            {formattedDate} {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
})}
              </View>
            ))}
          </ScrollView>
        )}
        
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
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              keyboardAppearance={isDark ? "dark" : "light"}
            />

            <TouchableOpacity style={[styles.sendButton, { backgroundColor: "#7a92af" }]} onPress={handleSend}>
              <Ionicons 
                name="paper-plane" 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
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
              <TouchableOpacity style={styles.optionButton} onPress={() => {
                Alert.alert('Photo picked');
                setShowAttachmentOptions(false);
              }}>
                <Ionicons name="image" size={28} color="#7a92af" />
                <Text style={[styles.optionText, { color: colors.text }]}>Photo & Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton} onPress={() => {
                Alert.alert('Document picked');
                setShowAttachmentOptions(false);
              }}>
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
      </KeyboardAvoidingView>

      {/* Profile Sheet for Group */}
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
            
            {/* Group Profile Info */}
            <View style={styles.profileContainer}>
              <View style={[styles.groupProfileImage, { backgroundColor: color || '#4ea4a6' }]}>
                {photo ? (
                  <Image 
                    source={{ uri: photo }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <Text style={styles.profileImageText}>
                    {(name || 'Group').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={[styles.profileName, { color: colors.text }]}>{name || 'Group Chat'}</Text>
                  <View style={styles.menuButtonContainer}>
                    <TouchableOpacity 
                      style={styles.menuButton} 
                      onPress={toggleProfileMenu}
                    >
                      <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
                    </TouchableOpacity>
                    
                    {/* Group Menu Dropdown */}
                    {showProfileMenu && (
                      <View style={[styles.profileMenuDropdown, { backgroundColor: colors.menuBackground }]}>
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('edit')}
                        >
                          <Ionicons name="create-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Group</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('members')}
                        >
                          <Ionicons name="people-outline" size={20} color={colors.text} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.text }]}>Group Members</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.profileMenuItem}
                          onPress={() => handleProfileMenuOption('leave')}
                        >
                          <Ionicons name="exit-outline" size={20} color={colors.danger} style={styles.menuItemIcon} />
                          <Text style={[styles.menuItemText, { color: colors.danger }]}>Leave Group</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text style={[styles.memberCount, { color: colors.subText }]}>
                  {groupData?.members?.length || 4} members
                </Text>
              </View>
            </View>
            
            <View style={[styles.profileActions, { borderTopColor: isDark ? '#333' : '#e0e0e0' }]}>
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="people-outline" size={24} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Members</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="notifications-outline" size={24} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Mute</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Ionicons name="search-outline" size={24} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Search</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionLabel, { color: colors.text }]}>Description:</Text>
              <Text style={[styles.descriptionText, { color: colors.text }]}>
                {description || "This is a group for our team to coordinate on the upcoming project. Share updates and resources here."}
              </Text>
            </View>

            {/* Group Members Preview */}
            <View style={styles.membersPreviewContainer}>
              <Text style={[styles.membersTitle, { color: colors.text }]}>Members</Text>
              
              <View style={styles.membersList}>
                <View style={styles.memberItem}>
                  <View style={[styles.memberAvatar, { backgroundColor: getColorForId('1') }]}>
                    <Text style={styles.memberAvatarText}>Y</Text>
                  </View>
                  <Text style={[styles.memberName, { color: colors.text }]}>You (Admin)</Text>
                </View>
                
                <View style={styles.memberItem}>
                  <View style={[styles.memberAvatar, { backgroundColor: getColorForId('2') }]}>
                    <Text style={styles.memberAvatarText}>A</Text>
                  </View>
                  <Text style={[styles.memberName, { color: colors.text }]}>Alex Johnson</Text>
                </View>
                
                <View style={styles.memberItem}>
                  <View style={[styles.memberAvatar, { backgroundColor: getColorForId('3') }]}>
                    <Text style={styles.memberAvatarText}>J</Text>
                  </View>
                  <Text style={[styles.memberName, { color: colors.text }]}>Jamie Smith</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

// Utility function to generate consistent colors for user avatars
const getColorForId = (id) => {
  const colors = [
    '#4ea4a6', // teal
    '#6a7de8', // blue
    '#e87d7d', // red
    '#e8c77d', // yellow
    '#a67de8', // purple
    '#7de88f', // green
    '#e87dcc'  // pink
  ];
  
  // Use a simple hash function to get a consistent color for each ID
  const hashCode = String(id).split('').reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  );
  return colors[hashCode % colors.length];
};

    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        keyboardAvoid: {
          flex: 1,
        },
        headerTitleContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          maxWidth: Dimensions.get('window').width - 160,
        },
        headerTextContainer: {
          flexDirection: 'column',
          marginLeft: 10,
        },
        headerTitle: {
          fontSize: 18,
          fontFamily: 'Lexend-SemiBold',
        },
        headerSubtitle: {
          fontSize: 14,
          fontFamily: 'Lexend',
        },
        headerButton: {
            padding: 10,
            marginHorizontal: 5,
          },
        groupAvatar: {
          width: 38,
          height: 38,
          borderRadius: 19,
          justifyContent: 'center',
          alignItems: 'center',
        },
        groupPhoto: {
          width: '100%',
          height: '100%',
          borderRadius: 19,
        },
        groupInitial: {
          color: 'white',
          fontSize: 18,
          fontFamily: 'Lexend-Bold',
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        messagesContainer: {
          flex: 1,
        },
        messagesContent: {
          padding: 10,
          paddingBottom: 20,
        },
        dateHeaderContainer: {
          alignItems: 'center',
          marginVertical: 16,
        },
        dateHeader: {
          fontSize: 14,
          fontFamily: 'Lexend',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 10,
          backgroundColor: 'rgba(0,0,0,0.05)',
          overflow: 'hidden',
        },
        messageContainer: {
          flexDirection: 'row',
          marginBottom: 12,
          maxWidth: '80%',
        },
        sentMessageContainer: {
          alignSelf: 'flex-end',
        },
        receivedMessageContainer: {
          alignSelf: 'flex-start',
        },
        avatarContainer: {
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          alignSelf: 'flex-end',
          marginBottom: 4,
        },
        avatarText: {
          color: 'white',
          fontSize: 16,
          fontFamily: 'Lexend-Medium',
        },
        messageBubble: {
          borderRadius: 18,
          paddingHorizontal: 12,
          paddingVertical: 8,
          maxWidth: '100%',
        },
        sentBubble: {
          borderTopRightRadius: 2,
          backgroundColor: '#7a92af',
        },
        receivedBubble: {
          borderTopLeftRadius: 2,
        },
        senderName: {
          fontSize: 13,
          fontFamily: 'Lexend-SemiBold',
          marginBottom: 4,
        },
        messageText: {
          fontSize: 15,
          fontFamily: 'Lexend',
          marginBottom: 4,
        },
        timeText: {
          fontSize: 11,
          alignSelf: 'flex-end',
          fontFamily: 'Lexend',
        },
        dateTimeContainer: {
          alignSelf: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
        },
        dateTimeText: {
          fontSize: 11,
          fontFamily: 'Lexend',
        },
        inputWrapper: {
          paddingHorizontal: 10,
          paddingBottom: 10,
          paddingTop: 5,
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          paddingHorizontal: 15,
          borderRadius: 25,
        },
        input: {
          flex: 1,
          paddingHorizontal: 15,
          paddingVertical: 10,
          fontSize: 16,
          fontFamily: 'Lexend',
          maxHeight: 100,
          minHeight: 46,
        },
        attachmentButton: {
          padding: 6,
        },
        sendButton: {
          width: 46,
          height: 46,
          borderRadius: 23,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        },
        
        // Modal styles
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
          fontFamily: 'Lexend',
        },
        cancelButton: {
          paddingVertical: 15,
          alignItems: 'center',
          marginTop: 10,
        },
        cancelText: {
          fontSize: 16,
          fontFamily: 'Lexend-SemiBold',
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
          minHeight: 500,
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
        groupProfileImage: {
          width: 80,
          height: 80,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
        },
        profileImage: {
          width: 80,
          height: 80,
          borderRadius: 40,
        },
        profileImageText: {
          color: 'white',
          fontSize: 30,
          fontFamily: 'Lexend-Bold',
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
          fontFamily: 'Lexend-Bold',
        },
        menuButtonContainer: {
            position: 'relative',
          },
        menuButton: {
          padding: 5,
        },
        memberCount: {
          fontSize: 16,
          fontFamily: 'Lexend',
          marginTop: 4,
        },
        profileActions: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          paddingTop: 20,
          borderTopWidth: 1,
        },
        profileAction: {
          alignItems: 'center',
        },
        actionText: {
          marginTop: 8,
          fontFamily: 'Lexend',
        },
        
        // Profile menu dropdown styles
        profileMenuDropdown: {
            position: 'absolute',
            right: 0,
            top: 45, // Adjusted for header positioning
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
            fontFamily: 'Lexend',
          },
        
        // Group description styles
        descriptionContainer: {
          padding: 20,
          paddingTop: 5,
          paddingBottom: 10,
        },
        descriptionLabel: {
          fontSize: 16,
          fontFamily: 'Lexend-SemiBold',
          marginBottom: 6,
        },
        descriptionText: {
          fontSize: 15,
          fontFamily: 'Lexend',
          lineHeight: 22,
        },
        
        // Group members preview styles
        membersPreviewContainer: {
          padding: 20,
          paddingTop: 10,
        },
        membersTitle: {
          fontSize: 16,
          fontFamily: 'Lexend-SemiBold',
          marginBottom: 12,
        },
        membersList: {
          marginTop: 5,
        },
        memberItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        },
        memberAvatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
        },
        memberAvatarText: {
          color: 'white',
          fontSize: 16,
          fontFamily: 'Lexend-Medium',
        },
        memberName: {
          fontSize: 15,
          fontFamily: 'Lexend',
        },
        viewAllButton: {
          paddingVertical: 15,
          marginTop: 5,
        },
        viewAllText: {
          fontSize: 15,
          fontFamily: 'Lexend-SemiBold',
        },
        backdropOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
          }
      })

export default ChatRoomGroups