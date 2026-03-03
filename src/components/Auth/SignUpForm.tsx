import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authStyles } from "../../style/authStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/type";
import AuthFooter from "./AuthFooter";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignupForm() {
    const navigation = useNavigation<NavigationProp>();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignup = (): void => {
        console.log("Signup pressed", { username, email, password });
        // TODO: call API signup
    };

    const handleLoginRedirect = (): void => {
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
                    keyboardType="default"
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

            {/* CONTINUE BUTTON */}
            <Pressable onPress={handleSignup} style={authStyles.buttonWrapper}>
                {({ pressed }) =>
                    pressed ? (
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
                            <Text style={authStyles.buttonText}>Sign Up</Text>
                        </LinearGradient>
                    )
                }
            </Pressable>

            <AuthFooter
                footerText="Already have an account?"
                footerLinkText="Login"
                onFooterLinkPress={handleLoginRedirect}
            />
        </ScrollView>
    );
}