import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import { SectionHeader } from '../../components/Music/SectionHeader';
import PreferencesListItem from '../../components/Profile/PreferencesListItem';
import LogoutButton from '../../components/common/LogoutButton';
import AppModal from '../../components/common/AppModal';

import { useAuthContext } from "../../contexts/AuthContext";
import { getMe } from '../../services/users.service';
import { getStoredPreferences, StoredPreferences } from '../../services/preferences.storage';
import { usePlayerStore } from '../../store/playerStore';

const ProfileTab: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, logout, setUserProfile } = useAuthContext();
    const dismissPlayer = usePlayerStore((state) => state.dismissPlayer);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<StoredPreferences>({
        artists: [],
        genres: [],
        moods: [],
    });
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoDescription, setInfoDescription] = useState("");

    useFocusEffect(
        useCallback(() => {
            let mounted = true;

            const loadProfile = async () => {
                setProfileLoading(true);
                setProfileError(null);

                try {
                    const [profile, storedPreferences] = await Promise.all([
                        getMe(),
                        getStoredPreferences(),
                    ]);

                    if (mounted) {
                        await setUserProfile(profile);
                        setPreferences(storedPreferences);
                    }
                } catch (error) {
                    if (mounted) {
                        setProfileError(
                            error instanceof Error ? error.message : 'Could not load profile.'
                        );
                    }
                } finally {
                    if (mounted) {
                        setProfileLoading(false);
                    }
                }
            };

            void loadProfile();

            return () => {
                mounted = false;
            };
        }, [])
    );

    // HANDLERS
    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogoutConfirm = async () => {
        setLoading(true);

        try {
            await dismissPlayer();
            await logout();
            setInfoTitle('Logged out');
            setInfoDescription('You have been signed out.');
            setInfoVisible(true);
        } catch (error) {
            setInfoTitle('Error');
            setInfoDescription('Logout failed');
            setInfoVisible(true);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const showAboutApp = () => {
        setInfoTitle('About App');
        setInfoDescription('Music Mobile\nVersion 1.0.0');
        setInfoVisible(true);
    };

    const summarizePreferences = () => {
        const parts = [
            preferences.artists.length ? `${preferences.artists.length} artists` : null,
            preferences.genres.length ? `${preferences.genres.length} genres` : null,
        ].filter(Boolean);

        return parts.length > 0
            ? parts.join(' • ')
            : 'Choose artists and genres';
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <ProfileHeader
                    username={user?.username || user?.email || 'Profile'}
                    email={user?.email || ''}
                    avatarUrl={user?.avatarUrl}
                    onEditPress={handleEditProfile}
                />

                {profileLoading && <ActivityIndicator size="small" color="#FF4D6D" />}
                {profileError && <Text style={styles.stateText}>{profileError}</Text>}

                <View style={styles.section}>
                    <SectionHeader title="Preferences" hideViewAll />
                    <PreferencesListItem
                        title="Music Preferences"
                        subtitle={summarizePreferences()}
                        icon="tune"
                        onPress={() => navigation.navigate('Preferences')}
                    />
                </View>

                <View style={styles.section}>
                    <SectionHeader title="Support" hideViewAll />
                    <PreferencesListItem
                        title="About App"
                        subtitle="Version, credits, and app info"
                        icon="info"
                        onPress={showAboutApp}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.logoutSection}>
                    <LogoutButton
                        onPress={() => setShowModal(true)}
                        loading={loading}
                    />
                </View>
            </ScrollView>

            {/* MODAL */}
            <AppModal
                visible={showModal}
                title="Logout"
                description="Are you sure you want to logout?"
                confirmText="Logout"
                variant="danger"
                loading={loading}
                onCancel={() => setShowModal(false)}
                onConfirm={handleLogoutConfirm}
            />
            <AppModal
                visible={infoVisible}
                title={infoTitle}
                description={infoDescription}
                confirmText="OK"
                onCancel={() => setInfoVisible(false)}
                onConfirm={() => {
                    setInfoVisible(false);
                    // after successful logout, navigate to Login
                    if (infoTitle === 'Logged out') {
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }}
            />
        </View>
    );
};

export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 140,
    },
    section: {
        marginTop: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginTop: 32,
        marginBottom: 16,
    },
    logoutSection: {
        marginBottom: 24,
    },
    stateText: {
        color: '#AEB8D8',
        paddingVertical: 8,
    },
});
