import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../hooks/useAuth";
import type { StackNavigation } from "../navigation/type";

interface HomeScreenProps {
    navigation: StackNavigation<"Home">;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigation.replace("Login");
    };

    return (
        <LinearGradient
            colors={["#1a1a2e", "#0f3460", "#16213e"]}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Music App</Text>
                <Text style={styles.subtitle}>
                    Hello, {user?.username || user?.email}!
                </Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#aaa",
        marginBottom: 40,
        textAlign: "center",
    },
    logoutButton: {
        backgroundColor: "#e94560",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginTop: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
