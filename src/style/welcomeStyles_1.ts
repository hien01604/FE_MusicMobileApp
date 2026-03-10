import { SAIRA_STENCIL_ONE_REGULAR, OPENSANS_REGULAR } from "../../utils/const";
import { StyleSheet } from "react-native";
export const welcomeStyles = StyleSheet.create({

    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    logo: {
        width: 100,
        height: 100,
        marginBottom: 50,
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
        fontFamily: OPENSANS_REGULAR,
        textAlign: "center",
    },

    bottomContainer: {
        position: "absolute",
        bottom: 40,
        left: 30,
        right: 30,
        alignItems: "center",
    },

    button: {
        width: "100%",
        marginBottom: 20,
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
});