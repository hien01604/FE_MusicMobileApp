import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import ProgressDots from "./ProgressDots";
type Props = {
    text: string;
    disabled?: boolean;
    onPress: () => void;
    onSkip?: () => void; 
    step: number;       
    total?: number;
};

export default function WelcomeBottom({
    text,
    step,
    total = 4,
    disabled = false,
    onPress,
    onSkip,
}: Props) {
    const isFirstStep = step === 1;

    return (
        <View style={welcomeStyles_1.bottomContainer}>

            {/* ===== STEP 1: SIGN IN / SIGN UP ===== */}
            {isFirstStep ? (
                <>
                    {/* SIGN UP */}
                    <Pressable
                        onPress={onPress}
                        style={({ pressed }) => [
                            welcomeStyles_1.button,
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <LinearGradient
                            colors={["#FF3C57", "#eb8196"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={welcomeStyles_1.gradientButton}
                        >
                            <Text style={welcomeStyles_1.buttonText}>
                                Create Account
                            </Text>
                        </LinearGradient>
                    </Pressable>

                    {/* SIGN IN */}
                    <Pressable
                        onPress={onSkip} // 👈 dùng onSkip làm login
                        style={({ pressed }) => [
                            welcomeStyles_1.button,
                            { marginTop: 12 },
                            pressed && { opacity: 0.6 },
                        ]}
                    >
                        <View style={welcomeStyles_1.outlineButton}>
                            <Text style={welcomeStyles_1.buttonText}>
                                Sign In
                            </Text>
                        </View>
                    </Pressable>
                </>
            ) : (
                <>
                    {/* ===== STEP 2-4: CONTINUE ===== */}
                    <Pressable
                        disabled={disabled}
                        onPress={onPress}
                        style={({ pressed }) => [
                            welcomeStyles_1.button,
                            disabled && { opacity: 0.4 },
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <LinearGradient
                            colors={["#FF3C57", "#eb8196"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={welcomeStyles_1.gradientButton}
                        >
                            <Text style={welcomeStyles_1.buttonText}>
                                {text || "Continue"}
                            </Text>
                        </LinearGradient>
                    </Pressable>

                    {/* SKIP */}
                    {onSkip && (
                        <Pressable
                            onPress={onSkip}
                            style={({ pressed }) => [
                                welcomeStyles_1.button,
                                { marginTop: 12 },
                                pressed && { opacity: 0.6 },
                            ]}
                        >
                            <View style={welcomeStyles_1.outlineButton}>
                                <Text style={welcomeStyles_1.buttonText}>
                                    Skip for now
                                </Text>
                            </View>
                        </Pressable>
                    )}
                </>
            )}

            {/* ===== PROGRESS DOTS ===== */}
            <View style={{ marginTop: 16 }}>
                <ProgressDots step={step} total={total} />
            </View>
        </View>
    );
}