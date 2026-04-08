import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';

type Props = {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
};

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search..."
}: Props) {

    return (
        <View style={styles.container}>
            <Fontisto name="search" size={24} color="black" />
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 44,
        marginBottom: 30,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#111827"
    }

});