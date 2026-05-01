import React, { useEffect, useState } from "react"
import { View, Text, Animated, } from "react-native"
import { useNavigation } from "@react-navigation/native";

import ArtistGrid from "../Artist/ArtistGrid"
import SearchBar from "../common/SearchBar"

import { Artist } from "../../types/artist.types"
import { getArtists } from "../../services/artist.service"
import { welcomeStyles_1 } from "../../style/welcomeStyles_1"
import BackButton from "../common/BackButton"
import WelcomeBottom from "./WelcomeBottom"
import useFadeSlideAnimation from "../../animations/useFadeSlideAnimation";

export default function Welcome_4({ onContinue }: any) {
    const navigation = useNavigation();

    const [artists, setArtists] = useState<Artist[]>([])
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<string[]>([])

    const handleContinue = () => {
        if (selected.length === 0) return;
        onContinue();
    };
    const disabled = selected.length === 0;

    useEffect(() => {
        getArtists().then(setArtists)
    }, [])

    const toggleArtist = (artist: Artist) => {

        if (selected.includes(artist.id)) {
            setSelected(selected.filter(id => id !== artist.id))
        } else {
            setSelected([...selected, artist.id])
        }
    }

    const filteredArtists = artists.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase())
    )
    const { fadeAnim, translateY } = useFadeSlideAnimation();


    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY }],
            }}
        >
            <View style={welcomeStyles_1.container}>
                <BackButton onBack={navigation.goBack} />

                <Text style={welcomeStyles_1.heading}>
                    Pick some artist you like
                </Text>

                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search for songs, artists, playlists..."
                />

                <ArtistGrid
                    artists={filteredArtists}
                    selected={selected}
                    toggleArtist={toggleArtist}
                />

                {/* BOTTOM */}
                <WelcomeBottom
                    text="Continue"
                    disabled={disabled}
                    onPress={handleContinue}
                    onSkip={onContinue}
                    step={3}
                    total={4}
                />
            </View>
        </Animated.View>
    )
}