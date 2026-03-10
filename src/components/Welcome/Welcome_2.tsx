import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { welcomeStyles_2 } from "../../style/welcomeStyles_2";
import ProgressDots from "./ProgressDots";
import AntDesign from "@expo/vector-icons/AntDesign";


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
    const handleBack = (): void => {
            navigation.goBack();
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
                        transform: [{ translateY }]
                    }}
                >
            <Pressable
                onPress={handleBack}
                style={{ marginBottom: 10 }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
                <AntDesign name="arrow-left" size={22} color="#FF3C57" />
            </Pressable>   
               
        <View style={welcomeStyles_2.container}>

            {/* CONTENT */}
            <View style={welcomeStyles_2.content}>
                <Text style={welcomeStyles_2.step}>Step 2 of 4</Text>

                <Text style={welcomeStyles_2.title}>What genres do you like?</Text>
                <Text style={welcomeStyles_2.subtitle}>(Choose at least 3)</Text>

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

            {/* FIXED BOTTOM */}
            <View style={welcomeStyles_2.bottomContainer}>
                <Pressable
                    disabled={disabled}
                    style={[
                        welcomeStyles_2.continueButton,
                        disabled && { opacity: 0.4 }
                    ]}
                    onPress={handleContinue}
                    >
                    <Text style={welcomeStyles_2.continueText}>Continue →</Text>
                </Pressable>

                <ProgressDots step={2} total={4} />
            </View>

        </View>
        </Animated.View>
    );
}