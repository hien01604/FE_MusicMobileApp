import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    active: string;
    onChange: (tab: string) => void;
};

export default function NavBar({ active, onChange }: Props) {

    const tabs = ["Radio", "Home", "Profile", "Search"];

    return (
        <LinearGradient
            colors={["#1A1E3F", "#12152E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 10,
                borderRadius: 25,
                marginHorizontal: 20,
            }}
        >
            {tabs.map((tab) => (
                <Pressable key={tab} onPress={() => onChange(tab)}>
                    <Text
                        style={{
                            color: active === tab ? "#FF5F9E" : "#9AA0C3",
                            fontSize: 14,
                            fontWeight: "600",
                        }}
                    >
                        {tab}
                    </Text>
                </Pressable>
            ))}
        </LinearGradient>
    );
}