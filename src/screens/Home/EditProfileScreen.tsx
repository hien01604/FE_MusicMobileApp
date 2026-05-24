import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Animated
} from "react-native";
import AppModal from "../../components/common/AppModal";
import { useNavigation } from "@react-navigation/native";
import Layout from "../../components/common/Layout";
import BackButton from "../../components/common/BackButton";

import { useAuthContext } from "../../contexts/AuthContext";
import { updateMe } from "../../services/users.service";
import { SAIRA_STENCIL_ONE_REGULAR } from "../../../utils/const";


export default function EditProfileScreen() {
    const navigation = useNavigation<any>();
    const { user, setUserProfile } = useAuthContext();

    const [username, setUsername] = useState(user?.username || "");
    const [email] = useState(user?.email || "");

    const [loading, setLoading] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoDescription, setInfoDescription] = useState("");
    const [error, setError] = useState("");

    // animation giống Home
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeAnim.setValue(0.3);
        slideAnim.setValue(8);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleUpdateProfile = async () => {
        if (!username.trim()) {
            return setError("Username cannot be empty");
        }

        try {
            setLoading(true);
            setError("");

            const updatedUser = await updateMe({ username: username.trim() });
            setInfoTitle("Profile updated");
            setInfoDescription("Your profile has been saved.");
            setInfoVisible(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <View style={styles.wrapper}>

                {/* BACK + TITLE */}
                <View style={styles.headerRow}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 32 }} />
                </View>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* AVATAR */}
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {username.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        {/* INFO */}
                        <Text style={styles.sectionTitle}>Information</Text>

                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            editable={false}
                            style={[styles.input, { opacity: 0.6 }]}
                        />

                        {/* BUTTONS */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleUpdateProfile}
                                activeOpacity={0.85}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FF3C57" />
                                ) : (
                                    <Text style={styles.saveText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {error && <Text style={styles.error}>{error}</Text>}
                        <AppModal
                            visible={infoVisible}
                            title={infoTitle}
                            description={infoDescription}
                            confirmText="OK"
                            onCancel={() => setInfoVisible(false)}
                            onConfirm={() => {
                                setInfoVisible(false);
                                navigation.goBack();
                            }}
                        />
                    </ScrollView>
                </Animated.View>
            </View>
        </Layout>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: 0.5,
        textAlign: "center",
    },

    container: {
        flex: 1,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FF3C57",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,

        shadowColor: "#FF3C57",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },

    avatarText: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 10,
    },

    label: {
        color: "#aaa",
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#1a1f3a",
        borderRadius: 12,
        padding: 14,
        color: "#fff",
        marginBottom: 12,
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 30,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.25)",
        backgroundColor: "rgba(255,255,255,0.06)",
        alignItems: "center",
    },

    cancelText: {
        color: "#aaa",
        fontWeight: "600",
    },

    saveBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: "#FF3C57",
        alignItems: "center",

        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    saveText: {
        color: "#FF3C57",
        fontWeight: "600",
    },

    error: {
        color: "#FF3C57",
        marginTop: 10,
    },
});
