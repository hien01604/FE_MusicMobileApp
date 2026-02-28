import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "../../../utils/const";
// import { GoogleSignin } from 'npx expo install expo-auth-session expo-web-browser';

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Login pressed", { email, password });
        // Thêm logic đăng nhập ở đây
    };
    const handleSignUp = () => {
        console.log("Sign Up pressed");
        // Thêm logic đăng ký ở đây
    };
    const handleForgotPassword = () => {
        console.log("Forgot Password pressed");
        // Thêm logic quên mật khẩu ở đây
    };
    const handleGoogleLogin = () => {
        console.log("Google login pressed");
    };
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
                <LinearGradient
                    colors={["#FF3C57", "#FF6A88"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.buttonText}>Login →</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.socialContainer}>
                <TouchableOpacity
                    style={styles.googleIconButton}
                    onPress={handleGoogleLogin}
                    activeOpacity={0.8}
                >
                    <AntDesign name="google-plus" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.signupContainer}>
                <Text style={styles.footerText}>
                    Don’t have an account?
                </Text>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signupLink}>Create one</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 80,
    },
    title: {
        color: "white",
        fontSize: 40,
        // fontWeight: "bold",
        marginBottom: 40,
        textAlign: "center",
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        letterSpacing: 4,
    },
    inputGroup: {
        marginBottom: 20,
        // marginHorizontal: 12,
    },
    label: {
        color: "#ffffff",
        marginBottom: 8,
        marginLeft: 4,
        fontFamily: OPENSANS_REGULAR,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "rgba(26, 31, 58, 0.5)",
        borderWidth: 1,
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
        textDecorationLine: "underline",
        fontStyle: "italic",
    },
    buttonWrapper: {
        marginTop: 30,
        // marginHorizontal: 16,
    },
    gradientButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#FF3C57",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 40,
        // marginHorizontal: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#1F2937",
    },
    dividerText: {
        color: "#6B7280",
        // marginHorizontal: 16,
        fontSize: 12,
        fontWeight: "600",
        fontFamily: OPENSANS_REGULAR,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#0B0F2A",
    },
    googleIconButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#1A1F3A",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FF3C57",
    },
    signupContainer: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "center",
        gap: 4,
    },
    footerText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontFamily: OPENSANS_REGULAR,
    },
    signupLink: {
        color: "#FF3C57",
        fontWeight: "bold",
        paddingHorizontal: 4,
        fontFamily: OPENSANS_REGULAR,
    },
});