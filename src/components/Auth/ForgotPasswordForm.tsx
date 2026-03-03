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
import { authService } from "../../api/authService";


type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ForgotPassword"
>;

export default function ForgotPasswordForm() {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSendReset = async (): Promise<void> => {
        if (!email) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);
        setError("");

        const result = await authService.forgotPassword({ email });

        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        // Success - navigate back to login
        navigation.goBack();
    };
    const handleBack = (): void => {
        navigation.goBack();
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
        >
            <Pressable
                onPress={handleBack}
                style={{ marginBottom: 10 }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
                <AntDesign name="arrow-left" size={22} color="#FF3C57" />
            </Pressable>

            <Text style={authStyles.heading}>Forgot Password?</Text>
            <Text style={authStyles.subHeading}>
                Enter your email and we’ll send you a reset link
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