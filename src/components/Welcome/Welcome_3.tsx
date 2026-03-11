import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { welcomeStyles_3 } from "../../style/welcomeStyles_3";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import MoodCard from "./MoodCard";
import WelcomeBottom from "./WelcomeBottom";
import BackButton from "../BackButton";

type Props = {
    onContinue: () => void;
};

const moods = [
    { key: "party", image: require("../../../assets/mood/party.png") },
    { key: "chill", image: require("../../../assets/mood/chill.png") },
    { key: "sad", image: require("../../../assets/mood/sad.png") },
    { key: "workout", image: require("../../../assets/mood/workout.png") },
    { key: "focus", image: require("../../../assets/mood/focus.png") },
    { key: "sleep", image: require("../../../assets/mood/sleep.png") },


];

export default function Welcome_3({ onContinue }: Props) {
    const navigation = useNavigation();

    const [selected, setSelected] = useState<string[]>([]);
    const disabled = selected.length === 0;

    const handleContinue = () => {
        if (selected.length === 0) return;
        onContinue();
    };

    const toggle = (item: string) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

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
                transform: [{ translateY }],
            }}
        >
            <BackButton onBack={navigation.goBack} />
            
            <View style={welcomeStyles_3.container}>
                {/* CONTENT */}
                <View style={welcomeStyles_3.content}>
                    <Text style={welcomeStyles_1.heading}>
                        When do you usually listen to music?
                    </Text>

                    <View style={welcomeStyles_3.grid}>
                        {moods.map((item) => {
                            const isSelected = selected.includes(item.key);

                            return (
                                <MoodCard
                                    key={item.key}
                                    label={item.key}
                                    image={item.image}
                                    selected={isSelected}
                                    onPress={() => toggle(item.key)}
                                />
                            );
                        })}
                    </View>
                </View>

                {/* BOTTOM */}
                <WelcomeBottom
                    text="Continue"
                    step={3}
                    disabled={disabled}
                    onPress={handleContinue}
                />
            </View>
        </Animated.View>
    );
}
                    