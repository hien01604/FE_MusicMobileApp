import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppModal from '../../components/common/AppModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Artist, Song, SongListSource } from '../../types';
import { SectionHeader } from '../../components/Music/SectionHeader';
import HorizontalList from '../../components/Music/HorizontalList';
import { SongCard } from '../../components/Music/SongCard';
import ArtistCard from '../../components/Music/ArtistCard';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import { usePlayerStore } from '../../store/playerStore';
import type { RootStackParamList } from '../../navigation/type';
import {
    getNewSongs,
    getRecommendedSongs,
    getRecentlyPlayedSongs,
    getTrendingSongs,
} from '../../services/song.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import { getPopularArtists } from '../../services/artist.service';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import { useAuthContext } from '../../contexts/AuthContext';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

type HomeTabProps = {
    onOpenSongList?: (source: SongListSource) => void;
};

const HOME_PREVIEW_LIMIT = 6;

const HOME_QUOTES = [
    'Let the next track find the part of you that needed it.',
    'Some days need bass. Some days need a soft chorus.',
    'Press play and give the room a different color.',
    'Your soundtrack is waiting where your mood left off.',
    'A good song can turn five minutes into a scene.',
];

type HomeSongSection = SongListSource & {
    id: string;
    songs: Song[];
    isLoading?: boolean;
    error?: string | null;
    emptyText?: string;
    hideWhenEmpty?: boolean;
};

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
    const { user } = useAuthContext();
    const currentSong = usePlayerStore((state) => state.currentSong);
    const playSong = usePlayerStore((state) => state.playSong);
    const updateSongById = usePlayerStore((state) => state.updateSongById);
    const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState<Song[]>([]);
    const [latestSongs, setLatestSongs] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
    const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
    const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
    const [isLoadingRecentlyPlayed, setIsLoadingRecentlyPlayed] = useState(false);
    const [isLoadingLatestSongs, setIsLoadingLatestSongs] = useState(false);
    const [recentlyPlayedError, setRecentlyPlayedError] = useState<string | null>(null);
    const [latestSongsError, setLatestSongsError] = useState<string | null>(null);
    const [sectionError, setSectionError] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');

    const loadHomeData = useCallback(async () => {
        setIsLoadingRecentlyPlayed(true);
        setIsLoadingLatestSongs(true);
        setRecentlyPlayedError(null);
        setLatestSongsError(null);
        setSectionError(null);

        const [
            recentlyPlayedResult,
            latestResult,
            recommendedResult,
            trendingResult,
            artistResult,
        ] = await Promise.allSettled([
            getRecentlyPlayedSongs(),
            getNewSongs(),
            getRecommendedSongs(),
            getTrendingSongs(),
            getPopularArtists(),
        ]);

        if (recentlyPlayedResult.status === 'fulfilled') {
            setRecentlyPlayedSongs(recentlyPlayedResult.value);
        } else {
            setRecentlyPlayedSongs([]);
            setRecentlyPlayedError('Could not load recently played songs.');
        }

        if (latestResult.status === 'fulfilled') {
            setLatestSongs(latestResult.value);
        } else {
            setLatestSongs([]);
            setLatestSongsError('Could not load new songs.');
        }

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
            recentlyPlayedResult.status === 'rejected' ||
            recommendedResult.status === 'rejected' ||
            trendingResult.status === 'rejected' ||
            artistResult.status === 'rejected'
        ) {
            setSectionError('Some home sections could not be loaded.');
        }

        setIsLoadingRecentlyPlayed(false);
        setIsLoadingLatestSongs(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadHomeData();
        }, [loadHomeData])
    );

    useEffect(() => {
        if (!currentSong) {
            return;
        }

        setRecentlyPlayedSongs((currentSongs) => [
            currentSong,
            ...currentSongs.filter((song) => song.id !== currentSong.id),
        ]);
    }, [currentSong]);

    const songSections = useMemo<HomeSongSection[]>(
        () => [
            {
                id: 'recentlyPlayed',
                title: 'Recently Played',
                sourceType: 'recent',
                songs: recentlyPlayedSongs.slice(0, HOME_PREVIEW_LIMIT),
                isLoading: isLoadingRecentlyPlayed,
                error: recentlyPlayedError,
                emptyText: 'Play a song to see it here.',
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
            isLoadingRecentlyPlayed,
            isLoadingLatestSongs,
            recentlyPlayedSongs,
            recentlyPlayedError,
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

    const onPlaySong = useCallback((song: Song, queue?: Song[]) => {
        void playSong(song, queue);
        navigation.navigate('Player', { songId: song.id });
    }, [navigation, playSong]);

    const applySongState = useCallback((songId: string, patch: Partial<Song>) => {
        const updateList = (songs: Song[]) =>
            songs.map((song) => (song.id === songId ? { ...song, ...patch } : song));

        setLatestSongs(updateList);
        setRecentlyPlayedSongs(updateList);
        setRecommendedSongs(updateList);
        setTrendingSongs(updateList);
        updateSongById(songId, patch);
    }, [updateSongById]);

    useEffect(() => subscribeSongPatches(applySongState), [applySongState]);

    const updateSongState = useCallback((songId: string, patch: Partial<Song>) => {
        applySongState(songId, patch);
        publishSongPatch(songId, patch);
    }, [applySongState]);

    const handleToggleLike = useCallback(async (song: Song) => {
        const nextLiked = !song.isLiked;
        updateSongState(song.id, { isLiked: nextLiked });

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
    }, [updateSongState]);

    const onOpenArtist = useCallback((artist: Artist) => {
        navigation.navigate('ArtistDetail', { artistId: artist.id });
    }, [navigation]);

    const renderArtistCard = useCallback(
        ({ item }: { item: Artist }) => (
            <ArtistCard item={item} onPress={() => onOpenArtist(item)} />
        ),
        [onOpenArtist]
    );

    const displayName = user?.username || user?.email?.split('@')[0] || 'there';
    const quote = useMemo(() => {
        const dayIndex = new Date().getDate() % HOME_QUOTES.length;
        return HOME_QUOTES[dayIndex];
    }, []);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentBottom}
        >
            <View style={styles.heroHeader}>
                <View style={styles.heroTextBlock}>
                    <Text style={styles.greeting}>Hi, {displayName}</Text>
                    <Text style={styles.greetingSubtitle} numberOfLines={2}>
                        {quote}
                    </Text>
                </View>
            </View>
            {sectionError && (
                <Text style={styles.stateText}>{sectionError}</Text>
            )}

            <Pressable
                onPress={() => navigation.navigate('AIVibeMix')}
                style={({ pressed }) => [
                    styles.vibeMixCard,
                    pressed && styles.vibeMixCardPressed,
                ]}
            >
                <View style={styles.vibeMixIcon}>
                    <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.vibeMixTextBlock}>
                    <Text style={styles.vibeMixTitle}>AI VibeMix</Text>
                    <Text style={styles.vibeMixSubtitle} numberOfLines={2}>
                        Describe your mood and let AI create a playlist for you.
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#DCE4FF" />
            </Pressable>

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
                                renderItem={({ item }) => (
                                    <SongCard
                                        item={item}
                                        onPress={() => onPlaySong(item, section.songs)}
                                        onToggleLike={handleToggleLike}
                                        onAddToPlaylist={setPlaylistSong}
                                    />
                                )}
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
                    onSeeAllPress={() => navigation.navigate('Artists')}
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
    heroHeader: {
        marginTop: 6,
        marginBottom: 6,
        paddingVertical: 4,
        paddingHorizontal: 4,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        overflow: 'visible',
    },
    heroTextBlock: {
        maxWidth: '100%',
    },
    greeting: {
        color: '#FFFFFF',
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 25,
    },
    greetingSubtitle: {
        color: '#AEB8D8',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 8,
        lineHeight: 21,
    },
    section: {
        marginTop: 24,
    },
    vibeMixCard: {
        marginTop: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.4)',
        backgroundColor: 'rgba(64, 26, 52, 0.72)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
    },
    vibeMixCardPressed: {
        backgroundColor: 'rgba(92, 32, 67, 0.86)',
        transform: [{ scale: 0.99 }],
    },
    vibeMixIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
    },
    vibeMixTextBlock: {
        flex: 1,
    },
    vibeMixTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    vibeMixSubtitle: {
        color: '#DCE4FF',
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 17,
        marginTop: 3,
    },
    stateText: {
        color: '#AEB8D8',
        fontSize: 13,
        paddingVertical: 8,
    },
});
