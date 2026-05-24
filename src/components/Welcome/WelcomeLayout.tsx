import React, { ReactNode } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
    bottom?: ReactNode;
};

export default function WelcomeLayout({ children, bottom }: Props) {
    return (
        <ImageBackground
            source={require("../../../assets/bg/welcome-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <LinearGradient
                colors={[
                    "rgba(5,10,30,0.85)",
                    "rgba(5,10,30,0.6)",
                    "rgba(5,10,30,0.85)"
                ]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safe}>

                {/* Content */}
                <View style={styles.content}>
                    {children}
                </View>

                {/* Fixed Bottom */}
                <View style={styles.bottom}>
                    {bottom}
                </View>

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

    content: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    bottom: {
        position: "absolute",
        bottom: 50,
        left: 30,
        right: 30,
        alignItems: "center",
    },
});