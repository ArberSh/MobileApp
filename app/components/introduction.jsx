import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as SplashScreen from "expo-splash-screen"; // Import properly
import { useFonts } from "expo-font";
import {useNavigation} from "@react-navigation/native"


const { height } = Dimensions.get("window");


const Login = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
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
     <SafeAreaView onLayout={onLayout} style={{ backgroundColor: "white", height: "100%" }}>
      <View>
        <ImageBackground
          style={{
            height: height / 2.2,
            marginTop: 20,
          }}
          resizeMode="contain"
          source={require("../assets/img.png")}
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
              fontFamily: "Poppins-Bold",
              textAlign: "center",
            }}
          >
            Connect, collaborate, and succeed together!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontFamily: "Poppins-Medium",
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
                fontFamily: "Poppins-Medium",
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
              backgroundColor: "white",
              paddingVertical: 6,
              paddingHorizontal: 8,
              width: "46%",
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                color: "black",
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

export default Login;

const styles = StyleSheet.create({
  Div: {},
});
