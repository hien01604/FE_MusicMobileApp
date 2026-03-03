import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
    View,
    StyleSheet,
    ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <ImageBackground
            source={require("../../assets/bg.png")} // đổi đúng path của bạn
            style={styles.background}
            resizeMode="cover"
        >
            {/* Overlay tối toàn màn */}
            <LinearGradient
                colors={[
                    "rgba(5,10,30,0.85)",
                    "rgba(5,10,30,0.6)",
                    "rgba(5,10,30,0.85)"
                ]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Glow hồng phía dưới */}
            <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(253, 100, 120, 0.5)"]}
                // style={styles.bottomGlow}
            />

            <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
                <View style={styles.container}>
                    {children}
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

    container: {
        flex: 1,
        paddingHorizontal: 25,
    },

    // bottomGlow: {
    //     position: "absolute",
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    //     height: 180,
    // },
});