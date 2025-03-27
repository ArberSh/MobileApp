import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const Task = ({ finished, name, group, pfp, title, description,date,clock }) => {
  const [Clicked, setClicked] = useState(false);

  useEffect(() => {
    if (Clicked) {
      console.log("Pressed");
    }
  });

  return (
    <TouchableOpacity
      onPress={() => setClicked(true)}
      style={{
        backgroundColor: "#3F414A",
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 6,
      }}
    >
      <View style={{ padding: 12 }}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
          {title}{" "}
        </Text>
        <View style={{width:'90%'}}>
          <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            color: "#c8c8c8",
            fontWeight: "500",
            fontSize: 14,
            paddingTop: 6,
          }}
        >
          {description}{" "}
        </Text>
        </View>
        
        <Text style={{color:'white',fontWeight:500,fontSize:16,paddingTop:6}}>
          Due:{date} at {clock}
        </Text>
        <Text style={{color:'gray',fontWeight:500,fontSize:16}}>
          Assigned by: {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({});
