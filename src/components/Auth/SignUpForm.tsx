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
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, StackRoute } from "../../navigation/type";
import AuthFooter from "./AuthFooter";
import { useAuthContext } from "../../contexts/AuthContext";
import { setPreferences } from "../../services/users.service";
import { saveStoredPreferences } from "../../services/preferences.storage";
import AppModal from "../common/AppModal";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignupForm() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StackRoute<"SignUp">>();
    const { clearAuth, register } = useAuthContext();
    const selectedArtists = route.params?.artists ?? [];
    const selectedGenres = route.params?.genres ?? [];
    const selectedMoods = route.params?.moods ?? [];
    const selectedArtistIds = route.params?.artistIds ?? selectedArtists.map((artist) => artist.id);

    const [username, setUsername] = useState(route.params?.username ?? "");
    const [email, setEmail] = useState(route.params?.email ?? "");
    const [password, setPassword] = useState(route.params?.password ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");

    const handleSignup = async () => {
        // If user hasn't completed onboarding (genres required), redirect them
        if (!route.params?.genres || (route.params?.genres && route.params.genres.length === 0)) {
            navigation.navigate("Welcome_2", { username, email, password });
            return;
        }
        if (!email.trim() || !password) {
            setError("Please enter email and password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        const result = await register({
            email: email.trim(),
            password,
            username: username.trim() || undefined,
        });

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Registration failed");
            return;
        }

        let modalVisible = false;
        const showModal = (title: string, description?: string) => {
            setModalTitle(title);
            setModalDescription(description ?? "");
            setModalVisible(true);
            modalVisible = true;
        };

        if (selectedArtistIds.length > 0 || selectedGenres.length > 0 || selectedMoods.length > 0) {
            try {
                await saveStoredPreferences({
                    artists: selectedArtists,
                    genres: selectedGenres,
                    moods: selectedMoods,
                });

                const genreIds = selectedGenres.map((genre) => genre.id);
                const moodIds = selectedMoods.map((mood) => mood.id);

                if (selectedArtistIds.length >= 3 && genreIds.length > 0 && moodIds.length > 0) {
                    await setPreferences({
                        artistIds: selectedArtistIds,
                        genreIds,
                        moodIds,
                    });
                }
            } catch (preferencesError) {
                showModal(
                    "Account created",
                    preferencesError instanceof Error
                        ? `Preferences were not saved: ${preferencesError.message}`
                        : "Preferences were not saved."
                );
            }
        }

        await clearAuth();
        if (!modalVisible) {
            showModal("Account created", "Please sign in to continue.");
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
                disabled={loading || !email || !password}
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

            <AppModal
                visible={modalVisible}
                title={modalTitle}
                description={modalDescription}
                confirmText="OK"
                cancelText=""
                onCancel={() => setModalVisible(false)}
                onConfirm={() => {
                    setModalVisible(false);
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                }}
            />

            <AuthFooter
                footerText="Already have an account?"
                footerLinkText="Login"
                onFooterLinkPress={handleLoginRedirect}
            />
        </ScrollView>
    );
}
