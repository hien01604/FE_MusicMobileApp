import { StyleSheet } from "react-native";
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";

export const welcomeStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 100,
        marginBottom: 50,
    },
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 100,
        paddingHorizontal: 30,
    },
    heading: {
        fontSize: 32,
        color: "white",
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        textAlign: "center",
    },

    subHeading: {
        fontSize: 16,
        color: "#B0B3C7",
        marginTop: 4,
        marginBottom: 40,
        fontFamily: OPENSANS_REGULAR,
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