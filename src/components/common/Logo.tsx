import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LogoImage from "../../../assets/logo.png";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../../utils/const";


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
        top: 5,
    },

    logo: {
        width: 30,
        height: 30,
    },

    logoText: {
        color: "white",
        fontSize: 12,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        letterSpacing: 4,
        left: 10
    },
});