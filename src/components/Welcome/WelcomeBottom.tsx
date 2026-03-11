import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import ProgressDots from "./ProgressDots";

type Props = {
    text: string;
    step: number;
    total?: number;
    disabled?: boolean;
    onPress: () => void;
};

export default function WelcomeBottom({
    text,
    step,
    total = 4,
    disabled = false,
    onPress,
}: Props) {
    return (
        <View style={welcomeStyles_1.bottomContainer}>
            <Pressable
                disabled={disabled}
                style={[
                    welcomeStyles_1.button,
                    disabled && { opacity: 0.4 },
                ]}
                onPress={onPress}
            >
                {({ pressed }) =>
                    pressed ? (
                        <View style={welcomeStyles_1.outlineButton}>
                            <Text style={welcomeStyles_1.buttonText}>{text}</Text>
                        </View>
                    ) : (
                        <LinearGradient
                            colors={["#FF3C57", "#eb8196"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={welcomeStyles_1.gradientButton}
                        >
                            <Text style={welcomeStyles_1.buttonText}>{text}</Text>
                        </LinearGradient>
                    )
                }
            </Pressable>

            <ProgressDots step={step} total={total} />
        </View>
    );
}