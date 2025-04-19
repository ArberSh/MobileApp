import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import Text from '../CustomText';
import { useTheme } from '../ThemeContext';

const Task = ({ finished, name, group, pfp, title, description, date, clock }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  // Format the date string for display
  const formatDate = (dateStr, clockStr) => {
    if (!dateStr) return "";
    return `${dateStr} at ${clockStr || "00:00"}`;
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("TaskMoreDetail", {
        title: title,
        description: description,
        dueDate: formatDate(date, clock),
        assignedBy: name
      })}
      style={{
        backgroundColor: colors.cardBackground,
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 6,
      }}
    >
      <View style={{ padding: 12 }}>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>
          {title}{" "}
        </Text>
        <View style={{ width: "90%" }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: colors.subText,
              fontWeight: "500",
              fontSize: 14,
              paddingTop: 6,
            }}
          >
            {description}{" "}
          </Text>
        </View>

        {date && (
          <Text style={{ color: colors.text, fontWeight: "500", fontSize: 16, paddingTop: 6 }}>
            Due: {formatDate(date, clock)}
          </Text>
        )}

        <Text style={{ color: colors.subText, fontWeight: "500", fontSize: 16 }}>
          Assigned by: {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  // You could move the inline styles here for better organization
  taskContainer: {
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 6,
  },
  taskContent: {
    padding: 12,
  },
  taskTitle: {
    fontWeight: "700", 
    fontSize: 18,
  },
  taskDescription: {
    fontWeight: "500",
    fontSize: 14,
    paddingTop: 6,
  },
  taskDueDate: {
    fontWeight: "500", 
    fontSize: 16, 
    paddingTop: 6,
  },
  taskAssignedBy: {
    fontWeight: "500", 
    fontSize: 16,
  }
});