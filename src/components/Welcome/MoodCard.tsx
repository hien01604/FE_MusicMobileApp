import React from "react";
import { Pressable, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { welcomeStyles_3 } from "../../style/welcomeStyles_3";

type Props = {
    label: string;
    selected: boolean;
    onPress: () => void;
    color?: string | null;
    icon?: string | null;
};

export default function MoodCard({
    label,
    selected,
    onPress,
    color,
    icon,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                welcomeStyles_3.card,
                color ? { backgroundColor: color } : null,
                selected && welcomeStyles_3.cardSelected,
            ]}
        >
            <View style={welcomeStyles_3.cardContent}>
                {icon ? <Text style={welcomeStyles_3.cardIcon}>{icon}</Text> : null}
                <Text style={welcomeStyles_3.cardText}>{label}</Text>

                {selected && (
                    <AntDesign
                        name="check-circle"
                        size={22}
                        color="#FF3C57"
                        style={welcomeStyles_3.checkIcon}
                    />
                )}
            </View>
        </Pressable>
    );
}