import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { authStyles } from "../../style/authStyles";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import * as authService from "../../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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

    const navigation = useNavigation<any>();

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
        androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
        iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    });

    // 🔥 Sau khi login Google thành công
    useEffect(() => {
        if (response?.type === "success") {
            const idToken = response.authentication?.idToken;

            if (idToken) {
                handleLogin(idToken);
            } else {
                console.log("❌ No idToken");
            }
        }
    }, [response]);

    const handleGoogleLogin = async () => {
        try {
            await promptAsync();
        } catch (err) {
            console.log("Google login error:", err);
        }
    };

    const handleLogin = async (idToken: string) => {
        try {
            const res = await authService.googleLogin({ idToken });

            // 🔥 LƯU TOKEN
            await AsyncStorage.setItem("accessToken", res.accessToken);
            await AsyncStorage.setItem("refreshToken", res.refreshToken);
            await AsyncStorage.setItem("user", JSON.stringify(res.user));

            console.log("✅ LOGIN SUCCESS:", res.user);

            // NAVIGATE VÀO APP
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });

        } catch (err: any) {
            console.log("❌ LOGIN FAIL:", err.message);
        }
    };

    return (
        <View style={authStyles.footerContainer}>
            {/* DIVIDER */}
            <View style={authStyles.dividerContainer}>
                <View style={authStyles.line} />
                <Text style={authStyles.dividerText}>OR CONTINUE WITH</Text>
                <View style={authStyles.line} />
            </View>

            {/* GOOGLE BUTTON */}
            <View style={authStyles.socialContainer}>
                <Pressable
                    onPress={handleGoogleLogin}
                    style={({ pressed }) => [
                        authStyles.googleIconButton,
                        pressed && authStyles.googlePressed,
                    ]}
                >
                    <AntDesign name="google-plus" size={35} color="#FF3C57" />
                </Pressable>
            </View>

            {/* FOOTER */}
            <View style={authStyles.footerLinkContainer}>
                <Text style={authStyles.footerText}>{footerText}</Text>
                <TouchableOpacity onPress={onFooterLinkPress}>
                    <Text style={authStyles.footerLink}>{footerLinkText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}