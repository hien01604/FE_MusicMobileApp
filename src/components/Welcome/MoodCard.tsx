import React from "react";
import { Pressable, Text, ImageBackground, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { welcomeStyles_3 } from "../../style/welcomeStyles_3";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    label: string;
    image: any;
    selected: boolean;
    onPress: () => void;
};

export default function MoodCard({
    label,
    image,
    selected,
    onPress,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                welcomeStyles_3.card,
                selected && welcomeStyles_3.cardSelected,
            ]}
        >
            <ImageBackground
                source={image}
                style={welcomeStyles_3.cardImage}
                imageStyle={{ borderRadius: 14 }}
            >
                <LinearGradient
                    colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
                    style={welcomeStyles_3.gradient}
                />
                <View style={welcomeStyles_3.overlay} />

                <Text style={welcomeStyles_3.cardText}>{label}</Text>

                {selected && (
                    <AntDesign
                        name="check-circle"
                        size={22}
                        color="#FF3C57"
                        style={welcomeStyles_3.checkIcon}
                    />
                )}
            </ImageBackground>
        </Pressable>
    );
}