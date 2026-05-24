import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export default function useFadeSlideAnimation() {

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

    return {
        fadeAnim,
        translateY
    };
}