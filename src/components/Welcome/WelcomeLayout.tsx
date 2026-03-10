import React, { ReactNode } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
};

export default function WelcomeLayout({ children }: Props) {
    return (
        <ImageBackground
            source={require("../../../assets/bg/welcome-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >
            {/* dark overlay */}
            <LinearGradient
                colors={[
                    "rgba(5,10,30,0.85)",
                    "rgba(5,10,30,0.6)",
                    "rgba(5,10,30,0.85)"
                ]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safe}>
                <View style={styles.container}>{children}</View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    safe: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "space-between",
        alignItems: "center",
    },
});