import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import SongOptionsModal from '../../components/Music/SongOptionsModal';
import { SongListItem } from '../../components/Music/SongListItem';
import {
    getArtistById,
    getArtistTopTracks,
    mapArtistDtoToArtist,
} from '../../services/artists.service';
import { mapSongDtoToSong } from '../../services/song.service';
import { usePlayerStore } from '../../store/playerStore';
import type { RootStackParamList } from '../../navigation/type';
import type { Artist, Song } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtistDetail'>;

export default function ArtistDetailScreen({ route, navigation }: Props) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Song[]>([]);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const playSong = usePlayerStore((state) => state.playSong);
    const { artistId } = route.params;

    useEffect(() => {
        let mounted = true;

        const loadArtist = async () => {
            setLoading(true);
            setError(null);

            try {
                const [artistDetail, tracks] = await Promise.all([
                    getArtistById(artistId),
                    getArtistTopTracks(artistId, 20),
                ]);

                if (mounted) {
                    setArtist(mapArtistDtoToArtist(artistDetail));
                    setTopTracks(tracks.map(mapSongDtoToSong));
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
        void playSong(song);
        navigation.navigate('Player', { songId: song.id });
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
                        ListHeaderComponent={
                            <View>
                                {artist && (
                                    <View style={styles.artistSummary}>
                                        <Image
                                            source={{ uri: artist.image }}
                                            style={styles.artistImage}
                                        />
                                        <Text style={styles.artistName}>{artist.name}</Text>
                                        {artist.bio ? (
                                            <Text style={styles.artistBio}>{artist.bio}</Text>
                                        ) : null}
                                    </View>
                                )}
                                <Text style={styles.sectionTitle}>Top Tracks</Text>
                            </View>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No top tracks found.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <SongListItem
                                song={item}
                                onPress={handleSongPress}
                                onMenuPress={setSelectedSong}
                            />
                        )}
                    />
                )}

                <SongOptionsModal
                    visible={Boolean(selectedSong)}
                    song={selectedSong}
                    onClose={() => setSelectedSong(null)}
                    onSuccess={(message) => Alert.alert('Done', message)}
                    onError={(message) => Alert.alert('Error', message)}
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
        paddingHorizontal: 18,
    },
    errorText: {
        color: '#FF7B95',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 28,
    },
    artistSummary: {
        alignItems: 'center',
        marginBottom: 24,
    },
    artistImage: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 70,
        height: 140,
        width: 140,
    },
    artistName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 14,
        textAlign: 'center',
    },
    artistBio: {
        color: '#AEB8D8',
        lineHeight: 20,
        marginTop: 8,
        textAlign: 'center',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 36,
    },
    emptyText: {
        color: '#AEB8D8',
    },
});
