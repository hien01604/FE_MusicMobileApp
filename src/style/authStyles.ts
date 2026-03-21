import { StyleSheet } from "react-native";
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "../../utils/const";

export const authStyles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 20,
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
    // title: {
    //     color: "white",
    //     fontSize: 40,
    //     marginBottom: 40,
    //     textAlign: "center",
    //     fontFamily: SAIRA_STENCIL_ONE_REGULAR,
    //     letterSpacing: 4,
    // },
    inputGroup: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    label: {
        color: "#ffffff",
        marginBottom: 10,
        marginLeft: 4,
        fontFamily: OPENSANS_REGULAR,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "rgba(128, 128, 128, 0.45)",
        borderWidth: 1,
        borderColor: "#ffffff",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: "white",
        fontFamily: OPENSANS_REGULAR,
        outlineWidth: 0,
        elevation: 0,
    },
    inputFocused: {
        borderColor: "#f9f6f7",
        borderWidth: 2,
    },
    forgotText: {
        textAlign: "right",
        color: "#ffffff",
        marginTop: 12,
        fontFamily: OPENSANS_REGULAR,
        fontStyle: "italic",
    },
    buttonWrapper: {
        marginTop: 20,

    },
    gradientButton: {
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "transparent",
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
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        width: "100%"
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#9CA3AF",
    },
    dividerText: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
        fontFamily: OPENSANS_REGULAR,
        marginHorizontal: 10,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    googleIconButton: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: "#f9e8e8",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "red",
    },

    googlePressed: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#FF3C57",
    },
    footerContainer: {
        marginTop: "auto",
        paddingTop: 30,
        paddingBottom: 50,
        paddingHorizontal: 20,
        flexDirection: "column",
        alignItems: "center",
    },
    footerLinkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 4,
    },
    footerText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontFamily: OPENSANS_REGULAR,
        fontSize: 15,
    },
    footerLink: {
        color: "#FF3C57",
        fontWeight: "bold",
        paddingHorizontal: 10,
        fontFamily: OPENSANS_REGULAR,
        fontSize: 15,
    },
});