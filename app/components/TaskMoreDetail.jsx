import { StyleSheet, TouchableOpacity, View, ScrollView, StatusBar, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from './CustomText';
import { useTheme } from './ThemeContext';

const TaskMoreDetail = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  // Destructure all params including any callback functions
  const { 
    id, // Task id to identify which task to update
    title, 
    description, 
    dueDate, 
    assignedBy, 
    onComplete, // Callback function to update task status in parent component
    isCompleted = false // Initial completion status
  } = route.params;
  
  // State to store attachments, comments, and completion status
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState('');
  const [completed, setCompleted] = useState(isCompleted);
  const [isEditing, setIsEditing] = useState(false);

  // Function to pick documents
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const newAttachment = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          size: result.assets[0].size,
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  // Remove an attachment
  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  // Handle task completion
  const handleMarkAsComplete = async () => {
    try {
      // Update local state
      setCompleted(true);
      
      // Update the task in AsyncStorage
      const storedTasksJson = await AsyncStorage.getItem('tasks');
      if (storedTasksJson) {
        const storedTasks = JSON.parse(storedTasksJson);
        const updatedTasks = storedTasks.map(task => {
          if (task.id === id) {
            return { ...task, completed: true };
          }
          return task;
        });
        
        // Save updated tasks back to AsyncStorage
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
      
      // If a callback function was provided, call it with the task ID
      if (onComplete && typeof onComplete === 'function') {
        onComplete(id);
      } else {
        // If no callback provided, still show the confirmation
        Alert.alert(
          "Task Completed",
          "The task has been marked as complete.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert(
        "Error",
        "Failed to mark task as complete. Please try again."
      );
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save edited files
  const saveEditedFiles = () => {
    Alert.alert(
      "Changes Saved",
      "Your changes have been saved successfully.",
      [
        {
          text: "OK",
          onPress: () => setIsEditing(false)
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.isDark ? "light-content" : "dark-content"} />
      
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>
        
        {completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="white" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task title card */}
        <View style={[styles.titleCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          
          <View style={[styles.metaContainer, { borderTopColor: colors.isDark ? "#3A3A3A" : "#E0E0E0" }]}>
            <View style={styles.assignedByContainer}>
              <Ionicons name="person-outline" size={16} color={colors.subText} style={styles.metaIcon} />
              <Text style={[styles.metaLabel, { color: colors.subText }]}>From: </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{assignedBy}</Text>
            </View>
            
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={16} color={colors.subText} style={styles.metaIcon} />
              <Text style={[styles.dueDateText, { color: colors.text }]}>{dueDate}</Text>
            </View>
          </View>
        </View>
        
        {/* Task description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionTitle, { color: colors.subText }]}>Description</Text>
          <View style={[styles.descriptionCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{description}</Text>
          </View>
        </View>

        {/* Attachments area */}
        <View style={styles.attachmentsSection}>
          <Text style={[styles.descriptionTitle, { color: colors.subText }]}>Attachments</Text>
          
          {/* Display existing attachments */}
          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((item, index) => (
                <View key={index} style={[styles.attachmentItem, { backgroundColor: colors.cardBackground }]}>
                  <View style={styles.attachmentDetails}>
                    <Ionicons name="document-text-outline" size={20} color={colors.subText} style={styles.attachmentIcon} />
                    <View style={styles.attachmentInfo}>
                      <Text style={[styles.attachmentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                        {item.name}
                      </Text>
                      <Text style={[styles.attachmentSize, { color: colors.subText }]}>
                        {Math.round(item.size / 1024)} KB
                      </Text>
                    </View>
                  </View>
                  {(isEditing || !completed) && (
                    <TouchableOpacity 
                      style={styles.removeButton} 
                      onPress={() => removeAttachment(index)}
                    >
                      <Ionicons name="close-circle" size={22} color="#FF5252" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Attachment button - always visible in edit mode or if not completed */}
          {(isEditing || !completed) && (
            <View style={[
              styles.attachContainer, 
              attachments.length > 0 ? styles.attachContainerWithAttachments : styles.attachContainerEmpty,
              { borderColor: colors.subText, backgroundColor: colors.cardBackground }
            ]}>
              {attachments.length === 0 && (
                <>
                  <Ionicons style={{transform: [{rotate: '45deg'}]}} name="attach-outline" size={36} color={colors.subText} />
                  <Text style={{color: colors.subText, fontSize: 16, fontWeight: 'bold'}}>Press the button to browse files</Text>
                </>
              )}
              <TouchableOpacity 
                style={[styles.attachButton, { backgroundColor: colors.cardBackground }]}
                onPress={pickDocument}
              >
                <Ionicons name="document-outline" size={20} color={colors.text} style={styles.buttonIcon} />
                <Text style={[styles.attachButtonText, { color: colors.text }]}>Browse Files</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Additional Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={[styles.descriptionTitle, { color: colors.subText }]}>Additional Comments (Optional)</Text>
          <View style={[styles.textInputContainer, { backgroundColor: colors.cardBackground }]}>
            <TextInput
              style={[styles.commentInput, { color: colors.text }]}
              multiline={true}
              placeholder="Add your comments here..."
              placeholderTextColor={colors.subText}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
              numberOfLines={4}
              editable={isEditing || !completed}
            />
          </View>
        </View>
        
        {/* Action buttons - fullwidth */}
        <View style={styles.actionsContainer}>
          {!completed ? (
            // Not completed - show "Mark as Complete" button (full width)
            <TouchableOpacity 
              style={styles.fullWidthButton}
              onPress={handleMarkAsComplete}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Mark as Complete</Text>
            </TouchableOpacity>
          ) : isEditing ? (
            // Completed and in edit mode - show "Save Changes" button (full width)
            <TouchableOpacity 
              style={styles.fullWidthSaveButton}
              onPress={saveEditedFiles}
            >
              <Ionicons name="save-outline" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            // Completed but not in edit mode - show "Edit Files" button (full width)
            <TouchableOpacity 
              style={[styles.fullWidthEditButton, { backgroundColor: colors.cardBackground }]}
              onPress={toggleEditMode}
            >
              <Ionicons name="create-outline" size={24} color={colors.text} style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Edit Files</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskMoreDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    flex: 1,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  completedText: {
    fontFamily:'Lexend-Bold',
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
  },
  metaContainer: {
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 5,
  },
  assignedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    marginRight: 5,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 16,
  },
  dueDateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionContainer: {
    marginTop: 25,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
  },
  descriptionCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  attachmentsSection: {
    marginTop: 25,
  },
  attachContainerEmpty: {
    padding: 14,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachContainerWithAttachments: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  attachButtonText: {
    fontWeight: "500",
    fontSize: 14,
  },
  attachmentsList: {
    marginBottom: 5,
  },
  attachmentItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attachmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentIcon: {
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 15,
    fontWeight: "500",
  },
  attachmentSize: {
    fontSize: 13,
    marginTop: 2,
  },
  removeButton: {
    padding: 5,
  },
  commentsSection: {
    marginTop: 25,
  },
  textInputContainer: {
    borderRadius: 16,
    padding: 5,
  },
  commentInput: {
    fontSize: 16,
    minHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    marginTop: 30,
    marginBottom: 30,
    width: '100%',
  },
  // Full width button styles
  fullWidthButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  fullWidthEditButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  fullWidthSaveButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})