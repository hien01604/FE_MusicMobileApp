import { StyleSheet } from "react-native";

export const welcomeStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    logo: {
        fontSize: 40,
        color: "#FF5A87",
        marginBottom: 40,
    },

    title: {
        fontSize: 28,
        color: "white",
        fontWeight: "600",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: "#D1D5DB",
        textAlign: "center",
    },

    button: {
        position: "absolute",
        bottom: 120,
        width: "80%",
    },

    gradientButton: {
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

    dots: {
        position: "absolute",
        bottom: 60,
        flexDirection: "row",
    },

    dotActive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF3C57",
        marginHorizontal: 5,
    },

    dotInactive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#999",
        marginHorizontal: 5,
    },
});