
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { authStyles } from "../../style/authStyles";


import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "../../../utils/const";

export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        console.log("Signup pressed", { username, email, password });
    };

    const handleLoginRedirect = () => {
        console.log("Go to Login");
    };

    const handleGoogleLogin = () => {
        console.log("Google login pressed");
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={authStyles.scrollContent}>

            <Text style={authStyles.heading}>Create Account</Text>
            <Text style={authStyles.subHeading}>Your music world starts here.</Text>

            {/* USERNAME */}
            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>User Name</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#888"
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
                    placeholderTextColor="#888"
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
                    placeholderTextColor="#888"
                    secureTextEntry
                    style={authStyles.input}
                />
            </View>

            {/* CONTINUE BUTTON */}
            <Pressable
                onPress={handleSignup}
                style={authStyles.buttonWrapper}
            >
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
                        pressed && authStyles.googlePressed
                    ]}
                >
                    <AntDesign name="google-plus" size={35} color="#FF3C57" />
                </Pressable>
            </View>
            <View style={authStyles.footerContainer}>
                <Text style={authStyles.footerText}>
                    Don’t have an account?
                </Text>
                <TouchableOpacity onPress={handleLoginRedirect}>
                    <Text style={authStyles.footerLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}