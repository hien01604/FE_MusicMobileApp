import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
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

            // Debug: log full Google response
            // eslint-disable-next-line no-console
            console.log('[Auth] Google response', response);

            // ✅ LẤY ID TOKEN
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

            await promptAsync();

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[Auth] promptAsync error', err);
            setError(err instanceof Error ? err.message : "Google login failed");
        }
    };

    // 🔥 LOGIN TO BACKEND
    const handleLogin = async (idToken: string) => {
        setError("");
        try {
            // Debug: log idToken truncated
            // eslint-disable-next-line no-console
            console.log('[Auth] googleLogin idToken (truncated)', idToken?.slice?.(0, 40));

            const result = await googleLogin(idToken);
            // Debug: log backend result
            // eslint-disable-next-line no-console
            console.log('[Auth] googleLogin result', result);

            if (!result.success) {
                setError(result.message || "Google login failed");
            }
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('[Auth] googleLogin unexpected error', err);
            setError(err?.message || "Google login failed");
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
                    disabled={!request}
                    onPress={handleGoogleLogin}
                    style={({ pressed }) => [
                        authStyles.googleIconButton,
                        pressed && authStyles.googlePressed,
                    ]}
                >
                    <AntDesign
                        name="google"
                        size={35}
                        color="#FF3C57"
                    />
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
