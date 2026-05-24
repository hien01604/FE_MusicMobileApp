import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { welcomeStyles_2 } from "../../style/welcomeStyles_2";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import { PreferenceOption } from "../../constants/preferences";
import WelcomeBottom from "./WelcomeBottom";
import BackButton from "../common/BackButton";
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";
import { getGenres } from "../../services/genres.service";

type Props = {
    onContinue: (genres: PreferenceOption[]) => void;
};

export default function Welcome_3({ onContinue }: Props) {
    const navigation = useNavigation();
    const { fadeAnim, translateY } = useFadeSlideAnimation();


    const [selected, setSelected] = useState<string[]>([]);
    const [genres, setGenres] = useState<PreferenceOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const disabled = selected.length === 0;

    useEffect(() => {
        let mounted = true;

        setLoading(true);
        getGenres()
            .then((result) => {
                if (mounted) {
                    setGenres(result);
                    setError("");
                }
            })
            .catch(() => {
                if (mounted) {
                    setError("Could not load genres.");
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

    const handleContinue = () => {
        if (selected.length === 0) return;
        onContinue(genres.filter((genre) => selected.includes(genre.id)));
    };

    const toggle = (item: string) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };
    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }],
            }}
        >
            <BackButton onBack={navigation.goBack} />

            <View style={welcomeStyles_2.container}>
                {/* CONTENT */}
                <View style={welcomeStyles_2.content}>
                    <Text style={welcomeStyles_1.heading}>What genres do you like?</Text>
                    <Text style={welcomeStyles_1.subHeading}>
                        Select at least 1 genre to personalize your music.
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="small" color="#FF5F7E" />
                    ) : error ? (
                        <Text style={{ color: "#FF5F7E", textAlign: "center" }}>{error}</Text>
                    ) : (
                        <View style={welcomeStyles_2.genreContainer}>
                            {genres.map((genre) => {
                                const isSelected = selected.includes(genre.id);

                                return (
                                    <Pressable
                                        key={genre.id}
                                        onPress={() => toggle(genre.id)}
                                        style={[
                                            welcomeStyles_2.genreButton,
                                            isSelected && welcomeStyles_2.genreSelected,
                                        ]}
                                    >
                                        <Text style={welcomeStyles_2.genreText}>{genre.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* BOTTOM */}
                <WelcomeBottom
                    text="Next"
                    disabled={disabled}
                    onPress={handleContinue}
                    step={3}
                    total={4}
                />
            </View>
        </Animated.View>
    );
}
