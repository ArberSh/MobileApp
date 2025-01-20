import { View, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Image source={require('./assets/icon1.png')} style={styles.logo} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00c9bd',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
});
