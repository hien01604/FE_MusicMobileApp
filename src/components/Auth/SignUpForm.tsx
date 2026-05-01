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
import useAuth from "../../hooks/useAuth";
import { AUTH_UI_ONLY_MODE } from "../../../utils/const";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignupForm() {
    const navigation = useNavigation<NavigationProp>();
    const { register } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async () => {
        if (AUTH_UI_ONLY_MODE) {
            navigation.navigate("Login");
            return;
        }

        if (!username || !email || !password) {
            setError("Please enter all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await register(username, email, password);

            if (!result.success) {
                setError(result.message || "Sign up failed");
                return;
            }

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigation.navigate("Login");
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
        >
            <Text style={authStyles.heading}>Create Account</Text>
            <Text style={authStyles.subHeading}>Your music world starts here.</Text>

            {/* USERNAME */}
            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>User Name</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#ffffff"
                    style={authStyles.input}
                    autoCapitalize="none"
                />
            </View>

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
            </View>

            {/* BUTTON */}
            <Pressable
                onPress={handleSignup}
                style={authStyles.buttonWrapper}
                disabled={loading || !username || !email || !password}
            >
                {({ pressed }) =>
                    pressed && !loading ? (
                        <View style={authStyles.outlineButton}>
                            <Text style={authStyles.buttonText}>Sign Up</Text>
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
                                <Text style={authStyles.buttonText}>Sign Up</Text>
                            )}
                        </LinearGradient>
                    )
                }
            </Pressable>

            {error ? (
                <Text style={{ color: "#FF3C57", textAlign: "center", marginTop: 10 }}>
                    {error}
                </Text>
            ) : null}

            <AuthFooter
                footerText="Already have an account?"
                footerLinkText="Login"
                onFooterLinkPress={handleLoginRedirect}
            />
        </ScrollView>
    );
}