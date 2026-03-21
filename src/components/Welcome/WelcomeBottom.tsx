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
    return (
        <View style={welcomeStyles_1.bottomContainer}>

            {/* CONTINUE */}
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
                        {text} 
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
            <View >
                <ProgressDots step={step} total={total} />
            </View>
        </View>
    );
}