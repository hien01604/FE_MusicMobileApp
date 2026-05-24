import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppModal from '../../components/common/AppModal';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import PlaylistCard from '../../components/Music/PlaylistCard';
import PlaylistNameModal from '../../components/common/PlaylistNameModal';
import PlaylistOptionsModal from '../../components/common/PlaylistOptionsModal';
import {
    deletePlaylist,
    getPlaylistIdsContainingSong,
    getPlaylists,
    updatePlaylist,
} from '../../services/playlists.service';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import type { Playlist } from '../../types';
import type { RootStackParamList } from '../../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Playlists'>;

const FALLBACK_THUMBNAIL =
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';

export default function PlaylistsScreen({ navigation }: Props) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [optionsPlaylist, setOptionsPlaylist] = useState<Playlist | null>(null);
    const [renamingPlaylist, setRenamingPlaylist] = useState<Playlist | null>(null);
    const [deleteCandidate, setDeleteCandidate] = useState<Playlist | null>(null);
    const [renameLoading, setRenameLoading] = useState(false);
    const [deletingPlaylistId, setDeletingPlaylistId] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');

    const loadPlaylists = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setPlaylists(await getPlaylists());
        } catch {
            setPlaylists([]);
            setError('Could not load playlists.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPlaylists();
    }, [loadPlaylists]);

    useEffect(
        () =>
            subscribeSongPatches((_songId, patch) => {
                if (patch.isInPlaylist !== undefined) {
                    void loadPlaylists();
                }
            }),
        [loadPlaylists]
    );

    const handleRenamePlaylist = async (name: string) => {
        const playlist = renamingPlaylist;
        if (!playlist || !name.trim()) return;

        const previousPlaylists = playlists;
        const nextName = name.trim();

        setRenameLoading(true);
        setPlaylists((current) =>
            current.map((item) => (item.id === playlist.id ? { ...item, name: nextName } : item))
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
            setInfoTitle('Error');
            setInfoDescription('Could not rename this playlist.');
            setInfoVisible(true);
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
            setInfoTitle('Error');
            setInfoDescription('Could not delete this playlist.');
            setInfoVisible(true);
        } finally {
            setDeletingPlaylistId(null);
        }
    };

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Playlists</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {loading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                    </View>
                ) : (
                    <FlatList
                        data={playlists}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshing={loading}
                        onRefresh={() => {
                            void loadPlaylists();
                        }}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                {error ?? 'No playlists yet.'}
                            </Text>
                        }
                        renderItem={({ item }) => (
                            <PlaylistCard
                                name={item.name}
                                songCount={item.songCount ?? item.songs?.length ?? 0}
                                thumbnail={item.thumbnail || item.songs?.[0]?.image || FALLBACK_THUMBNAIL}
                                onPress={() =>
                                    navigation.navigate('PlaylistDetail', {
                                        playlistId: item.id,
                                        playlistName: item.name,
                                    })
                                }
                                onOptionsPress={() => setOptionsPlaylist(item)}
                            />
                        )}
                    />
                )}

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
        fontSize: 22,
        fontWeight: '800',
    },
    headerSpacer: {
        width: 32,
    },
    stateContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    listContent: {
        gap: 10,
        paddingBottom: 120,
    },
    emptyText: {
        color: '#AEB8D8',
        textAlign: 'center',
        paddingVertical: 32,
    },
});
