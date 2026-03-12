import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import LogoImage from "../../../assets/logo.png";
import WelcomeBottom from "./WelcomeBottom";
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";

type Props = {
    onStart: () => void;
};

export default function WelcomeComponent({ onStart }: Props) {
    const { fadeAnim, translateY } = useFadeSlideAnimation();


    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }]
            }}
        >
            
            {/* CONTENT */}
            <View style={welcomeStyles_1.content}>
                <Image
                    source={LogoImage}
                    style={welcomeStyles_1.logo}
                    resizeMode="contain"
                />

                <Text style={welcomeStyles_1.heading}>
                    Welcome to SONIX
                </Text>

                <Text style={welcomeStyles_1.subHeading}>
                    Let's personalize your music experience.
                </Text>
            </View>

            {/* BOTTOM */}
            <WelcomeBottom
                text="Get Started"
                step={1}
                onPress={onStart}
            />

        </Animated.View>
    );
}