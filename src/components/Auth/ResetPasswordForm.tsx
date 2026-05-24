import React, { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import AppModal from "../common/AppModal";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackRoute, RootStackParamList } from "../../navigation/type";
import { authStyles } from "../../style/authStyles";
import BackButton from "../common/BackButton";
import { useAuthContext } from "../../contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ResetPassword">;

export default function ResetPasswordForm() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StackRoute<"ResetPassword">>();
    const { resetPassword, loading } = useAuthContext();

    const [token, setToken] = useState(route.params?.token || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");

    const handleResetPassword = async (): Promise<void> => {
        if (!token.trim() || !newPassword) {
            setError("Please enter reset token and new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setMessage("");

        const result = await resetPassword(token.trim(), newPassword);
        if (!result.success) {
            setError(result.message || "Password reset failed");
            return;
        }

        setMessage("Password reset successful. Please login again.");
        setModalTitle("Password reset");
        setModalDescription("Password reset successful. Please login again.");
        setModalVisible(true);
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            <BackButton onBack={navigation.goBack} />

            <Text style={authStyles.heading}>Reset Password</Text>
            <Text style={authStyles.subHeading}>Enter your reset token and a new password</Text>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Reset Token</Text>
                <TextInput
                    value={token}
                    onChangeText={setToken}
                    placeholder="Enter reset token"
                    placeholderTextColor="#ffffff"
                    style={authStyles.input}
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                />
            </View>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>New Password</Text>
                <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    style={authStyles.input}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Confirm Password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    style={authStyles.input}
                    underlineColorAndroid="transparent"
                />
            </View>

            <Pressable
                onPress={handleResetPassword}
                style={authStyles.buttonWrapper}
                disabled={loading || !token || !newPassword || !confirmPassword}
            >
                {({ pressed }) =>
                    pressed && !loading ? (
                        <View style={authStyles.outlineButton}>
                            <Text style={authStyles.buttonText}>Reset</Text>
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
                                <Text style={authStyles.buttonText}>Reset</Text>
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
            {message ? (
                <Text style={{ color: "#7EE787", textAlign: "center", marginTop: 10 }}>
                    {message}
                </Text>
            ) : null}
            <AppModal
                visible={modalVisible}
                title={modalTitle}
                description={modalDescription}
                confirmText="Login"
                onCancel={() => setModalVisible(false)}
                onConfirm={() => {
                    setModalVisible(false);
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                }}
            />
        </ScrollView>
    );
}
