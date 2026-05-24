import React from "react"
import { FlatList, StyleSheet } from "react-native"
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
            style={styles.list}
            contentContainerStyle={styles.content}
            data={artists}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
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

const styles = StyleSheet.create({
    list: {
        flex: 1,
        maxHeight: 350,
        width: "100%",
    },
    content: {
        paddingBottom: 140,
        paddingTop: 4,
    },
    row: {
        justifyContent: "space-between",
    },
});
