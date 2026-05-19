import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { artists, songs } from '../../data/mockData';
import {
    listeningHistory,
    newReleases,
    quickActions,
    trendingSongs as mockTrendingSongs,
} from '../../data/homeData';
import { Artist, Category, Song } from '../../types';
import { CategoryCard } from '../../components/Music/CategoryCard';
import { SectionHeader } from '../../components/Music/SectionHeader';
import HorizontalList from '../../components/Music/HorizontalList';
import { SongCard } from '../../components/Music/SongCard';
import ArtistCard from '../../components/Music/ArtistCard';
import { usePlayerStore } from '../../store/playerStore';
import type { RootStackParamList } from '../../navigation/type';
import { getNewSongs } from '../../services/song.service';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

type HomeTabProps = {
    onOpenSongList?: (
        title: string,
        type: 'all' | 'new' | 'trending' | 'continueListening' | 'recommended'
    ) => void;
};

const HOME_PREVIEW_LIMIT = 6;

export const HomeTab = ({ onOpenSongList }: HomeTabProps) => {
    const navigation = useNavigation<HomeNavigation>();
    const playSong = usePlayerStore((state) => state.playSong);
    const hasHistory = listeningHistory.length > 0;
    const [latestSongs, setLatestSongs] = useState<Song[]>(newReleases);
    const [isLoadingLatestSongs, setIsLoadingLatestSongs] = useState(false);
    const [latestSongsError, setLatestSongsError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadLatestSongs = async () => {
            setIsLoadingLatestSongs(true);
            setLatestSongsError(null);

            try {
                const result = await getNewSongs();
                if (isMounted) {
                    setLatestSongs(result);
                }
            } catch {
                if (isMounted) {
                    setLatestSongsError('Could not load new songs.');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingLatestSongs(false);
                }
            }
        };

        void loadLatestSongs();

        return () => {
            isMounted = false;
        };
    }, []);

    const continueListening = useMemo<Song[]>(
        () =>
            listeningHistory.filter((item) => item.progress < 0.7)
                .sort(
                    (a, b) =>
                        new Date(b.lastListenedAt).getTime() -
                        new Date(a.lastListenedAt).getTime()
                )
                .map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    image: item.image,
                })),
        []
    );

    const recommendedSongs = useMemo<Song[]>(() => {
        if (!hasHistory) {
            return [];
        }

        const preferredArtists = new Set(
            listeningHistory.map((item) => item.artist.toLowerCase())
        );
        const preferredGenres = new Set(
            listeningHistory.map((item) => item.genre.toLowerCase())
        );
        const preferredMoods = new Set(
            listeningHistory.map((item) => item.mood.toLowerCase())
        );

        const artistHintBySongId: Record<string, string> = {
            'new-2': 'Electronic',
            'new-3': 'Chill',
            'new-5': 'Focus',
        };

        const allCandidates = [...latestSongs, ...songs].filter(
            (song, index, array) =>
                array.findIndex((candidate) => candidate.id === song.id) === index
        );

        return allCandidates
            .map((song) => {
                let score = 0;
                const artist = song.artist.toLowerCase();
                const behaviorHint = (artistHintBySongId[song.id] || '').toLowerCase();

                if (preferredArtists.has(artist)) {
                    score += 3;
                }

                if (preferredGenres.has(behaviorHint)) {
                    score += 2;
                }

                if (preferredMoods.has(behaviorHint)) {
                    score += 2;
                }

                return { song, score };
            })
            .sort((a, b) => b.score - a.score)
            .map((entry) => entry.song);
    }, [hasHistory, latestSongs]);

    const previewContinueListening = useMemo(
        () => continueListening.slice(0, HOME_PREVIEW_LIMIT),
        [continueListening]
    );

    const previewRecommendedSongs = useMemo(
        () => recommendedSongs.slice(0, HOME_PREVIEW_LIMIT),
        [recommendedSongs]
    );

    const previewNewReleases = useMemo(
        () => latestSongs.slice(0, HOME_PREVIEW_LIMIT),
        [latestSongs]
    );

    const previewTrendingSongs = useMemo(
        () => (latestSongs.length > 0 ? latestSongs : mockTrendingSongs).slice(0, HOME_PREVIEW_LIMIT),
        [latestSongs]
    );

    const previewPopularArtists = useMemo(
        () => artists.slice(0, HOME_PREVIEW_LIMIT),
        []
    );

    const openSongList = useCallback(
        (
            title: string,
            type: 'all' | 'new' | 'trending' | 'continueListening' | 'recommended'
        ) => {
            if (onOpenSongList) {
                onOpenSongList(title, type);
                return;
            }

            navigation.navigate('SongList', {
                title,
                type,
            });
        },
        [navigation, onOpenSongList]
    );

    const onSeeAll = useCallback(
        (section: string, totalItems: number) => {
            if (section === 'Quick Actions') {
                openSongList(section, 'all');
                return;
            }

            if (section === 'Continue Listening') {
                openSongList(section, 'continueListening');
                return;
            }

            if (section === 'Recommended For You') {
                openSongList(section, 'recommended');
                return;
            }

            if (section === 'New Releases') {
                openSongList(section, 'new');
                return;
            }

            if (section === 'Trending') {
                openSongList(section, 'trending');
                return;
            }

            if (section === 'Popular Artists') {
                openSongList(section, 'all');
                return;
            }

            Alert.alert('See all', 'Open ' + section + ' (' + totalItems + ' items)');
        },
        [openSongList]
    );

    const onPlaySong = useCallback((song: Song) => {
        void playSong(song);
        navigation.navigate('Player');
    }, [navigation, playSong]);

    const onOpenArtist = useCallback((artist: Artist) => {
        Alert.alert('Artist', 'Open ' + artist.name);
    }, []);

    const onQuickActionPress = useCallback((action: Category) => {
        Alert.alert('Quick action', 'Open ' + action.title);
    }, []);

    const renderSongCard = useCallback(
        ({ item }: { item: Song }) => (
            <SongCard item={item} onPress={() => onPlaySong(item)} />
        ),
        [onPlaySong]
    );

    const renderArtistCard = useCallback(
        ({ item }: { item: Artist }) => (
            <ArtistCard item={item} onPress={() => onOpenArtist(item)} />
        ),
        [onOpenArtist]
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentBottom}
        >
            <View style={styles.section}>
                <SectionHeader
                    title="Quick Actions"
                    onSeeAllPress={() => onSeeAll('Quick Actions', quickActions.length)}
                />
                <View style={styles.grid}>
                    {quickActions.map((item) => (
                        <CategoryCard
                            key={item.id}
                            title={item.title}
                            icon={item.icon}
                            onPress={() => onQuickActionPress(item)}
                        />
                    ))}
                </View>
            </View>

            {previewContinueListening.length > 0 && (
                <View style={styles.section}>
                    <SectionHeader
                        title="Continue Listening"
                        onSeeAllPress={() =>
                            onSeeAll('Continue Listening', continueListening.length)
                        }
                    />
                    <HorizontalList
                        data={previewContinueListening}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSongCard}
                    />
                </View>
            )}

            {hasHistory && (
                <View style={styles.section}>
                    <SectionHeader
                        title="Recommended For You"
                        onSeeAllPress={() =>
                            onSeeAll('Recommended For You', recommendedSongs.length)
                        }
                    />
                    <HorizontalList
                        data={previewRecommendedSongs}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSongCard}
                    />
                </View>
            )}

            <View style={styles.section}>
                <SectionHeader
                    title="New Releases"
                    onSeeAllPress={() => onSeeAll('New Releases', latestSongs.length)}
                />
                {isLoadingLatestSongs ? (
                    <ActivityIndicator size="small" color="#FF4D6D" />
                ) : latestSongsError ? (
                    <Text style={styles.stateText}>{latestSongsError}</Text>
                ) : previewNewReleases.length > 0 ? (
                    <HorizontalList
                        data={previewNewReleases}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSongCard}
                    />
                ) : (
                    <Text style={styles.stateText}>No new songs found.</Text>
                )}
            </View>

            {!hasHistory && (
                <View style={styles.section}>
                    <SectionHeader
                        title="Trending"
                        onSeeAllPress={() => onSeeAll('Trending', latestSongs.length)}
                    />
                    <HorizontalList
                        data={previewTrendingSongs}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSongCard}
                    />
                </View>
            )}

            <View style={styles.section}>
                <SectionHeader
                    title="Popular Artists"
                    onSeeAllPress={() => onSeeAll('Popular Artists', artists.length)}
                />
                <HorizontalList
                    data={previewPopularArtists}
                    keyExtractor={(item) => item.id}
                    renderItem={renderArtistCard}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentBottom: {
        paddingBottom: 120,
        paddingHorizontal: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    section: {
        marginTop: 24,
    },
    stateText: {
        color: '#AEB8D8',
        fontSize: 13,
        paddingVertical: 8,
    },
});
