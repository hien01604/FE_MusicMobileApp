import React, { useRef } from "react";
import { Pressable, Animated } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
    onBack: () => void;
};

export default function BackButton({ onBack }: Props) {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const animateIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const animateOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onBack}
            onPressIn={animateIn}
            onPressOut={animateOut}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ marginBottom: 20 }}
        >
            <Animated.View
                style={{
                    transform: [{ scale: pressAnim }],
                    opacity: pressAnim.interpolate({
                        inputRange: [0.9, 1],
                        outputRange: [0.6, 1],
                    }),
                }}
            >
                <AntDesign name="arrow-left" size={22} color="#FF3C57" />
            </Animated.View>
        </Pressable>
    );
}