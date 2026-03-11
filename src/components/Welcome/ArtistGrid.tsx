import React from "react";
import { View } from "react-native";
import ArtistCard from "./ArtistCard";

type Artist = {
    name: string;
    image: any;
};

type Props = {
    artists: Artist[];
    selected: string[];
    toggleArtist: (name: string) => void;
};

export default function ArtistGrid({ artists, selected, toggleArtist }: Props) {
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
            }}
        >
            {artists.map((artist) => (
                <ArtistCard
                    key={artist.name}
                    name={artist.name}
                    image={artist.image}
                    selected={selected.includes(artist.name)}
                    onPress={() => toggleArtist(artist.name)}
                />
            ))}
        </View>
    );
}