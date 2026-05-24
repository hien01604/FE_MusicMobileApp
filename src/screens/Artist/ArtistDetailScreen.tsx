import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppModal from '../../components/common/AppModal';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import { SongListItem } from '../../components/Music/SongListItem';
import {
    getArtistById,
    getArtistTopTracks,
    followArtist,
    mapArtistDtoToArtist,
    unfollowArtist,
} from '../../services/artists.service';
import { applyLikedStatus, mapSongDtoToSong } from '../../services/song.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import { usePlayerStore } from '../../store/playerStore';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import {
    isArtistFollowed,
    removeFollowedArtist,
    saveFollowedArtist,
} from '../../services/followedArtists.storage';
import { publishFollowedArtistsChange } from '../../services/artistFollow.events';
import type { RootStackParamList } from '../../navigation/type';
import type { Artist, Song } from '../../types';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtistDetail'>;

export default function ArtistDetailScreen({ route, navigation }: Props) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Song[]>([]);
    const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const [isFollowed, setIsFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [activeTrackTab, setActiveTrackTab] = useState<'top' | 'all'>('top');
    const playSong = usePlayerStore((state) => state.playSong);
    const updateSongById = usePlayerStore((state) => state.updateSongById);
    const { artistId } = route.params;

    useEffect(() => {
        let mounted = true;

        const loadArtist = async () => {
            setLoading(true);
            setError(null);

            try {
                const [artistDetail, tracks, followed] = await Promise.all([
                    getArtistById(artistId),
                    getArtistTopTracks(artistId, 20),
                    isArtistFollowed(artistId),
                ]);

                if (mounted) {
                    setArtist(mapArtistDtoToArtist(artistDetail));
                    setTopTracks(await applyLikedStatus(tracks.map(mapSongDtoToSong)));
                    setIsFollowed(followed);
                }
            } catch (loadError) {
                if (mounted) {
                    setArtist(null);
                    setTopTracks([]);
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Could not load artist.'
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void loadArtist();

        return () => {
            mounted = false;
        };
    }, [artistId]);

    const handleSongPress = (song: Song) => {
        void playSong(song, topTracks);
        navigation.navigate('Player', { songId: song.id });
    };

    const applySongState = (songId: string, patch: Partial<Song>) => {
        setTopTracks((currentSongs) =>
            currentSongs.map((song) => (song.id === songId ? { ...song, ...patch } : song))
        );
        updateSongById(songId, patch);
    };

    useEffect(() => subscribeSongPatches(applySongState), [updateSongById]);

    const updateSongState = (songId: string, patch: Partial<Song>) => {
        applySongState(songId, patch);
        publishSongPatch(songId, patch);
    };

    const handleToggleLike = async (song: Song) => {
        const nextLiked = !song.isLiked;
        updateSongState(song.id, { isLiked: nextLiked });

        try {
            if (!nextLiked) {
                await unlikeSong(song.id);
            } else {
                await likeSong({ songId: song.id });
            }
        } catch {
            updateSongState(song.id, { isLiked: Boolean(song.isLiked) });
            setInfoTitle('Error');
            setInfoDescription('Could not update liked songs.');
            setInfoVisible(true);
        }
    };

    const handleToggleFollow = async () => {
        if (!artist || followLoading) {
            return;
        }

        const nextFollowed = !isFollowed;
        setIsFollowed(nextFollowed);
        setFollowLoading(true);

        try {
            if (nextFollowed) {
                await followArtist(artist.id);
            } else {
                await unfollowArtist(artist.id);
            }

            const artists = nextFollowed
                ? await saveFollowedArtist(artist)
                : await removeFollowedArtist(artist.id);

            publishFollowedArtistsChange(artists);
        } catch {
            setIsFollowed(!nextFollowed);
            setInfoTitle('Error');
            setInfoDescription(
                nextFollowed
                    ? 'Could not follow this artist.'
                    : 'Could not unfollow this artist.'
            );
            setInfoVisible(true);
        } finally {
            setFollowLoading(false);
        }
    };

    const renderArtistHeader = () => {
        if (!artist) {
            return null;
        }

        return (
            <View>
                <ImageBackground
                    source={{ uri: artist.image }}
                    style={styles.hero}
                    imageStyle={styles.heroImage}
                >
                    <View style={styles.heroOverlay} />
                    <LinearGradient
                        pointerEvents="none"
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.82)']}
                        locations={[0, 1]}
                        style={styles.heroBottomShade}
                    />
                    <View style={styles.heroContent}>
                        <Text style={styles.artistName} numberOfLines={1}>
                            {artist.name}
                        </Text>
                        <Pressable
                            disabled={followLoading}
                            style={[
                                styles.followButton,
                                isFollowed && styles.followButtonActive,
                                followLoading && styles.followButtonDisabled,
                            ]}
                            onPress={() => void handleToggleFollow()}
                        >
                            {followLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.followButtonText}>
                                    {isFollowed ? 'Following' : 'Follow'}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                    <Text style={styles.artistStats}>
                        {topTracks.length} top tracks • {isFollowed ? 'Following' : 'Not following'}
                    </Text>
                </ImageBackground>

                {artist.bio ? (
                    <Text style={styles.artistBio}>{artist.bio}</Text>
                ) : null}

                <View style={styles.trackTabs}>
                    {[
                        { id: 'top' as const, label: 'Top Songs' },
                        { id: 'all' as const, label: 'All Songs' },
                    ].map((tab) => {
                        const selected = activeTrackTab === tab.id;

                        return (
                            <Pressable
                                key={tab.id}
                                style={[styles.trackTab, selected && styles.trackTabActive]}
                                onPress={() => setActiveTrackTab(tab.id)}
                            >
                                <Text
                                    style={[
                                        styles.trackTabText,
                                        selected && styles.trackTabTextActive,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Artist</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {loading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                    </View>
                ) : error ? (
                    <View style={styles.stateContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={topTracks}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={renderArtistHeader}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No top tracks found.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <SongListItem
                                song={item}
                                onPress={handleSongPress}
                                onToggleLike={handleToggleLike}
                                onAddToPlaylist={setPlaylistSong}
                            />
                        )}
                    />
                )}

                <AddToPlaylistModal
                    visible={Boolean(playlistSong)}
                    song={playlistSong}
                    onClose={() => setPlaylistSong(null)}
                    onAdded={(song) => updateSongState(song.id, { isInPlaylist: true })}
                    onRemoved={(song) => updateSongState(song.id, { isInPlaylist: false })}
                    onError={(message) => {
                        setInfoTitle('Error');
                        setInfoDescription(message);
                        setInfoVisible(true);
                    }}
                />
                <AppModal
                    visible={infoVisible}
                    title={infoTitle}
                    description={infoDescription}
                    confirmText="OK"
                    onCancel={() => setInfoVisible(false)}
                    onConfirm={() => setInfoVisible(false)}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        flex: 1,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 22,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 32,
    },
    heroBottomShade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 108,
    },
    stateContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 18,
    },
    errorText: {
        color: '#FF7B95',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 120,
    },
    hero: {
        height: 230,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRadius: 14,
        marginBottom: 16,
        backgroundColor: '#151A35',
    },
    heroImage: {
        resizeMode: 'cover',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 8, 24, 0.38)',
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        zIndex: 1,
    },
    artistName: {
        color: '#FFFFFF',
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
    },
    artistStats: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 18,
        paddingBottom: 16,
        paddingTop: 8,
        zIndex: 1,
    },
    followButton: {
        minWidth: 82,
        minHeight: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 12,
    },
    followButtonActive: {
        backgroundColor: 'rgba(255, 77, 109, 0.72)',
    },
    followButtonDisabled: {
        opacity: 0.65,
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
    artistBio: {
        color: '#AEB8D8',
        lineHeight: 20,
        marginBottom: 16,
    },
    trackTabs: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 10,
    },
    trackTab: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255,255,255,0.12)',
        paddingBottom: 9,
    },
    trackTabActive: {
        borderBottomColor: '#FF4D6D',
    },
    trackTabText: {
        color: '#AEB8D8',
        fontSize: 13,
        fontWeight: '800',
    },
    trackTabTextActive: {
        color: '#FFFFFF',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 36,
    },
    emptyText: {
        color: '#AEB8D8',
    },
});
