import { StyleSheet } from "react-native";
export const welcomeStyles_2 = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        width: "100%",
    },

    content: {
        alignItems: "center",
        flex: 1,
        width: "100%",
    },

    genreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
        paddingBottom: 140,
        width: "100%",
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
