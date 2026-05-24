import { StyleSheet } from "react-native";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";

export const welcomeStyles_3 = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 30,
        width: "100%",
    },

    scrollContent: {
        paddingBottom: 220,
        paddingTop: 4,
    },

    content: {
        alignItems: "center",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8,
    },

    card: {
        width: "48%",
        height: 100,
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    cardSelected: {
        borderWidth: 2,
        borderColor: "#FF3C57",
    },

    cardContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    cardText: {
        color: "white",
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 16,
        textAlign: "center",
        justifyContent: "center",
        marginBottom: 3,
    },
    cardIcon: {
        color: "#FFFFFF",
        fontSize: 20,
        marginBottom: 8,
        textAlign: "center",
    },

    checkIcon: {
        position: "absolute",
        top: 8,
        right: 8
    },
});
