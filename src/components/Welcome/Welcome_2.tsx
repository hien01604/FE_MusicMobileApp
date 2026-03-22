import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { welcomeStyles_2 } from "../../style/welcomeStyles_2";
import AntDesign from "@expo/vector-icons/AntDesign";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import WelcomeBottom from "./WelcomeBottom";
import BackButton from "../BackButton";
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";
import ProgressDots from "./ProgressDots";

type Props = {
    onContinue: () => void;
};

const genres = [
    "Pop",
    "Indie",
    "R&B",
    "EDM",
    "Rock",
    "Lofi",
    "Jazz",
    "K-pop",
    "Hip-hop",
    "Acoustic",
    "Rap",
];

export default function Welcome_2({ onContinue }: Props) {
    const pressAnim = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const [selected, setSelected] = useState<string[]>([]);
    const disabled = selected.length < 3;

    const toggleGenre = (genre: string) => {
        if (selected.includes(genre)) {
            setSelected(selected.filter((g) => g !== genre));
        } else {
            setSelected([...selected, genre]);
        }
    };

    const handleContinue = () => {
        if (selected.length < 3) return;

        onContinue();
    };
    const { fadeAnim, translateY } = useFadeSlideAnimation();


    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }]
            }}
        >
            <BackButton onBack={navigation.goBack} />
            <View style={welcomeStyles_2.container}>

                {/* CONTENT */}
                <View style={welcomeStyles_2.content}>
                    <Text style={welcomeStyles_1.heading}>What genres do you like?</Text>
                    <Text style={welcomeStyles_1.subHeading}>  {"Select the genres you enjoy the most\nChoose at least 3 to personalize your music"}</Text>

                    <View style={welcomeStyles_2.genreContainer}>
                        {genres.map((genre) => {
                            const isSelected = selected.includes(genre);

                            return (
                                <Pressable
                                    key={genre}
                                    onPress={() => toggleGenre(genre)}
                                    style={[
                                        welcomeStyles_2.genreButton,
                                        isSelected && welcomeStyles_2.genreSelected,
                                    ]}
                                >
                                    <Text style={welcomeStyles_2.genreText}>{genre}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
                    <WelcomeBottom
                        text="Continue"
                        disabled={disabled}
                        onPress={handleContinue}
                    onSkip={onContinue} 
                    step={2}
                    total={4}
                    />
            </View>
        </Animated.View>
    );
}