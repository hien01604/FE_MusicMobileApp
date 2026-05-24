import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Playlist, Song } from '../../types';
import {
    addSongToPlaylist,
    createPlaylist,
    getPlaylistById,
    getPlaylists,
    removeSongFromPlaylist,
} from '../../services/playlists.service';
import PlaylistNameModal from './PlaylistNameModal';

type Props = {
    visible: boolean;
    song: Song | null;
    onClose: () => void;
    onAdded?: (song: Song, playlist: Playlist) => void;
    onRemoved?: (song: Song, playlist: Playlist) => void;
    onError?: (message: string) => void;
};

export default function AddToPlaylistModal({
    visible,
    song,
    onClose,
    onAdded,
    onRemoved,
    onError,
}: Props) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [creating, setCreating] = useState(false);
    const [songPlaylistIds, setSongPlaylistIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!visible) {
            return;
        }

        let cancelled = false;
        setLoading(true);
        setSongPlaylistIds(new Set());

        getPlaylists()
            .then(async (result) => {
                const detailedPlaylists = await Promise.all(
                    result.map(async (playlist) => {
                        if (playlist.songs) {
                            return playlist;
                        }

                        try {
                            return await getPlaylistById(playlist.id);
                        } catch {
                            return playlist;
                        }
                    })
                );

                if (!cancelled) {
                    setPlaylists(detailedPlaylists);

                    if (song) {
                        setSongPlaylistIds(
                            new Set(
                                detailedPlaylists
                                    .filter((playlist) =>
                                        playlist.songs?.some((item) => item.id === song.id)
                                    )
                                    .map((playlist) => playlist.id)
                            )
                        );
                    }
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPlaylists([]);
                    onError?.('Could not load playlists.');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [song, visible]);

    const togglePlaylist = async (playlist: Playlist) => {
        if (!song || addingPlaylistId || creating) {
            return;
        }

        if (songPlaylistIds.has(playlist.id)) {
            await removeFromPlaylist(playlist);
            return;
        }

        setAddingPlaylistId(playlist.id);

        try {
            await addSongToPlaylist(playlist.id, song.id);
            setSongPlaylistIds((current) => new Set([...current, playlist.id]));
            setPlaylists((current) =>
                current.map((item) =>
                    item.id === playlist.id
                        ? {
                              ...item,
                              songCount: (item.songCount ?? item.songs?.length ?? 0) + 1,
                              songs: item.songs ? [...item.songs, song] : [song],
                              thumbnail: item.thumbnail ?? song.image,
                          }
                        : item
                )
            );
            onAdded?.(song, {
                ...playlist,
                songCount: (playlist.songCount ?? playlist.songs?.length ?? 0) + 1,
                songs: playlist.songs ? [...playlist.songs, song] : [song],
                thumbnail: playlist.thumbnail ?? song.image,
            });
        } catch {
            onError?.('Could not add this song to playlist.');
        } finally {
            setAddingPlaylistId(null);
        }
    };

    const removeFromPlaylist = async (playlist: Playlist) => {
        if (!song || addingPlaylistId || creating) {
            return;
        }

        setAddingPlaylistId(playlist.id);
        const previousPlaylists = playlists;
        const previousPlaylistIds = songPlaylistIds;
        const nextPlaylistIds = new Set(songPlaylistIds);
        nextPlaylistIds.delete(playlist.id);

        setSongPlaylistIds(nextPlaylistIds);
        setPlaylists((current) =>
            current.map((item) =>
                item.id === playlist.id
                    ? {
                          ...item,
                          songs: item.songs?.filter((playlistSong) => playlistSong.id !== song.id),
                          songCount: Math.max(0, (item.songCount ?? item.songs?.length ?? 1) - 1),
                      }
                    : item
            )
        );
        if (nextPlaylistIds.size > 0) {
            const remainingPlaylist =
                playlists.find((item) => nextPlaylistIds.has(item.id)) ?? playlist;
            onAdded?.(song, remainingPlaylist);
        } else {
            onRemoved?.(song, playlist);
        }

        try {
            await removeSongFromPlaylist(playlist.id, song.id);
        } catch {
            setSongPlaylistIds(previousPlaylistIds);
            setPlaylists(previousPlaylists);
            onAdded?.(song, playlist);
            onError?.('Could not remove this song from playlist.');
        } finally {
            setAddingPlaylistId(null);
        }
    };

    const handleCreatePlaylist = async (name: string) => {
        if (!song || !name) {
            return;
        }

        setCreating(true);

        try {
            const playlist = await createPlaylist(name);
            await addSongToPlaylist(playlist.id, song.id);
            const playlistWithSong = {
                ...playlist,
                songCount: 1,
                songs: [song],
                thumbnail: playlist.thumbnail ?? song.image,
            };
            setPlaylists((current) => [playlistWithSong, ...current]);
            setSongPlaylistIds((current) => new Set([...current, playlist.id]));
            setCreateVisible(false);
            onAdded?.(song, playlistWithSong);
        } catch {
            onError?.('Could not create playlist.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Pressable style={styles.sheet} onPress={() => undefined}>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {songPlaylistIds.size > 0 ? 'Manage playlist' : 'Add to playlist'}
                            </Text>
                            <Pressable style={styles.closeButton} onPress={onClose}>
                                <MaterialIcons name="close" size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.createButton,
                                pressed && styles.itemPressed,
                            ]}
                            onPress={() => setCreateVisible(true)}
                        >
                            <View style={styles.createIcon}>
                                <MaterialIcons name="add" size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.createText}>Create new playlist</Text>
                        </Pressable>

                        {loading ? (
                            <View style={styles.stateContainer}>
                                <ActivityIndicator size="small" color="#FF4D6D" />
                            </View>
                        ) : (
                            <FlatList
                                data={playlists}
                                keyExtractor={(item) => item.id}
                                style={styles.list}
                                contentContainerStyle={styles.listContent}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>No playlists yet.</Text>
                                }
                                renderItem={({ item }) => {
                                    const adding = addingPlaylistId === item.id;
                                    const alreadyAdded = songPlaylistIds.has(item.id);

                                    return (
                                        <Pressable
                                            disabled={Boolean(addingPlaylistId)}
                                            style={({ pressed }) => [
                                                styles.playlistItem,
                                                alreadyAdded && styles.playlistItemAdded,
                                                pressed && styles.itemPressed,
                                            ]}
                                            onPress={() => {
                                                void togglePlaylist(item);
                                            }}
                                        >
                                            <View style={styles.playlistIcon}>
                                                <MaterialIcons
                                                    name="queue-music"
                                                    size={20}
                                                    color="#FFB85C"
                                                />
                                            </View>
                                            <View style={styles.playlistTextBlock}>
                                                <Text style={styles.playlistName} numberOfLines={1}>
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.playlistMeta}>
                                                    {item.songCount ?? item.songs?.length ?? 0} songs
                                                </Text>
                                            </View>
                                            {adding ? (
                                                <ActivityIndicator size="small" color="#FF4D6D" />
                                            ) : alreadyAdded ? (
                                                <View style={styles.addedBadge}>
                                                    <MaterialIcons
                                                        name="check"
                                                        size={14}
                                                        color="#FFFFFF"
                                                    />
                                                    <Text style={styles.addedText}>Added</Text>
                                                </View>
                                            ) : (
                                                <MaterialIcons
                                                    name="chevron-right"
                                                    size={20}
                                                    color="rgba(255,255,255,0.55)"
                                                />
                                            )}
                                        </Pressable>
                                    );
                                }}
                            />
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            <PlaylistNameModal
                visible={createVisible}
                loading={creating}
                onCancel={() => setCreateVisible(false)}
                onConfirm={handleCreatePlaylist}
            />
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 18,
        paddingBottom: 28,
        backgroundColor: 'rgba(4, 7, 24, 0.45)',
    },
    sheet: {
        maxHeight: '72%',
        borderRadius: 16,
        backgroundColor: '#151A35',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButton: {
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
    createIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        marginRight: 10,
    },
    createText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    stateContainer: {
        paddingVertical: 22,
    },
    list: {
        flexGrow: 0,
    },
    listContent: {
        paddingBottom: 4,
    },
    emptyText: {
        color: '#AEB8D8',
        paddingVertical: 16,
        textAlign: 'center',
    },
    playlistItem: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    playlistItemAdded: {
        borderWidth: 1,
        borderColor: 'rgba(124, 247, 176, 0.45)',
        backgroundColor: 'rgba(124, 247, 176, 0.08)',
    },
    itemPressed: {
        opacity: 0.78,
    },
    playlistIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 184, 92, 0.12)',
        marginRight: 10,
    },
    playlistTextBlock: {
        flex: 1,
    },
    playlistName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    playlistMeta: {
        color: '#AEB8D8',
        fontSize: 12,
        marginTop: 3,
    },
    addedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: 'rgba(124, 247, 176, 0.24)',
    },
    addedText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
});
