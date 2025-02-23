import { useState, useEffect } from 'react';
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
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const ChatRooms = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);

  // Request permissions on initial load
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos');
      }
    })();
  }, []);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          
          <View
          style={{
            width:40,
            height:40,
            borderRadius:100,
            backgroundColor:'green',
            marginHorizontal:10
          }}
          >

          </View>
          {/* <Image
            style={styles.avatar}
            source={{ uri: 'https://static.wikia.nocookie.net/solo-leveling/images/1/1b/Beru0.jpg' }}
          /> */}
          
          <Text style={styles.headerText}>Arber</Text>
          
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
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons 
            name={message || selectedFile ? "paper-plane" : "mic-outline"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
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
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#2d2d2d',
    margin: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: 'white',
    maxHeight: 100,
    paddingHorizontal: 15,
    fontSize: 16,
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
});

export default ChatRooms;