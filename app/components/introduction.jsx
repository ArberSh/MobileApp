import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Text from './CustomText';


const { height } = Dimensions.get("window");

const Introduction = () => {
  const [fontsLoaded] = useFonts({
    "Lexend-Medium": require("../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
  });

  const navigation = useNavigation();

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView onLayout={onLayout} style={{ backgroundColor: "black", height: "100%" }}>
      <View>
        <ImageBackground
          style={{
            height: height / 2.2,
            marginTop: 20,
          }}
          resizeMode="contain"
          source={require("../assets/img1.png")}
        />
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              color: "#00c9bd",
              fontFamily: "Lexend-Bold",
              textAlign: "center",
            }}
          >
            Connect, collaborate, and succeed together!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              fontFamily: "Lexend-Medium",
              textAlign: "center",
            }}
          >
            A platform for students to chat, share ideas, work on projects, exchange homework, and build lasting
            connections.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("login")}
            style={{
              backgroundColor: "#00c9bd",
              paddingVertical: 6,
              paddingHorizontal: 8,
              width: "46%",
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Lexend-Medium",
                color: "white",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate("register")}
            style={{
              backgroundColor: "black",
              paddingVertical: 6,
              paddingHorizontal: 8,
              width: "46%",
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Lexend-Medium",
                color: "white",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Introduction;