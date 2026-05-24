import { StyleSheet } from "react-native";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";

export const welcomeStyles_3 = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
        justifyContent: "space-between",
    },

    content: {
        alignItems: "center",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
    },

    card: {
        width: "48%",
        height: 100,
        borderRadius: 14,
        marginBottom: 16,
    },

    cardSelected: {
        borderWidth: 2,
        borderColor: "#FF3C57",
    },

    cardText: {
        color: "white",
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 16,
        textAlign: "center",
        justifyContent: "center",
        marginBottom: 3,
    },
    cardImage: {
        flex: 1,
        justifyContent: "flex-end",
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.20)",
        borderRadius: 14,
    },

    checkIcon: {
        position: "absolute",
        top: 8,
        right: 8
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30%",
        borderRadius: 14,
    },
});