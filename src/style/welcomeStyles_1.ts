import { SAIRA_STENCIL_ONE_REGULAR, OPENSANS_REGULAR } from "../../utils/const";
import { StyleSheet } from "react-native";
export const welcomeStyles_1 = StyleSheet.create({

    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        marginTop: 80,
        paddingHorizontal: 30,
    },

    logo: {
        width: 100,
        height: 100,
        marginBottom: 50,
    },

    heading: {
        fontSize: 24,
        color: "white",
        marginBottom: 10,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        textAlign: "center",
    },

    subHeading: {
        fontSize: 14,
        color: "#B0B3C7",
        marginBottom: 18,
        fontFamily: OPENSANS_REGULAR,
        textAlign: "center",
    },

    bottomContainer: {
        position: "absolute",
        bottom: 30,
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

    outlineButton: {
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FF3C57",
        backgroundColor: "transparent",
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        letterSpacing: 4,
    },
    footerText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontFamily: OPENSANS_REGULAR,
        fontSize: 15,
        paddingBottom: 70,
    },
    
});
