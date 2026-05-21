import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Artist, Category, Song, SongListSource } from '../../types';
import { CategoryCard } from '../../components/Music/CategoryCard';
import { SectionHeader } from '../../components/Music/SectionHeader';
import HorizontalList from '../../components/Music/HorizontalList';
import { SongCard } from '../../components/Music/SongCard';
import ArtistCard from '../../components/Music/ArtistCard';
import { usePlayerStore } from '../../store/playerStore';
import type { RootStackParamList } from '../../navigation/type';
import {
    getContinueListeningSongs,
    getNewSongs,
    getRecommendedSongs,
    getTrendingSongs,
} from '../../services/song.service';
import { getPopularArtists } from '../../services/artist.service';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

type HomeTabProps = {
    onOpenSongList?: (source: SongListSource) => void;
};

const HOME_PREVIEW_LIMIT = 6;

type HomeQuickAction = Category & SongListSource;

type HomeSongSection = SongListSource & {
    id: string;
    songs: Song[];
    isLoading?: boolean;
    error?: string | null;
    emptyText?: string;
    hideWhenEmpty?: boolean;
};

const quickActions: HomeQuickAction[] = [
    { id: 'quick-new', title: 'New Songs', icon: 'fiber-new', sourceType: 'new' },
    { id: 'quick-trending', title: 'Trending', icon: 'whatshot', sourceType: 'trending' },
    {
        id: 'quick-liked',
        title: 'Liked Songs',
        icon: 'favorite',
        sourceType: 'liked',
    },
    {
        id: 'quick-daily-mix',
        title: 'Daily Mix',
        icon: 'auto-awesome',
        sourceType: 'recommended',
    },
];

function toSongListSource(source: SongListSource): SongListSource {
    const { title, sourceType, sectionId, query, endpoint } = source;

    return {
        title,
        sourceType,
        ...(sectionId ? { sectionId } : {}),
        ...(query ? { query } : {}),
        ...(endpoint ? { endpoint } : {}),
    };
}

export const HomeTab = ({ onOpenSongList }: HomeTabProps) => {
    const navigation = useNavigation<HomeNavigation>();
    const playSong = usePlayerStore((state) => state.playSong);
    const [latestSongs, setLatestSongs] = useState<Song[]>([]);
    const [continueListening, setContinueListening] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
    const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
    const [isLoadingLatestSongs, setIsLoadingLatestSongs] = useState(false);
    const [latestSongsError, setLatestSongsError] = useState<string | null>(null);
    const [sectionError, setSectionError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadHomeData = async () => {
            setIsLoadingLatestSongs(true);
            setLatestSongsError(null);
            setSectionError(null);

            const [
                latestResult,
                continueResult,
                recommendedResult,
                trendingResult,
                artistResult,
            ] = await Promise.allSettled([
                getNewSongs(),
                getContinueListeningSongs(),
                getRecommendedSongs(),
                getTrendingSongs(),
                getPopularArtists(),
            ]);

            if (isMounted) {
                if (latestResult.status === 'fulfilled') {
                    setLatestSongs(latestResult.value);
                } else {
                    setLatestSongs([]);
                    setLatestSongsError('Could not load new songs.');
                }

                setContinueListening(
                    continueResult.status === 'fulfilled' ? continueResult.value : []
                );
                setRecommendedSongs(
                    recommendedResult.status === 'fulfilled' ? recommendedResult.value : []
                );
                setTrendingSongs(
                    trendingResult.status === 'fulfilled' ? trendingResult.value : []
                );
                setPopularArtists(
                    artistResult.status === 'fulfilled' ? artistResult.value : []
                );

                if (
                    continueResult.status === 'rejected' ||
                    recommendedResult.status === 'rejected' ||
                    trendingResult.status === 'rejected' ||
                    artistResult.status === 'rejected'
                ) {
                    setSectionError('Some home sections could not be loaded.');
                }

                setIsLoadingLatestSongs(false);
            }
        };

        void loadHomeData();

        return () => {
            isMounted = false;
        };
    }, []);

    const songSections = useMemo<HomeSongSection[]>(
        () => [
            {
                id: 'liked',
                title: 'Liked Songs',
                sourceType: 'liked',
                songs: continueListening.slice(0, HOME_PREVIEW_LIMIT),
                hideWhenEmpty: true,
            },
            {
                id: 'recommended',
                title: 'Recommended For You',
                sourceType: 'recommended',
                songs: recommendedSongs.slice(0, HOME_PREVIEW_LIMIT),
                hideWhenEmpty: true,
            },
            {
                id: 'new',
                title: 'New Songs',
                sourceType: 'new',
                songs: latestSongs.slice(0, HOME_PREVIEW_LIMIT),
                isLoading: isLoadingLatestSongs,
                error: latestSongsError,
                emptyText: 'No new songs found.',
            },
            {
                id: 'trending',
                title: 'Trending',
                sourceType: 'trending',
                songs: trendingSongs.slice(0, HOME_PREVIEW_LIMIT),
                hideWhenEmpty: true,
            },
        ],
        [
            continueListening,
            isLoadingLatestSongs,
            latestSongs,
            latestSongsError,
            recommendedSongs,
            trendingSongs,
        ]
    );

    const previewPopularArtists = useMemo(
        () => popularArtists.slice(0, HOME_PREVIEW_LIMIT),
        [popularArtists]
    );

    const openSongList = useCallback(
        (source: SongListSource) => {
            const listSource = toSongListSource(source);

            if (onOpenSongList) {
                onOpenSongList(listSource);
                return;
            }

            navigation.navigate('SongList', listSource);
        },
        [navigation, onOpenSongList]
    );

    const onPlaySong = useCallback((song: Song) => {
        void playSong(song);
        navigation.navigate('Player', { songId: song.id });
    }, [navigation, playSong]);

    const onOpenArtist = useCallback((artist: Artist) => {
        navigation.navigate('ArtistDetail', { artistId: artist.id });
    }, [navigation]);

    const onQuickActionPress = useCallback((action: HomeQuickAction) => {
        openSongList(action);
    }, [openSongList]);

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
                    hideViewAll
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
            {sectionError && (
                <Text style={styles.stateText}>{sectionError}</Text>
            )}

            {songSections.map((section) => {
                if (
                    section.hideWhenEmpty &&
                    !section.isLoading &&
                    !section.error &&
                    section.songs.length === 0
                ) {
                    return null;
                }

                return (
                    <View key={section.id} style={styles.section}>
                        <SectionHeader
                            title={section.title}
                            onSeeAllPress={() => openSongList(section)}
                        />
                        {section.isLoading ? (
                            <ActivityIndicator size="small" color="#FF4D6D" />
                        ) : section.error ? (
                            <Text style={styles.stateText}>{section.error}</Text>
                        ) : section.songs.length > 0 ? (
                            <HorizontalList
                                data={section.songs}
                                keyExtractor={(item) => item.id}
                                renderItem={renderSongCard}
                            />
                        ) : (
                            <Text style={styles.stateText}>
                                {section.emptyText ?? 'No songs found.'}
                            </Text>
                        )}
                    </View>
                );
            })}

            <View style={styles.section}>
                <SectionHeader
                    title="Popular Artists"
                    onSeeAllPress={() =>
                        Alert.alert('Artists', 'Artist list is loaded from the server.')
                    }
                />
                {previewPopularArtists.length > 0 ? (
                    <HorizontalList
                        data={previewPopularArtists}
                        keyExtractor={(item) => item.id}
                        renderItem={renderArtistCard}
                    />
                ) : (
                    <Text style={styles.stateText}>No artists found.</Text>
                )}
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
