import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { authStyles } from "../../style/authStyles";

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
    const handleGoogleLogin = (): void => {
        console.log("Google login pressed");
    };

    return (
        <View style={authStyles.footerContainer}>
            {/* DIVIDER */}
            <View style={authStyles.dividerContainer}>
                <View style={authStyles.line} />
                <Text style={authStyles.dividerText}>OR CONTINUE WITH</Text>
                <View style={authStyles.line} />
            </View>

            {/* SOCIAL */}
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

            {/* FOOTER LINK */}
            <View style={authStyles.footerLinkContainer}>
                <Text style={authStyles.footerText}>{footerText}</Text>
                <TouchableOpacity onPress={onFooterLinkPress}>
                    <Text style={authStyles.footerLink}>{footerLinkText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}   