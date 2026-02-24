import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ORBITRON_BOLD } from "../../utils/const";

export default function SplashScreen() {
    return (
        <View style={styles.container}>

            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Brand Name */}
            <Text style={styles.title}>SONIX</Text>

            {/* Bottom Gradient Accent */}
            <LinearGradient
                colors={["transparent", "rgba(255,60,87,0.4)"]}
                style={styles.bottomGlow}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#061C2E",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: "white",
        fontFamily: ORBITRON_BOLD,
        letterSpacing: 8,
    },
    bottomGlow: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 200,
    },
});