import React, { useEffect } from "react";
import { ActivityIndicator, Alert, View, Text, TouchableOpacity, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { authStyles } from "../../style/authStyles";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useAuthContext } from "../../contexts/AuthContext";

WebBrowser.maybeCompleteAuthSession();

interface AuthFooterProps {
    footerText: string;
    footerLinkText: string;
    onFooterLinkPress: () => void;
}

export default function AuthFooter({
    footerText,
    footerLinkText,
    onFooterLinkPress,
}: AuthFooterProps) {

    const { googleLogin } = useAuthContext();
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "musicmobile",
    });
    // 🔥 REDIRECT URI
    const [request, response, promptAsync] =

        Google.useAuthRequest({

            androidClientId:
                process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,

            webClientId:
                process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

            redirectUri,
        });

    // 🔥 HANDLE GOOGLE RESPONSE
    useEffect(() => {

        if (response?.type === "success") {
            const idToken = response.params?.id_token;

            if (idToken) {
                handleLogin(idToken);
            } else {
                setError("No Google token returned");
            }
        }

    }, [response]);

    // 🔥 OPEN GOOGLE LOGIN
    const handleGoogleLogin = async () => {
        try {
            setError("");
            setLoading(true);
            await promptAsync();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 LOGIN TO BACKEND
    const handleLogin = async (idToken: string) => {
        setError("");
        setLoading(true);
        try {
            const result = await googleLogin(idToken);

            if (!result.success) {
                setError(result.message || "Google login failed");
                return;
            }

            Alert.alert("Signed in", "Google login successful.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={authStyles.footerContainer}>

            {/* DIVIDER */}
            <View style={authStyles.dividerContainer}>
                <View style={authStyles.line} />

                <Text style={authStyles.dividerText}>
                    OR CONTINUE WITH
                </Text>

                <View style={authStyles.line} />
            </View>

            {/* GOOGLE BUTTON */}
            <View style={authStyles.socialContainer}>

                <Pressable
                    disabled={!request || loading}
                    onPress={handleGoogleLogin}
                    style={({ pressed }) => [
                        authStyles.googleIconButton,
                        pressed && authStyles.googlePressed,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FF3C57" />
                    ) : (
                        <AntDesign
                            name="google"
                            size={35}
                            color="#FF3C57"
                        />
                    )}
                </Pressable>

            </View>

            {error ? (
                <Text style={{ color: "#FF3C57", textAlign: "center", marginBottom: 12 }}>
                    {error}
                </Text>
            ) : null}

            {/* FOOTER */}
            <View style={authStyles.footerLinkContainer}>

                <Text style={authStyles.footerText}>
                    {footerText}
                </Text>

                <TouchableOpacity
                    onPress={onFooterLinkPress}
                >
                    <Text style={authStyles.footerLink}>
                        {footerLinkText}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
