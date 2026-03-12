import React from "react"
import { FlatList } from "react-native"
import ArtistCard from "./ArtistCard"
import { Artist } from "../../types/artist.types"

type Props = {
    artists: Artist[]
    selected: string[]
    toggleArtist: (artist: Artist) => void
}

export default function ArtistGrid({
    artists,
    selected,
    toggleArtist
}: Props) {

    return (
        <FlatList
            data={artists}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <ArtistCard
                    artist={item}
                    selected={selected.includes(item.id)}
                    onPress={toggleArtist}
                />
            )}
        />
    )
}