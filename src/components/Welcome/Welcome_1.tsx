import React from "react";
import { View, Text, ImageBackground, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
    return (
        <ImageBackground
            source={require("../../assets/onboarding-bg.png")}
            resizeMode="cover"
            style={styles.background}
        >
            {/* overlay gradient */}
            <LinearGradient
                colors={["rgba(10,10,40,0.7)", "rgba(30,0,50,0.7)"]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.container}>

                {/* LOGO */}
                <Text style={styles.logo}>〰</Text>

                {/* TITLE */}
                <Text style={styles.title}>Welcome to BeatFlow 🎵</Text>

                {/* SUBTITLE */}
                <Text style={styles.subtitle}>
                    Let's personalize your music experience.
                </Text>

                {/* BUTTON */}
                <Pressable style={styles.button}>
                    <LinearGradient
                        colors={["#FF3C57", "#eb8196"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </LinearGradient>
                </Pressable>

                {/* DOT INDICATOR */}
                <View style={styles.dots}>
                    <View style={styles.dotInactive} />
                    <View style={styles.dotActive} />
                    <View style={styles.dotInactive} />
                </View>

            </View>
        </ImageBackground>
    );
}