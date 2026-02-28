import { View, Text, Image, StyleSheet } from "react-native";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";
import Layout from "../components/Layout";

export default function SplashScreen() {
    return (
        <Layout>
        <View style={styles.container}>

            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Brand Name */}
            <Text style={styles.title}>SONIX</Text>

            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        letterSpacing: 8,
    },
});