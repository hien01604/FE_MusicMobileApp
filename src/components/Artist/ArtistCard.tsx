import React from "react"
import { Pressable, Image, Text, View } from "react-native"
import { Artist } from "../../types/artist.types"

type Props = {
    artist: Artist
    selected?: boolean
    onPress?: (artist: Artist) => void
}

export default function ArtistCard({ artist, selected, onPress }: Props) {

    return (
        <Pressable
            onPress={() => onPress?.(artist)}
            style={{
                flex: 1,
                alignItems: "center",
                marginBottom: 18
            }}
        >
            <Image
                source={{ uri: artist.imageUrl }}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    borderWidth: selected ? 3 : 3,
                    borderColor: selected ? "#ff5f7e" : "white"
                }}
            />

            <Text
                numberOfLines={1}
                style={{
                    marginTop: 6,
                    color: "#ff5f7e",
                    fontSize: 13
                }}
            >
                {artist.name}
            </Text>
        </Pressable>
    )
}