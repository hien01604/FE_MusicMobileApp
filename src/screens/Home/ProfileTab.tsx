import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import { SectionHeader } from '../../components/Music/SectionHeader';
import PlaylistCard from '../../components/Music/PlaylistCard';
import { SongCard } from '../../components/Music/SongCard';
import PreferencesListItem from '../../components/Profile/PreferencesListItem';
import LogoutButton from '../../components/common/LogoutButton';
import ArtistCard from '../../components/Music/ArtistCard';
import AppModal from '../../components/common/AppModal'; // ✅ THÊM IMPORT

import { useAuthContext } from "../../contexts/AuthContext";

const ProfileTab: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, logout } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // MOCK DATA
    const playlists = [
        { id: '1', name: 'Summer Vibes', songCount: 24, thumbnail: 'https://via.placeholder.com/80' },
        { id: '2', name: 'Workout Mix', songCount: 18, thumbnail: 'https://via.placeholder.com/80' },
    ];

    const likedSongs = [
        { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', albumImage: 'https://via.placeholder.com/60' },
        { id: '2', title: 'As It Was', artist: 'Harry Styles', albumImage: 'https://via.placeholder.com/60' },
    ];

    const followedArtists = [
        { id: '1', name: 'The Weeknd', avatar: 'https://via.placeholder.com/80' },
        { id: '2', name: 'Taylor Swift', avatar: 'https://via.placeholder.com/80' },
    ];

    // HANDLERS
    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogoutConfirm = async () => {
        setLoading(true);

        try {
            await logout(); // 
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
                    username={user?.username || 'User'}
                    email={user?.email || 'user@email.com'}
                    onEditPress={handleEditProfile}
                />

                {/* PLAYLIST */}
                <View style={styles.section}>
                    <SectionHeader title="My Playlists" onSeeAllPress={() => { }} />
                    {playlists.map(p => (
                        <PlaylistCard key={p.id} {...p} onPress={() => { }} />
                    ))}
                </View>

                {/* LIKED SONGS */}
                <View style={styles.section}>
                    <SectionHeader title="Liked Songs" onSeeAllPress={() => { }} />
                    {likedSongs.map(s => (
                        <SongCard
                            key={s.id}
                            item={{
                                id: s.id,
                                title: s.title,
                                artist: s.artist,
                                image: s.albumImage,
                            }}
                            onPress={() => { }}
                        />
                    ))}
                </View>

                {/* ARTISTS */}
                <View style={styles.section}>
                    <SectionHeader title="Artists" onSeeAllPress={() => { }} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {followedArtists.map(a => (
                            <ArtistCard
                                key={a.id}
                                item={{
                                    id: a.id,
                                    name: a.name,
                                    image: a.avatar,
                                }}
                                onPress={() => { }}
                            />
                        ))}
                    </ScrollView>
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
});