import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import AppModal from '../../components/common/AppModal';
import PlaylistNameModal from '../../components/common/PlaylistNameModal';
import PlaylistOptionsModal from '../../components/common/PlaylistOptionsModal';
import ArtistCard from '../../components/Music/ArtistCard';
import HorizontalList from '../../components/Music/HorizontalList';
import PlaylistCard from '../../components/Music/PlaylistCard';
import { SectionHeader } from '../../components/Music/SectionHeader';
import { getFollowedArtists } from '../../services/followedArtists.storage';
import { subscribeFollowedArtists } from '../../services/artistFollow.events';
import {
    createPlaylist,
    deletePlaylist,
    getPlaylistIdsContainingSong,
    getPlaylists,
    updatePlaylist,
} from '../../services/playlists.service';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import { unlikeSong } from '../../services/users.service';
import { usePlayerStore } from '../../store/playerStore';
import type { Artist, Playlist, Song } from '../../types';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';
import { LibrarySongItem } from './library/LibrarySongItem';
import { useLikedSongs } from './library/useLikedSongs';

const PLAYLIST_PREVIEW_LIMIT = 3;
const LIKED_PREVIEW_LIMIT = 3;
const ARTIST_PREVIEW_LIMIT = 6;
const FALLBACK_THUMBNAIL =
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';

