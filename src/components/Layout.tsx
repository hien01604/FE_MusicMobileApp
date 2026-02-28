import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <View style={styles.container}>
                {children}
            </View>
            <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(255,60,87,0.4)"]}
                style={styles.bottomGlow}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#0B0F2A", 
        zIndex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: 25,
    },
    bottomGlow: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
    },
});