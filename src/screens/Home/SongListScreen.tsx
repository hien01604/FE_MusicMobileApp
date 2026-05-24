import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppModal from '../../components/common/AppModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import { SongListItem } from '../../components/Music/SongListItem';
import { getSongsBySource } from '../../services/song.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import type { Song, SongListSource } from '../../types';
import type { RootStackParamList } from '../../navigation/type';
import SearchBar from '../../components/common/SearchBar';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';
import { usePlayerStore } from '../../store/playerStore';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';

type SongListScreenProps = NativeStackScreenProps<RootStackParamList, 'SongList'>;
type SongListNavigation = NativeStackNavigationProp<RootStackParamList>;

type SongListViewProps = {
    source: SongListSource;
    onBack?: () => void;
};

export function SongListView({ source, onBack }: SongListViewProps) {
    const [searchText, setSearchText] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const navigation = useNavigation<SongListNavigation>();
    const playSong = usePlayerStore((state) => state.playSong);
    const updateSongById = usePlayerStore((state) => state.updateSongById);

    useEffect(() => {
        let isMounted = true;

        const loadSongs = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getSongsBySource(source);

                if (isMounted) {
                    setSongs(result);
                }
            } catch {
                if (isMounted) {
                    setSongs([]);
                    setError('Could not load songs.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadSongs();

        return () => {
            isMounted = false;
        };
    }, [source]);

    const filteredSongs = useMemo(() => {
        const normalized = searchText.trim().toLowerCase();

        if (!normalized) {
            return songs;
        }

        return songs.filter(
            (song) =>
                song.title.toLowerCase().includes(normalized) ||
                song.artist.toLowerCase().includes(normalized)
        );
    }, [searchText, songs]);

    const handleSongPress = (song: Song) => {
        void playSong(song, filteredSongs);
        navigation.navigate('Player', { songId: song.id });
    };

    const applySongState = (songId: string, patch: Partial<Song>) => {
        setSongs((currentSongs) =>
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

        if (!nextLiked && source.sourceType === 'liked') {
            setSongs((currentSongs) => currentSongs.filter((item) => item.id !== song.id));
        }

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

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <BackButton onBack={onBack ?? (() => navigation.goBack())} />
                    <Text style={styles.headerTitle}>{source.title}</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.headerSection}>
                    <SearchBar
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Search for songs, artists, playlists..."
                    />
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredSongs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <SongListItem
                                song={item}
                                onPress={handleSongPress}
                                onToggleLike={handleToggleLike}
                                onAddToPlaylist={setPlaylistSong}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialIcons
                                    name="music-note"
                                    size={48}
                                    color="rgba(255, 255, 255, 0.3)"
                                />
                                <Text style={styles.emptyText}>{error ?? 'No songs found'}</Text>
                            </View>
                        }
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

export default function SongListScreen({ route, navigation }: SongListScreenProps) {
    return (
        <SongListView source={route.params} onBack={() => navigation.goBack()} />
    );
}

const styles = StyleSheet.create({
    container: {
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
        textAlign: "center",
    },
    headerSpacer: {
        width: 32,
    },
    headerSection: {
        marginBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        marginTop: 12,
    },
});