const LibraryTabComponent = () => {
    const navigation = useNavigation<any>();
    const playSong = usePlayerStore((state) => state.playSong);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const updateSongById = usePlayerStore((state) => state.updateSongById);

    const {
        songs,
        error: likedError,
        loading: likedLoading,
        refresh: refreshLikedSongs,
        removeSong,
        updateSong,
    } = useLikedSongs(LIKED_PREVIEW_LIMIT);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
    const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);
    const [createPlaylistLoading, setCreatePlaylistLoading] = useState(false);
    const [optionsPlaylist, setOptionsPlaylist] = useState<Playlist | null>(null);
    const [renamingPlaylist, setRenamingPlaylist] = useState<Playlist | null>(null);
    const [deleteCandidate, setDeleteCandidate] = useState<Playlist | null>(null);
    const [renameLoading, setRenameLoading] = useState(false);
    const [deletingPlaylistId, setDeletingPlaylistId] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');

    const loadLibrary = useCallback(async () => {
        setLibraryLoading(true);
        setLibraryError(null);

        try {
            const [userPlaylists, artists] = await Promise.all([
                getPlaylists(),
                getFollowedArtists(),
            ]);

            setPlaylists(userPlaylists);
            setFollowedArtists(artists);
        } catch {
            setPlaylists([]);
            setFollowedArtists([]);
            setLibraryError('Could not load your library.');
        } finally {
            setLibraryLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadLibrary();
            void refreshLikedSongs();
        }, [loadLibrary, refreshLikedSongs])
    );

    useEffect(
        () =>
            subscribeSongPatches((_songId, patch) => {
                if (patch.isInPlaylist !== undefined) {
                    void loadLibrary();
                }
            }),
        [loadLibrary]
    );

    useEffect(
        () =>
            subscribeFollowedArtists((artists) => {
                setFollowedArtists(artists);
            }),
        []
    );

    const showInfo = (title: string, description: string) => {
        setInfoTitle(title);
        setInfoDescription(description);
        setInfoVisible(true);
    };

    const refreshLibrary = useCallback(() => {
        void loadLibrary();
        void refreshLikedSongs();
    }, [loadLibrary, refreshLikedSongs]);

    const handleRemoveLiked = async (song: Song) => {
        const previousLiked = Boolean(song.isLiked);

        removeSong(song.id);
        updateSongById(song.id, { isLiked: false });
        publishSongPatch(song.id, { isLiked: false });

        try {
            await unlikeSong(song.id);
        } catch {
            if (previousLiked) {
                updateSongById(song.id, { isLiked: true });
                publishSongPatch(song.id, { isLiked: true });
                void refreshLikedSongs();
            }
            showInfo('Error', 'Could not remove this song from liked songs.');
        }
    };

    const handleCreatePlaylist = async (name: string) => {
        if (!name.trim()) {
            return;
        }

        setCreatePlaylistLoading(true);

        try {
            const playlist = await createPlaylist(name.trim());
            setPlaylists((current) => [playlist, ...current]);
            setCreatePlaylistVisible(false);
        } catch {
            showInfo('Error', 'Could not create playlist.');
        } finally {
            setCreatePlaylistLoading(false);
        }
    };

    const handleRenamePlaylist = async (name: string) => {
        const playlist = renamingPlaylist;

        if (!playlist || !name.trim()) {
            return;
        }

        const previousPlaylists = playlists;
        const nextName = name.trim();

        setRenameLoading(true);
        setPlaylists((current) =>
            current.map((item) =>
                item.id === playlist.id ? { ...item, name: nextName } : item
            )
        );

        try {
            const updatedPlaylist = await updatePlaylist(playlist.id, nextName);
            setPlaylists((current) =>
                current.map((item) =>
                    item.id === playlist.id ? { ...item, ...updatedPlaylist } : item
                )
            );
            setRenamingPlaylist(null);
        } catch {
            setPlaylists(previousPlaylists);
            showInfo('Error', 'Could not rename this playlist.');
        } finally {
            setRenameLoading(false);
        }
    };

    const handleDeletePlaylist = async (playlist: Playlist) => {
        const previousPlaylists = playlists;
        const affectedSongs = playlist.songs ?? [];

        setDeletingPlaylistId(playlist.id);
        setPlaylists((current) => current.filter((item) => item.id !== playlist.id));

        try {
            await deletePlaylist(playlist.id);
            await Promise.all(
                affectedSongs.map(async (song) => {
                    const stillInPlaylist =
                        (await getPlaylistIdsContainingSong(song.id)).length > 0;
                    publishSongPatch(song.id, { isInPlaylist: stillInPlaylist });
                })
            );
        } catch {
            setPlaylists(previousPlaylists);
            showInfo('Error', 'Could not delete this playlist.');
        } finally {
            setDeletingPlaylistId(null);
        }
    };

    const previewPlaylists = playlists.slice(0, PLAYLIST_PREVIEW_LIMIT);
    const previewLikedSongs = songs.slice(0, LIKED_PREVIEW_LIMIT);
    const previewArtists = followedArtists.slice(0, ARTIST_PREVIEW_LIMIT);
    const isRefreshing = libraryLoading || likedLoading;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    tintColor="#FF4D6D"
                    onRefresh={refreshLibrary}
                />
            }
        >
            <Text style={styles.pageTitle}>Library</Text>
            {libraryError ? <Text style={styles.stateText}>{libraryError}</Text> : null}

            <View style={styles.section}>
                <SectionHeader
                    title="Your Playlists"
                    hideViewAll={playlists.length <= PLAYLIST_PREVIEW_LIMIT}
                    onSeeAllPress={() => navigation.navigate('Playlists')}
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.createPlaylistButton,
                        pressed && styles.createPlaylistButtonPressed,
                    ]}
                    onPress={() => setCreatePlaylistVisible(true)}
                >
                    <View style={styles.createPlaylistIcon}>
                        <MaterialIcons name="add" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.createPlaylistText}>Create new playlist</Text>
                </Pressable>
                {libraryLoading && playlists.length === 0 ? (
                    <ActivityIndicator size="small" color="#FF4D6D" />
                ) : previewPlaylists.length > 0 ? (
                    <View style={styles.playlistList}>
                        {previewPlaylists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                name={playlist.name}
                                songCount={playlist.songCount ?? playlist.songs?.length ?? 0}
                                thumbnail={
                                    playlist.thumbnail ||
                                    playlist.songs?.[0]?.image ||
                                    FALLBACK_THUMBNAIL
                                }
                                onPress={() =>
                                    navigation.navigate('PlaylistDetail', {
                                        playlistId: playlist.id,
                                        playlistName: playlist.name,
                                    })
                                }
                                onOptionsPress={() => setOptionsPlaylist(playlist)}
                            />
                        ))}
                    </View>
                ) : (
                    <Text style={styles.stateText}>No playlists yet.</Text>
                )}
            </View>

            <View style={styles.section}>
                <SectionHeader
                    title="Liked Songs"
                    hideViewAll={songs.length <= LIKED_PREVIEW_LIMIT}
                    onSeeAllPress={() =>
                        navigation.navigate('SongList', {
                            title: 'Liked Songs',
                            sourceType: 'liked',
                        })
                    }
                />
                {likedLoading && songs.length === 0 ? (
                    <ActivityIndicator size="small" color="#FF4D6D" />
                ) : songs.length > 0 ? (
                    previewLikedSongs.map((song) => (
                        <LibrarySongItem
                            key={song.id}
                            song={song}
                            isPlaying={currentSong?.id === song.id && isPlaying}
                            onPress={(selectedSong) => {
                                void playSong(selectedSong, songs);
                                navigation.navigate('Player', { songId: selectedSong.id });
                            }}
                            onToggleLike={(selectedSong) => {
                                void handleRemoveLiked(selectedSong);
                            }}
                            onAddToPlaylist={setPlaylistSong}
                        />
                    ))
                ) : (
                    <Text style={styles.stateText}>
                        {likedError ?? 'No liked songs yet.'}
                    </Text>
                )}
            </View>

            <View style={styles.section}>
                <SectionHeader
                    title="Followed Artists"
                    hideViewAll={followedArtists.length === 0}
                    onSeeAllPress={() => navigation.navigate('FollowedArtists')}
                />
                {previewArtists.length > 0 ? (
                    <HorizontalList
                        data={previewArtists}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ArtistCard
                                item={item}
                                onPress={() =>
                                    navigation.navigate('ArtistDetail', { artistId: item.id })
                                }
                            />
                        )}
                    />
                ) : (
                    <Text style={styles.stateText}>No followed artists yet.</Text>
                )}
            </View>

            <AddToPlaylistModal
                visible={Boolean(playlistSong)}
                song={playlistSong}
                onClose={() => setPlaylistSong(null)}
                onAdded={(song) => {
                    updateSong(song.id, { isInPlaylist: true });
                    updateSongById(song.id, { isInPlaylist: true });
                    publishSongPatch(song.id, { isInPlaylist: true });
                }}
                onRemoved={(song) => {
                    updateSong(song.id, { isInPlaylist: false });
                    updateSongById(song.id, { isInPlaylist: false });
                    publishSongPatch(song.id, { isInPlaylist: false });
                }}
                onError={(message) => Alert.alert('Error', message)}
            />
            <PlaylistNameModal
                visible={createPlaylistVisible}
                loading={createPlaylistLoading}
                title="Create playlist"
                description="Enter a name for your new playlist."
                confirmText="Create"
                onCancel={() => setCreatePlaylistVisible(false)}
                onConfirm={handleCreatePlaylist}
            />
            <PlaylistOptionsModal
                visible={Boolean(optionsPlaylist)}
                playlist={optionsPlaylist}
                onClose={() => setOptionsPlaylist(null)}
                onRename={(playlist) => setRenamingPlaylist(playlist)}
                onDelete={(playlist) => setDeleteCandidate(playlist)}
            />
            <PlaylistNameModal
                visible={Boolean(renamingPlaylist)}
                loading={renameLoading}
                initialName={renamingPlaylist?.name ?? ''}
                title="Rename playlist"
                description="Enter a new name for this playlist."
                confirmText="Save"
                onCancel={() => setRenamingPlaylist(null)}
                onConfirm={handleRenamePlaylist}
            />
            <AppModal
                visible={Boolean(deleteCandidate)}
                title="Delete playlist?"
                description={
                    deleteCandidate
                        ? `"${deleteCandidate.name}" will be removed. Songs will stay in your library.`
                        : undefined
                }
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={Boolean(deleteCandidate && deletingPlaylistId === deleteCandidate.id)}
                onCancel={() => setDeleteCandidate(null)}
                onConfirm={() => {
                    if (deleteCandidate) {
                        void handleDeletePlaylist(deleteCandidate);
                        setDeleteCandidate(null);
                    }
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
        </ScrollView>
    );
};

export const LibraryTab = memo(LibraryTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 120,
        paddingHorizontal: 4,
    },
    pageTitle: {
        color: '#FFFFFF',
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 24,
        marginTop: 12,
        textAlign: 'center',
    },
    section: {
        marginTop: 24,
    },
    createPlaylistButton: {
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 77, 109, 0.16)',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.34)',
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    createPlaylistButtonPressed: {
        opacity: 0.78,
    },
    createPlaylistIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        marginRight: 10,
    },
    createPlaylistText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    playlistList: {
        gap: 10,
    },
    stateText: {
        color: '#AEB8D8',
        fontSize: 13,
        paddingVertical: 8,
    },
});
