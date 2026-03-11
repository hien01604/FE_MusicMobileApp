import { StyleSheet } from "react-native";
export const welcomeStyles_2 = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
    },

    content: {
        alignItems: "center",

    },

    genreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
    },

    genreButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#3d2a54",
    },

    genreSelected: {
        backgroundColor: "#ff5c9d",
    },

    genreText: {
        color: "white",
    },
});