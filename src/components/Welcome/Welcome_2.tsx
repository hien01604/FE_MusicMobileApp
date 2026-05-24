import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { welcomeStyles_2 } from "../../style/welcomeStyles_2";
import { welcomeStyles_1 } from "../../style/welcomeStyles_1";
import WelcomeBottom from "./WelcomeBottom";
import BackButton from "../common/BackButton";
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";
import ArtistGrid from "../Artist/ArtistGrid";
import SearchBar from "../common/SearchBar";
import { getArtists } from "../../services/artists.service";
import type { Artist } from "../../types/artist.types";
import type { PreferenceOption } from "../../constants/preferences";

const ARTIST_PICK_LIMIT = 40;

type Props = {
    onContinue: (artists: PreferenceOption[]) => void;
    onSkip: () => void;
};

export default function Welcome_2({ onContinue, onSkip }: Props) {
    const navigation = useNavigation();
    const [selected, setSelected] = useState<string[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const disabled = false;

    const toggleArtist = (artist: Artist) => {
        if (selected.includes(artist.id)) {
            setSelected(selected.filter((item) => item !== artist.id));
        } else {
            setSelected([...selected, artist.id]);
        }
    };

    const handleContinue = () => {
        onContinue(
            artists
                .filter((artist) => selected.includes(artist.id))
                .map((artist) => ({ id: artist.id, label: artist.name }))
        );
    };
    const { fadeAnim, translateY } = useFadeSlideAnimation();

    useEffect(() => {
        let mounted = true;

        setLoading(true);
        getArtists(ARTIST_PICK_LIMIT)
            .then((result) => {
                if (mounted) {
                    setArtists(result);
                    setError("");
                }
            })
            .catch(() => {
                if (mounted) {
                    // Provide a visible error and log for easier debugging
                    // (on device/emulator console)
                    // eslint-disable-next-line no-console
                    console.error('Welcome_2: failed to load artists');
                    setError("Could not load artists.");
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

    const filteredArtists = artists.filter((artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <Animated.View
            style={[
                styles.screen,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }]
                },
            ]}
        >
            <BackButton onBack={navigation.goBack} />
            <View style={welcomeStyles_2.container}>

                {/* CONTENT */}
                <View style={welcomeStyles_2.content}>
                    <Text style={welcomeStyles_1.heading}>Pick some artists you like</Text>
                    <Text style={welcomeStyles_1.subHeading}>
                        You can skip this for now and fill it later.
                    </Text>

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search artists"
                    />

                    {loading ? (
                        <ActivityIndicator size="small" color="#FF5F7E" />
                    ) : error ? (
                        <Text style={{ color: "#FF5F7E", textAlign: "center" }}>{error}</Text>
                    ) : filteredArtists.length === 0 ? (
                        <Text style={{ color: "#B0B3C7", textAlign: "center" }}>
                            No artists found.
                        </Text>
                    ) : (
                        <ArtistGrid
                            artists={filteredArtists}
                            selected={selected}
                            toggleArtist={toggleArtist}
                        />
                    )}
                </View>
                <WelcomeBottom
                    text="Next"
                    disabled={disabled}
                    onPress={handleContinue}
                    onSkip={onSkip}
                    step={2}
                    total={4}
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%",
    },
});
