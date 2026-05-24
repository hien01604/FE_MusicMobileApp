import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, View, Text, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native";

import { welcomeStyles_1 } from "../../style/welcomeStyles_1"
import { welcomeStyles_3 } from "../../style/welcomeStyles_3"
import BackButton from "../common/BackButton"
import WelcomeBottom from "./WelcomeBottom"
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";
import type { PreferenceOption } from "../../constants/preferences";
import MoodCard from "./MoodCard";
import { getMoodOptions } from "../../services/moods.service";

type Props = {
    onContinue: (moods?: PreferenceOption[]) => void;
    onSkip: () => void;
};

export default function Welcome_4({ onContinue, onSkip }: Props) {
    const navigation = useNavigation();

    const [selected, setSelected] = useState<string[]>([])
    const [moods, setMoods] = useState<Array<PreferenceOption & { icon?: string | null; color?: string | null }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleContinue = () => {
        onContinue(
            moods.filter((item) => selected.includes(item.id))
        );
    };
    const disabled = selected.length === 0;

    const toggleMood = (moodId: string) => {

        if (selected.includes(moodId)) {
            setSelected(selected.filter((id) => id !== moodId))
        } else {
            setSelected([...selected, moodId])
        }
    }
    const { fadeAnim, translateY } = useFadeSlideAnimation();

    useEffect(() => {
        let mounted = true;

        setLoading(true);
        getMoodOptions()
            .then((result) => {
                if (mounted) {
                    setMoods(result);
                    setError("");
                }
            })
            .catch(() => {
                if (mounted) {
                    setError("Could not load moods.");
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);


    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }],
            }}
        >
            <View style={welcomeStyles_3.container}>
                <BackButton onBack={navigation.goBack} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={welcomeStyles_3.scrollContent}
                >
                    <Text style={welcomeStyles_1.heading}>
                        When do you usually listen to music?
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="small" color="#FF5F7E" />
                    ) : error ? (
                        <Text style={{ color: "#FF5F7E", textAlign: "center" }}>{error}</Text>
                    ) : (
                        <View style={welcomeStyles_3.grid}>
                            {moods.map((item) => {
                                const isSelected = selected.includes(item.id);

                                return (
                                    <MoodCard
                                        key={item.id}
                                        label={item.label}
                                        icon={item.icon}
                                        color={item.color}
                                        selected={isSelected}
                                        onPress={() => toggleMood(item.id)}
                                    />
                                );
                            })}
                        </View>
                    )}
                </ScrollView>

                {/* BOTTOM */}
                <WelcomeBottom
                    text="Next"
                    disabled={disabled}
                    onPress={handleContinue}
                    onSkip={onSkip}
                    step={4}
                    total={4}
                />
            </View>
        </Animated.View>
    )
}
