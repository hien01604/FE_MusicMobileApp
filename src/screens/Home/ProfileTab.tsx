import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import { SectionHeader } from '../../components/Music/SectionHeader';
import { SongCard } from '../../components/Music/SongCard';
import PreferencesListItem from '../../components/Profile/PreferencesListItem';
import LogoutButton from '../../components/common/LogoutButton';
import AppModal from '../../components/common/AppModal';

import { useAuthContext } from "../../contexts/AuthContext";
import type { Song } from '../../types';
import { mapSongDtoToSong } from '../../services/song.service';
import { getLikedSongs, getMe } from '../../services/users.service';

const ProfileTab: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, logout, setUserProfile } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    React.useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            setProfileLoading(true);
            setProfileError(null);

            try {
                const [profile, liked] = await Promise.all([
                    getMe(),
                    getLikedSongs(6),
                ]);

                if (mounted) {
                    await setUserProfile(profile);
                    setLikedSongs(liked.map(mapSongDtoToSong));
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
    }, []);

    // HANDLERS
    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogoutConfirm = async () => {
        setLoading(true);

        try {
            await logout();
            Alert.alert('Logged out', 'You have been signed out.');
        } catch (error) {
            Alert.alert('Error', 'Logout failed');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={['left', 'right', 'bottom']}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <ProfileHeader
                    username={user?.username || user?.email || 'Profile'}
                    email={user?.email || ''}
                    onEditPress={handleEditProfile}
                />

                {profileLoading && <ActivityIndicator size="small" color="#FF4D6D" />}
                {profileError && <Text style={styles.stateText}>{profileError}</Text>}

                {/* LIKED SONGS */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Liked Songs"
                        onSeeAllPress={() =>
                            navigation.navigate('SongList', {
                                title: 'Liked Songs',
                                sourceType: 'liked',
                            })
                        }
                    />
                    {likedSongs.map(s => (
                        <SongCard
                            key={s.id}
                            item={s}
                            onPress={() => navigation.navigate('Player', { songId: s.id })}
                        />
                    ))}
                    {!profileLoading && likedSongs.length === 0 && (
                        <Text style={styles.stateText}>No liked songs yet.</Text>
                    )}
                </View>

                {/* PREFERENCES */}
                <View style={[styles.section, styles.settingsSection]}>
                    <SectionHeader title="Preferences" hideViewAll />
                    <PreferencesListItem
                        title="Favorite Artists"
                        onPress={() => navigation.navigate('Preferences')}
                    />
                    <PreferencesListItem
                        title="Favorite Genres"
                        onPress={() => navigation.navigate('Preferences')}
                    />
                    <PreferencesListItem
                        title="Favorite Moods"
                        onPress={() => navigation.navigate('Preferences')}
                    />
                </View>

                {/* LOGOUT */}
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
        </SafeAreaView>
    );
};

export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: 24,
    },
    settingsSection: {
        marginTop: 32,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
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
