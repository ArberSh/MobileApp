import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from './Auth';

const MessageContext = createContext();

export function useMessages() {
  return useContext(MessageContext);
}

export function MessagesProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's conversations when auth state changes
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const loadConversations = async () => {
      try {
        // Get conversations where the current user is a participant
        const conversationsRef = collection(firestore, "conversations");
        const q = query(
          conversationsRef, 
          where("participants", "array-contains", currentUser.uid),
          orderBy("lastMessageAt", "desc")
        );

        // Real-time listener for conversations
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const conversationsData = [];
          
          for (const docChange of snapshot.docChanges()) {
            const conversationData = docChange.doc.data();
            const conversationId = docChange.doc.id;
            
            // Get the other participant's info (assuming 1-on-1 chat)
            const otherParticipantId = conversationData.participants.find(
              id => id !== currentUser.uid
            );
            
            if (otherParticipantId) {
              try {
                const userRef = doc(firestore, "users", otherParticipantId);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  conversationsData.push({
                    id: conversationId,
                    ...conversationData,
                    recipientInfo: {
                      id: otherParticipantId,
                      name: userData.displayName || userData.username,
                      username: userData.username,
                      profilePicture: userData.profilePicture,
                      isOnline: userData.isOnline || false
                    },
                    unreadCount: conversationData.unreadBy && 
                      conversationData.unreadBy.includes(currentUser.uid) ? 1 : 0
                  });
                }
              } catch (err) {
                console.error("Error getting participant info:", err);
              }
            }
          }
          
          setConversations(conversationsData);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error loading conversations:", error);
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUser]);

  // Get or create a conversation between two users
  const getOrCreateConversation = async (receiverId) => {
    if (!currentUser || !receiverId) {
      throw new Error("Missing user information");
    }

    try {
      // Check if a conversation already exists
      const conversationsRef = collection(firestore, "conversations");
      const q = query(
        conversationsRef,
        where("participants", "array-contains", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Find conversation with these two users
      let conversation = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(receiverId)) {
          conversation = { id: doc.id, ...data };
        }
      });
      
      // If conversation exists, return it
      if (conversation) {
        return conversation.id;
      }
      
      // If not, create a new conversation
      const newConversation = {
        participants: [currentUser.uid, receiverId],
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        lastMessage: "",
        unreadBy: []
      };
      
      const docRef = await addDoc(conversationsRef, newConversation);
      return docRef.id;
    } catch (error) {
      console.error("Error in getOrCreateConversation:", error);
      throw error;
    }
  };

  // Send a message to another user
  const sendMessage = async (receiverId, messageText, attachments = null) => {
    if (!currentUser || !receiverId) {
      throw new Error("Missing user information");
    }

    try {
      console.log("Sending message to:", receiverId);
      
      // Get or create conversation
      const conversationId = await getOrCreateConversation(receiverId);
      
      // Create the message
      const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
      const messageData = {
        senderId: currentUser.uid, // This should be the full Firebase UID
        message: messageText,
        timestamp: serverTimestamp(),
        isRead: false
      };
      
      // Add attachment if provided
      if (attachments) {
        messageData.attachments = attachments;
      }
      
      // Add message to conversation
      await addDoc(messagesRef, messageData);
      
      // Update conversation with last message info
      const conversationRef = doc(firestore, "conversations", conversationId);
      await updateDoc(conversationRef, {
        lastMessage: messageText.length > 50 ? messageText.substring(0, 50) + "..." : messageText,
        lastMessageAt: serverTimestamp(),
        // Mark as unread for the receiver
        unreadBy: arrayUnion(receiverId)
      });
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Set up real-time listener for messages in a specific conversation
  const getRealtimeMessages = (receiverId, callback) => {
    if (!currentUser || !receiverId) {
      console.error("Missing user or receiver information");
      return null;
    }

    const getMessages = async () => {
      try {
        // Get the conversation ID
        const conversationId = await getOrCreateConversation(receiverId);
        
        // Set up listener for messages in this conversation
        const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messages = [];
          
          snapshot.forEach((doc) => {
            const messageData = doc.data();
            messages.push({
                id: doc.id,
                ...messageData,
                isCurrentUser: messageData.senderId === currentUser.uid // Compare with full UID
              });
          });
          
          // Mark messages as read if they're for current user
          if (messages.length > 0) {
            const conversationRef = doc(firestore, "conversations", conversationId);
            updateDoc(conversationRef, {
              unreadBy: messages.some(m => !m.isCurrentUser && !m.isRead) ? 
                arrayUnion(currentUser.uid) : [] 
            }).catch(err => console.error("Error updating read status:", err));
          }
          
          callback(messages);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error setting up messages listener:", error);
        callback([]);
        return null;
      }
    };

    return getMessages();
  };

  // Mark a conversation as read
  const markConversationAsRead = async (conversationId) => {
    if (!currentUser || !conversationId) return;
    
    try {
      const conversationRef = doc(firestore, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        const data = conversationSnap.data();
        
        // Remove current user from unreadBy array
        if (data.unreadBy && data.unreadBy.includes(currentUser.uid)) {
          const updatedUnreadBy = data.unreadBy.filter(id => id !== currentUser.uid);
          
          await updateDoc(conversationRef, {
            lastMessage: messageText.length > 50 ? messageText.substring(0, 50) + "..." : messageText,
            lastMessageAt: serverTimestamp(),
            // Mark as unread for the receiver using their full UID
            unreadBy: arrayUnion(receiverId) // receiverId should be a full Firebase UID
          });
        }
      }
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  const value = {
    conversations,
    loading,
    sendMessage,
    getRealtimeMessages,
    markConversationAsRead
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}