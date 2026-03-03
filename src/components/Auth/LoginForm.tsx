import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authStyles } from "../../style/authStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/type";
import AuthFooter from "./AuthFooter";
import { useAuth } from "../../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginForm() {
    const navigation = useNavigation<NavigationProp>();
    const { login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleLogin = async (): Promise<void> => {
        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        setLoading(true);
        setError("");

        const result = await login(email, password);

        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
        });
    };
    const handleForgotPassword = (): void => {
        navigation.navigate("ForgotPassword");
    };

    const handleSignUp = (): void => {
        navigation.navigate("SignUp");
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
        >
            <Text style={authStyles.heading}>Welcome Back</Text>
            <Text style={authStyles.subHeading}>Sign in to continue your journey</Text>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Email Address</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#ffffff"
                    style={authStyles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    style={authStyles.input}
                />

                <Pressable onPress={handleForgotPassword}>
                    <Text style={authStyles.forgotText}>Forgot Password?</Text>
                </Pressable>
            </View>

            <Pressable onPress={handleLogin} style={authStyles.buttonWrapper} disabled={loading}>
                {({ pressed }) =>
                    pressed && !loading ? (
                        <View style={authStyles.outlineButton}>
                            <Text style={authStyles.buttonText}>Login</Text>
                        </View>
                    ) : (
                        <LinearGradient
                            colors={["#FF3C57", "#eb8196"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={authStyles.gradientButton}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={authStyles.buttonText}>Login</Text>
                            )}
                        </LinearGradient>
                    )
                }
            </Pressable>

            {error && <Text style={{ color: "#FF3C57", textAlign: "center", marginTop: 10 }}>{error}</Text>}

            <AuthFooter
                footerText="Don't have an account?"
                footerLinkText="Create one"
                onFooterLinkPress={handleSignUp}
            />
        </ScrollView>
    );
}