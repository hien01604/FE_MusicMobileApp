import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { welcomeStyles } from "../../style/welcomeStyles_1";
import LogoImage from "../../../assets/logo.png";
import ProgressDots from "./ProgressDots";

type Props = {
    onStart: () => void;
};

export default function WelcomeComponent({ onStart }: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }]
            }}
        >
            
            {/* CONTENT */}
            <View style={welcomeStyles.content}>
                <Image
                    source={LogoImage}
                    style={welcomeStyles.logo}
                    resizeMode="contain"
                />

                <Text style={welcomeStyles.heading}>
                    Welcome to SONIX
                </Text>

                <Text style={welcomeStyles.subHeading}>
                    Let's personalize your music experience.
                </Text>
            </View>

            {/* FIXED BOTTOM */}
            <View style={welcomeStyles.bottomContainer}>
                <Pressable onPress={onStart} style={welcomeStyles.button}>
                    <LinearGradient
                        colors={["#FF3C57", "#eb8196"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={welcomeStyles.gradientButton}
                    >
                        <Text style={welcomeStyles.buttonText}>
                            Get Started
                        </Text>
                    </LinearGradient>
                </Pressable>

                <ProgressDots step={1} total={4} />
            </View>

        </Animated.View>
    );
}