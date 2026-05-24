import React from "react";
import { View, Text, Image, Pressable } from "react-native";

type Props = {
    name: string;
    image: any;
    selected: boolean;
    onPress: () => void;
};

export default function ArtistCard({ name, image, selected, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={{ alignItems: "center", margin: 10 }}>
            <Image
                source={image}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderWidth: selected ? 3 : 0,
                    borderColor: "#ff6b8b",
                }}
            />

            <Text
                style={{
                    color: "#ff6b8b",
                    marginTop: 6,
                    fontSize: 12,
                }}
            >
                {name}
            </Text>
        </Pressable>
    );
}