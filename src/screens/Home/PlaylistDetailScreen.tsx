import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import PlaylistNameModal from '../../components/common/PlaylistNameModal';
import PlaylistOptionsModal from '../../components/common/PlaylistOptionsModal';
import AppModal from '../../components/common/AppModal';
import { SongListItem } from '../../components/Music/SongListItem';
import {
    deletePlaylist,
    getPlaylistById,
    getPlaylistIdsContainingSong,
    removeSongFromPlaylist,
    updatePlaylist,
} from '../../services/playlists.service';
import { usePlayerStore } from '../../store/playerStore';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import { applyLikedStatus } from '../../services/song.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import type { Playlist, Song } from '../../types';
import type { RootStackParamList } from '../../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaylistDetail'>;

export default function PlaylistDetailScreen({ navigation, route }: Props) {
    const { playlistId, playlistName } = route.params;
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [renameVisible, setRenameVisible] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [removeConfirmVisible, setRemoveConfirmVisible] = useState(false);
    const [removeCandidate, setRemoveCandidate] = useState<Song | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const [renameLoading, setRenameLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const playSong = usePlayerStore((state) => state.playSong);
    const updateSongById = usePlayerStore((state) => state.updateSongById);

    const loadPlaylist = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const detail = await getPlaylistById(playlistId);
            const songs = await applyLikedStatus(
                (detail.songs ?? []).map((song) => ({ ...song, isInPlaylist: true }))
            );
            setPlaylist({ ...detail, songs });
        } catch (loadError) {
            setPlaylist(null);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : 'Could not load playlist.'
            );
        } finally {
            setLoading(false);
        }
    }, [playlistId]);

    useEffect(() => {
        void loadPlaylist();
    }, [loadPlaylist]);

    const applySongState = useCallback((songId: string, patch: Partial<Song>) => {
        setPlaylist((current) =>
            current
                ? {
                    ...current,
                    songs: current.songs?.map((song) =>
                        song.id === songId ? { ...song, ...patch } : song
                    ),
                }
                : current
        );
        updateSongById(songId, patch);
    }, [updateSongById]);

    useEffect(() => subscribeSongPatches(applySongState), [applySongState]);

    const songs = playlist?.songs ?? [];

    const handleSongPress = (song: Song) => {
        void playSong(song, songs);
        navigation.navigate('Player', { songId: song.id });
    };

    const removeSong = async (song: Song) => {
        const previousPlaylist = playlist;

        setPlaylist((current) =>
            current
                ? {
                    ...current,
                    songs: current.songs?.filter((item) => item.id !== song.id) ?? [],
                    songCount: Math.max(0, (current.songCount ?? current.songs?.length ?? 1) - 1),
                }
                : current
        );

        try {
            await removeSongFromPlaylist(playlistId, song.id);
            const stillInPlaylist = (await getPlaylistIdsContainingSong(song.id)).length > 0;
            updateSongById(song.id, { isInPlaylist: stillInPlaylist });
            publishSongPatch(song.id, { isInPlaylist: stillInPlaylist });
        } catch {
            setPlaylist(previousPlaylist);
            setInfoTitle('Error');
            setInfoDescription('Could not remove this song from the playlist.');
            setInfoVisible(true);
        }
    };

    const confirmRemoveSong = (song: Song) => {
        setRemoveCandidate(song);
        setRemoveConfirmVisible(true);
    };

    const handleToggleLike = async (song: Song) => {
        const nextLiked = !song.isLiked;
        applySongState(song.id, { isLiked: nextLiked });
        publishSongPatch(song.id, { isLiked: nextLiked });

        try {
            if (nextLiked) {
                await likeSong({ songId: song.id });
            } else {
                await unlikeSong(song.id);
            }
        } catch {
            applySongState(song.id, { isLiked: Boolean(song.isLiked) });
            publishSongPatch(song.id, { isLiked: Boolean(song.isLiked) });
            setInfoTitle('Error');
            setInfoDescription('Could not update liked songs.');
            setInfoVisible(true);
        }
    };

    const openPlaylistOptions = () => {
        if (!playlist || deleteLoading) {
            return;
        }

        setOptionsVisible(true);
    };

    const handleRenamePlaylist = async (name: string) => {
        if (!playlist || !name.trim()) {
            return;
        }

        const previousPlaylist = playlist;
        const nextName = name.trim();

        setRenameLoading(true);
        setPlaylist({ ...playlist, name: nextName });

        try {
            const updatedPlaylist = await updatePlaylist(playlist.id, nextName);
            setPlaylist((current) => (current ? { ...current, ...updatedPlaylist } : current));
            setRenameVisible(false);
        } catch {
            setPlaylist(previousPlaylist);
            setInfoTitle('Error');
            setInfoDescription('Could not rename this playlist.');
            setInfoVisible(true);
        } finally {
            setRenameLoading(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!playlist) {
            return;
        }

        const songsBeforeDelete = playlist.songs ?? [];
        setDeleteLoading(true);

        try {
            await deletePlaylist(playlist.id);

            await Promise.all(
                songsBeforeDelete.map(async (song) => {
                    const stillInPlaylist =
                        (await getPlaylistIdsContainingSong(song.id)).length > 0;
                    publishSongPatch(song.id, { isInPlaylist: stillInPlaylist });
                })
            );

            navigation.goBack();
        } catch {
            setInfoTitle('Error');
            setInfoDescription('Could not delete this playlist.');
            setInfoVisible(true);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {playlist?.name ?? playlistName ?? 'Playlist'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {songs.length} songs
                        </Text>
                    </View>
                    <Pressable
                        hitSlop={10}
                        style={styles.headerAction}
                        disabled={!playlist || deleteLoading}
                        onPress={openPlaylistOptions}
                    >
                        {deleteLoading ? (
                            <ActivityIndicator size="small" color="#FF4D6D" />
                        ) : (
                            <MaterialIcons name="more-horiz" size={24} color="#FFFFFF" />
                        )}
                    </Pressable>
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
                        data={songs}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        refreshing={loading}
                        onRefresh={() => {
                            void loadPlaylist();
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialIcons
                                    name="queue-music"
                                    size={44}
                                    color="rgba(255,255,255,0.3)"
                                />
                                <Text style={styles.emptyText}>
                                    No songs in this playlist yet.
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <SongListItem
                                song={item}
                                onPress={handleSongPress}
                                onLongPress={confirmRemoveSong}
                                onToggleLike={handleToggleLike}
                                onAddToPlaylist={confirmRemoveSong}
                            />
                        )}
                    />
                )}
                <PlaylistNameModal
                    visible={renameVisible}
                    loading={renameLoading}
                    initialName={playlist?.name ?? ''}
                    title="Rename playlist"
                    description="Enter a new name for this playlist."
                    confirmText="Save"
                    onCancel={() => setRenameVisible(false)}
                    onConfirm={handleRenamePlaylist}
                />
                <PlaylistOptionsModal
                    visible={optionsVisible}
                    playlist={playlist}
                    onClose={() => setOptionsVisible(false)}
                    onRename={() => setRenameVisible(true)}
                    onDelete={() => setDeleteConfirmVisible(true)}
                />
                <AppModal
                    visible={deleteConfirmVisible}
                    title="Delete playlist?"
                    description={
                        playlist
                            ? `"${playlist.name}" will be removed. Songs will stay in your library.`
                            : undefined
                    }
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    loading={deleteLoading}
                    onCancel={() => setDeleteConfirmVisible(false)}
                    onConfirm={() => {
                        setDeleteConfirmVisible(false);
                        void handleDeletePlaylist();
                    }}
                />
                <AppModal
                    visible={removeConfirmVisible}
                    title="Remove song"
                    description={removeCandidate ? `Remove "${removeCandidate.title}" from this playlist?` : undefined}
                    confirmText="Remove"
                    cancelText="Cancel"
                    variant="danger"
                    onCancel={() => {
                        setRemoveConfirmVisible(false);
                        setRemoveCandidate(null);
                    }}
                    onConfirm={() => {
                        if (removeCandidate) {
                            void removeSong(removeCandidate);
                        }
                        setRemoveConfirmVisible(false);
                        setRemoveCandidate(null);
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
    headerTextBlock: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#AEB8D8',
        fontSize: 12,
        marginTop: 4,
    },
    headerAction: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
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
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        color: '#AEB8D8',
        marginTop: 12,
        textAlign: 'center',
    },
});
