import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoadingScreen() {
    return (
        <LinearGradient
            colors={["#1a1a2e", "#0f3460", "#16213e"]}
            style={styles.container}
        >
            <ActivityIndicator size="large" color="#ffffff" />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
