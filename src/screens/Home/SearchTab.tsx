import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArtistCard from '../../components/Music/ArtistCard';
import HorizontalList from '../../components/Music/HorizontalList';
import SongOptionsModal from '../../components/Music/SongOptionsModal';
import { SongListItem } from '../../components/Music/SongListItem';
import SearchBar from '../../components/common/SearchBar';
import { mapSongDtoToSong } from '../../services/song.service';
import { searchMusic } from '../../services/search.service';
import { usePlayerStore } from '../../store/playerStore';
import type { Artist, Song } from '../../types';
import type { RootStackParamList } from '../../navigation/type';

type SearchNavigation = NativeStackNavigationProp<RootStackParamList>;

const SearchTabComponent = () => {
    const navigation = useNavigation<SearchNavigation>();
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const playSong = usePlayerStore((state) => state.playSong);
    const trimmedQuery = query.trim();

    useEffect(() => {
        if (!trimmedQuery) {
            setSongs([]);
            setArtists([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        let isCancelled = false;
        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(() => {
            searchMusic(trimmedQuery, 20)
                .then((result) => {
                    if (!isCancelled) {
                        setSongs(result.songs.map(mapSongDtoToSong));
                        setArtists(result.artists);
                    }
                })
                .catch(() => {
                    if (!isCancelled) {
                        setSongs([]);
                        setArtists([]);
                        setError('Could not load search results. Please try again.');
                    }
                })
                .finally(() => {
                    if (!isCancelled) {
                        setIsLoading(false);
                    }
                });
        }, 400);

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [trimmedQuery]);

    const handleSongPress = useCallback((song: Song) => {
        void playSong(song);
        navigation.navigate('Player', { songId: song.id });
    }, [navigation, playSong]);

    const handleArtistPress = useCallback((artist: Artist) => {
        navigation.navigate('ArtistDetail', { artistId: artist.id });
    }, [navigation]);

    const renderEmptyState = () => {
        if (isLoading) {
            return (
                <View style={styles.stateContainer}>
                    <ActivityIndicator size="small" color="#FF4D6D" />
                </View>
            );
        }

        if (error) {
            return <Text style={styles.emptyState}>{error}</Text>;
        }

        if (!trimmedQuery) {
            return <Text style={styles.emptyState}>Search for a song to get started.</Text>;
        }

        if (artists.length > 0) {
            return null;
        }

        return <Text style={styles.emptyState}>No results found.</Text>;
    };

    const renderHeader = () => {
        return (
            <View>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search songs, artists, playlists"
                />
                {artists.length > 0 && (
                    <View style={styles.artistSection}>
                        <Text style={styles.sectionTitle}>Artists</Text>
                        <HorizontalList
                            data={artists}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ArtistCard
                                    item={item}
                                    onPress={() => handleArtistPress(item)}
                                />
                            )}
                        />
                    </View>
                )}
                {songs.length > 0 && (
                    <Text style={styles.sectionTitle}>Songs</Text>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            extraData={query}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
                <SongListItem
                    song={item}
                    onPress={handleSongPress}
                    onMenuPress={setSelectedSong}
                />
            )}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={
                <SongOptionsModal
                    visible={Boolean(selectedSong)}
                    song={selectedSong}
                    onClose={() => setSelectedSong(null)}
                    onSuccess={(message) => Alert.alert('Done', message)}
                    onError={(message) => Alert.alert('Error', message)}
                />
            }
        />
    );
};

export const SearchTab = memo(SearchTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    stateContainer: {
        alignItems: 'center',
        paddingVertical: 18,
    },
    emptyState: {
        color: '#AEB8D8',
        textAlign: 'center',
        marginTop: 12,
    },
    artistSection: {
        marginTop: 18,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 18,
    },
});
