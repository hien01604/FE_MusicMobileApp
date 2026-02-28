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
    },
    label: {
        color: "#ffffff",
        marginBottom: 10,
        marginLeft: 4,
        fontFamily: OPENSANS_REGULAR,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "rgba(26, 31, 58, 0.5)",
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: "white",
        fontFamily: OPENSANS_REGULAR,
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
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#1F2937",
    },
    dividerText: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
        fontFamily: OPENSANS_REGULAR,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
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
        marginTop: 30,
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
        paddingHorizontal: 4,
        fontFamily: OPENSANS_REGULAR,
        fontSize: 15,
    },
});