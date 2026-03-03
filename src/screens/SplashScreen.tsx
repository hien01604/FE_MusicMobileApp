import { View, Text, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";

interface SplashScreenProps {
    showLoadingText?: boolean;
}

export default function SplashScreen({ showLoadingText = false }: SplashScreenProps) {
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

    const fullText = "SONIX";
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        // Logo fade + scale animation
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        // Typewriter effect
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, index + 1));
            index++;
            if (index === fullText.length) {
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../../assets/logo.png")}
                style={[
                    styles.logo,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
                resizeMode="contain"
            />

            <Text style={styles.brand}>{displayedText}</Text>

            {showLoadingText && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.loadingText}>Checking authentication...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0F2A",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    brand: {
        fontSize: 36,
        color: "white",
        letterSpacing: 4,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
    },
    loadingContainer: {
        position: "absolute",
        bottom: 60,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 14,
        opacity: 0.8,
    },
});