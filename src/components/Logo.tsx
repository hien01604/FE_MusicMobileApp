import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LogoImage from "../../assets/logo.png";
import { ORBITRON_BOLD } from "../../utils/const";


export default function Logo() {
    return (
        <View style={styles.header}>
            <Image
                source={LogoImage}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.logoText}>
                SONIX
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 5,
        left: 10,
    },

    logo: {
        width: 60,
        height: 60,
        marginRight: 10,
    },

    logoText: {
        color: "white",
        fontSize: 24,
        fontFamily: ORBITRON_BOLD,  
        letterSpacing: 4,
    },
});