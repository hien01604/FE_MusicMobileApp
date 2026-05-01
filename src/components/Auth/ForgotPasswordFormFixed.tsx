import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { authStyles } from "../../style/authStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/type";
import BackButton from "../common/BackButton";
import { useAuth } from "../../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ForgotPassword"
>;

export default function ForgotPasswordForm() {
    const navigation = useNavigation<NavigationProp>();
    const { forgotPassword, loading } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSendReset = async (): Promise<void> => {
        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        const result = await forgotPassword(email.trim());

        if (!result.success) {
            setError(result.message || "Failed to send reset email");
            return;
        }

        // Success - navigate back to login
        navigation.goBack();
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
        >
            <BackButton onBack={navigation.goBack} />

            <Text style={authStyles.heading}>Forgot Password?</Text>
            <Text style={authStyles.subHeading}>
                Enter your email and we'll send you a reset link
            </Text>

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
                    underlineColorAndroid="transparent"
                />
            </View>

            <Pressable onPress={handleSendReset} style={authStyles.buttonWrapper} disabled={loading}>
                {({ pressed }) =>
                    pressed && !loading ? (
                        <View style={authStyles.outlineButton}>
                            <Text style={authStyles.buttonText}>Send Reset Link</Text>
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
                                <Text style={authStyles.buttonText}>Send Reset Link</Text>
                            )}
                        </LinearGradient>
                    )
                }
            </Pressable>

            {error && <Text style={{ color: "#FF3C57", textAlign: "center", marginTop: 10 }}>{error}</Text>}
        </ScrollView>
    );
}
