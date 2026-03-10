import { StyleSheet } from "react-native";
export const welcomeStyles_2 = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        padding: 24,
    },

    bottomContainer: {
        position: "absolute",
        bottom: 40,
        left: 24,
        right: 24,
        alignItems: "center",
    },
    step: {
        textAlign: "center",
        color: "#d87cff",
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },

    subtitle: {
        textAlign: "center",
        color: "#aaa",
        marginBottom: 30,
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

    continueButton: {
        marginTop: 40,
        backgroundColor: "#ff6b8b",
        padding: 16,
        borderRadius: 30,
        alignItems: "center",
        width: "100%",
    },

    continueText: {
        color: "white",
        fontWeight: "bold",
    },
});