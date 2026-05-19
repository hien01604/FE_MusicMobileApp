import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SongListItem } from '../../components/Music/SongListItem';
import SearchBar from '../../components/common/SearchBar';
import { mapSongDtoToSong } from '../../services/song.service';
import { searchSongs } from '../../services/songs.service';
import { usePlayerStore } from '../../store/playerStore';
import type { Song } from '../../types';
import type { RootStackParamList } from '../../navigation/type';

type SearchNavigation = NativeStackNavigationProp<RootStackParamList>;

const SearchTabComponent = () => {
    const navigation = useNavigation<SearchNavigation>();
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const playSong = usePlayerStore((state) => state.playSong);
    const trimmedQuery = query.trim();

    useEffect(() => {
        if (!trimmedQuery) {
            setSongs([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        let isCancelled = false;
        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(() => {
            searchSongs(trimmedQuery, 20)
                .then((result) => {
                    if (!isCancelled) {
                        setSongs(result.map(mapSongDtoToSong));
                    }
                })
                .catch(() => {
                    if (!isCancelled) {
                        setSongs([]);
                        setError('Could not load songs. Please try again.');
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
        navigation.navigate('Player');
    }, [navigation, playSong]);

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

        return <Text style={styles.emptyState}>No songs found.</Text>;
    };

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            extraData={query}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search songs, artists, playlists"
                />
            }
            renderItem={({ item }) => (
                <SongListItem song={item} onPress={handleSongPress} />
            )}
            ListEmptyComponent={renderEmptyState}
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
});
