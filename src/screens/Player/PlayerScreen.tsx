import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import AppModal from '../../components/common/AppModal';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../components/common/Layout';
import { usePlayerStore } from '../../store/playerStore';
import { getSongById } from '../../services/songs.service';
import { applyLikedStatus, mapSongDtoToSong } from '../../services/song.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import { publishSongPatch } from '../../services/songState.events';
import type { StackRoute } from '../../navigation/type';
import type { Playlist, Song } from '../../types';

function formatDuration(duration?: number) {
    if (duration === undefined || duration === null) {
        return '0:00';
    }

    const seconds = duration > 10000 ? Math.round(duration / 1000) : Math.round(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getDurationSeconds(duration?: number) {
    if (!duration) {
        return 0;
    }

    return duration > 10000 ? duration / 1000 : duration;
}

function readText(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getGenreLabel(song: Song): string | null {
    const rawSong = song as unknown as Record<string, unknown>;
    const rawGenre = rawSong.genre;

    if (typeof rawGenre === 'string') {
        return readText(rawGenre);
    }

    if (rawGenre && typeof rawGenre === 'object') {
        const genreRecord = rawGenre as Record<string, unknown>;
        return readText(genreRecord.name) ?? readText(genreRecord.label);
    }

    return readText(rawSong.genreName) ?? readText(rawSong.genre_name);
}

type SongBackgroundProps = {
    song: Song | null;
};

function SongBackground({ song }: SongBackgroundProps) {
    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={['#050711', '#0A0D20', '#151027', '#070A18']}
                locations={[0, 0.34, 0.68, 1]}
                style={StyleSheet.absoluteFill}
            />
            {song ? (
                <>
                    <ImageBackground
                        source={{ uri: song.image }}
                        blurRadius={40}
                        style={StyleSheet.absoluteFill}
                        imageStyle={styles.backgroundImage}
                    />
                    <View style={styles.backgroundDim} />
                </>
            ) : (
                <View style={styles.emptyBackground} />
            )}
            <LinearGradient
                colors={[
                    'rgba(4, 6, 16, 0.64)',
                    'rgba(20, 12, 35, 0.84)',
                    'rgba(9, 11, 28, 0.98)',
                ]}
                locations={[0, 0.48, 1]}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={[
                    'rgba(255, 142, 62, 0.20)',
                    'rgba(88, 48, 95, 0.16)',
                    'rgba(8, 11, 28, 0)',
                ]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.82, y: 0.74 }}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={[
                    'rgba(255, 178, 92, 0.20)',
                    'rgba(255, 95, 126, 0.08)',
                    'rgba(255, 178, 92, 0)',
                ]}
                start={{ x: 0.25, y: 0.1 }}
                end={{ x: 0.75, y: 0.9 }}
                style={styles.backgroundBlobWarm}
            />
            <LinearGradient
                colors={[
                    'rgba(92, 210, 255, 0.18)',
                    'rgba(103, 63, 148, 0.08)',
                    'rgba(92, 210, 255, 0)',
                ]}
                start={{ x: 0.2, y: 0.15 }}
                end={{ x: 0.8, y: 0.85 }}
                style={styles.backgroundBlobCool}
            />
            <LinearGradient
                colors={[
                    'rgba(124, 247, 176, 0.12)',
                    'rgba(124, 247, 176, 0.04)',
                    'rgba(124, 247, 176, 0)',
                ]}
                start={{ x: 0.35, y: 0.2 }}
                end={{ x: 0.65, y: 0.8 }}
                style={styles.backgroundBlobMint}
            />
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
                style={styles.backgroundBlobSheen}
            />
            <View pointerEvents="none" style={styles.backgroundGrain} />
            <LinearGradient
                colors={[
                    'rgba(7, 10, 24, 0)',
                    'rgba(7, 10, 24, 0.56)',
                    'rgba(7, 10, 24, 0.99)',
                ]}
                locations={[0, 0.42, 1]}
                style={styles.backgroundBottomFade}
            />
        </View>
    );
}

type AlbumDiscProps = {
    song: Song;
    size: number;
    isPlaying: boolean;
};

function AlbumDisc({ song, size, isPlaying }: AlbumDiscProps) {
    return (
        <View
            style={[
                styles.albumShadow,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                },
            ]}
        >
            <View
                style={[
                    styles.albumRing,
                    isPlaying && styles.albumRingActive,
                    {
                        width: size - 4,
                        height: size - 4,
                        borderRadius: (size - 4) / 2,
                    },
                ]}
            />
            <View
                style={[
                    styles.albumDisc,
                    {
                        width: size - 16,
                        height: size - 16,
                        borderRadius: (size - 16) / 2,
                    },
                ]}
            >
                <Image source={{ uri: song.image }} style={styles.albumImage} />
                <View style={styles.albumCenter} />
            </View>
        </View>
    );
}

type SongInfoProps = {
    song: Song;
    durationLabel: string;
    onArtistPress: () => void;
};

function SongInfo({ song, durationLabel, onArtistPress }: SongInfoProps) {
    const metadata = [getGenreLabel(song), durationLabel].filter(
        (item): item is string => Boolean(item)
    );

    return (
        <View style={styles.songInfo}>
            <Text style={styles.title} numberOfLines={2}>
                {song.title}
            </Text>
            <Pressable hitSlop={8} onPress={onArtistPress}>
                <Text style={styles.artist} numberOfLines={1}>
                    {song.artist}
                </Text>
            </Pressable>
            <View style={styles.metaRow}>
                {metadata.map((item, index) => (
                    <React.Fragment key={`${item}-${index}`}>
                        {index > 0 && <View style={styles.metaDot} />}
                        <Text style={styles.metaText} numberOfLines={1}>
                            {item}
                        </Text>
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
}

type PlayerProgressProps = {
    elapsedLabel: string;
    durationLabel: string;
    progressRatio: number;
    onSeek: (locationX: number) => void;
    onMeasure: (width: number) => void;
};

function PlayerProgress({
    elapsedLabel,
    durationLabel,
    progressRatio,
    onSeek,
    onMeasure,
}: PlayerProgressProps) {
    return (
        <View style={styles.progressSection}>
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{elapsedLabel}</Text>
                <Text style={styles.timeText}>{durationLabel}</Text>
            </View>
            <Pressable
                style={styles.progressTouchArea}
                onLayout={(event) => onMeasure(event.nativeEvent.layout.width)}
                onPress={(event) => onSeek(event.nativeEvent.locationX)}
            >
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
                    <View style={[styles.progressKnob, { left: `${progressRatio * 100}%` }]} />
                </View>
            </Pressable>
        </View>
    );
}

type PlayerControlsProps = {
    isPlaying: boolean;
    shuffleEnabled: boolean;
    repeatMode: 'off' | 'one' | 'all';
    onTogglePlay: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onToggleShuffle: () => void;
    onCycleRepeat: () => void;
};

function PlayerControls({
    isPlaying,
    shuffleEnabled,
    repeatMode,
    onTogglePlay,
    onPrevious,
    onNext,
    onToggleShuffle,
    onCycleRepeat,
}: PlayerControlsProps) {
    const repeatIcon = repeatMode === 'one' ? 'repeat-one' : 'repeat';

    return (
        <View style={styles.controls}>
            <Pressable
                hitSlop={12}
                style={[styles.sideControl, shuffleEnabled && styles.controlActive]}
                onPress={onToggleShuffle}
            >
                <MaterialIcons
                    name="shuffle"
                    size={22}
                    color={shuffleEnabled ? '#FFFFFF' : 'rgba(255,255,255,0.62)'}
                />
            </Pressable>
            <Pressable hitSlop={12} style={styles.skipControl} onPress={onPrevious}>
                <MaterialIcons name="skip-previous" size={32} color="#FFFFFF" />
            </Pressable>
            <Pressable hitSlop={12} onPress={onTogglePlay} style={styles.playButton}>
                <MaterialIcons
                    name={isPlaying ? 'pause' : 'play-arrow'}
                    size={42}
                    color="#101326"
                />
            </Pressable>
            <Pressable hitSlop={12} style={styles.skipControl} onPress={onNext}>
                <MaterialIcons name="skip-next" size={32} color="#FFFFFF" />
            </Pressable>
            <Pressable
                hitSlop={12}
                style={[styles.sideControl, repeatMode !== 'off' && styles.controlActive]}
                onPress={onCycleRepeat}
            >
                <MaterialIcons
                    name={repeatIcon}
                    size={22}
                    color={repeatMode !== 'off' ? '#FFFFFF' : 'rgba(255,255,255,0.62)'}
                />
            </Pressable>
        </View>
    );
}

type PlayerActionsProps = {
    song: Song;
    onQueuePress: () => void;
    onLikePress: () => void;
    onAddPress: () => void;
};

function PlayerActions({ song, onQueuePress, onLikePress, onAddPress }: PlayerActionsProps) {
    return (
        <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={onQueuePress}>
                <MaterialIcons name="queue-music" size={20} color="#FFFFFF" />
                <Text style={styles.actionText}>Up Next</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={onLikePress}>
                <MaterialIcons
                    name={song.isLiked ? 'favorite' : 'favorite-border'}
                    size={20}
                    color={song.isLiked ? '#FF5F7E' : '#FFFFFF'}
                />
                <Text style={styles.actionText}>{song.isLiked ? 'Liked' : 'Like'}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={onAddPress}>
                <MaterialIcons
                    name="playlist-add"
                    size={20}
                    color={song.isInPlaylist ? '#7CF7B0' : '#FFFFFF'}
                />
                <Text style={styles.actionText}>{song.isInPlaylist ? 'Added' : 'Add'}</Text>
            </Pressable>
        </View>
    );
}

type QueueBottomSheetProps = {
    visible: boolean;
    queue: Song[];
    currentIndex: number;
    onClose: () => void;
    onPlaySong: (song: Song) => void;
};

function QueueBottomSheet({
    visible,
    queue,
    currentIndex,
    onClose,
    onPlaySong,
}: QueueBottomSheetProps) {
    const upcomingSongs = queue.slice(Math.max(currentIndex + 1, 0));

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <Pressable style={styles.sheetOverlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Up Next</Text>
                        <Pressable style={styles.sheetClose} onPress={onClose}>
                            <MaterialIcons name="close" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                    <FlatList
                        data={upcomingSongs}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.queueList}
                        ListEmptyComponent={
                            <View style={styles.sheetEmptyBlock}>
                                <Text style={styles.sheetEmpty}>No upcoming songs yet.</Text>
                                <Text style={styles.sheetEmptyHelper}>
                                    Play more songs to build your Up Next list.
                                </Text>
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={styles.queueItem}
                                onPress={() => {
                                    onPlaySong(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.queueIndex}>{index + 1}</Text>
                                <Image source={{ uri: item.image }} style={styles.queueImage} />
                                <View style={styles.queueTextBlock}>
                                    <Text style={styles.queueTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.queueArtist} numberOfLines={1}>
                                        {item.artist}
                                    </Text>
                                </View>
                                <Text style={styles.queueDuration}>
                                    {formatDuration(item.duration)}
                                </Text>
                            </Pressable>
                        )}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

type AddToPlaylistBottomSheetProps = {
    visible: boolean;
    song: Song | null;
    onClose: () => void;
    onAdded: (song: Song, playlist: Playlist) => void;
    onRemoved: (song: Song, playlist: Playlist) => void;
    onError: (message: string) => void;
};

function AddToPlaylistBottomSheet(props: AddToPlaylistBottomSheetProps) {
    return <AddToPlaylistModal {...props} />;
}

type MoreBottomSheetProps = {
    visible: boolean;
    song: Song | null;
    onClose: () => void;
    onViewArtist: () => void;
    onAddToPlaylist: () => void;
    onStartRadio: () => void;
};

function SongOptionsBottomSheet({
    visible,
    song,
    onClose,
    onViewArtist,
    onAddToPlaylist,
    onStartRadio,
}: MoreBottomSheetProps) {
    const runOption = (handler: () => void) => {
        onClose();
        handler();
    };

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <Pressable style={styles.sheetOverlay} onPress={onClose}>
                <Pressable style={styles.moreSheet} onPress={() => undefined}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Song info</Text>
                        <Pressable style={styles.sheetClose} onPress={onClose}>
                            <MaterialIcons name="close" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                    {song ? (
                        <View style={styles.moreSongRow}>
                            <Image source={{ uri: song.image }} style={styles.moreSongImage} />
                            <View style={styles.moreSongTextBlock}>
                                <Text style={styles.moreSongTitle} numberOfLines={1}>
                                    {song.title}
                                </Text>
                                <Text style={styles.moreSongArtist} numberOfLines={1}>
                                    {song.artist}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                    <Pressable
                        style={styles.moreAction}
                        onPress={() => runOption(onViewArtist)}
                    >
                        <MaterialIcons name="person" size={21} color="#FFFFFF" />
                        <Text style={styles.moreActionText}>View artist</Text>
                    </Pressable>
                    <Pressable
                        style={styles.moreAction}
                        onPress={() => runOption(onAddToPlaylist)}
                    >
                        <MaterialIcons name="playlist-add" size={21} color="#FFFFFF" />
                        <Text style={styles.moreActionText}>Add to playlist</Text>
                    </Pressable>
                    <Pressable
                        style={styles.moreAction}
                        onPress={() => runOption(onStartRadio)}
                    >
                        <MaterialIcons name="radio" size={21} color="#FFFFFF" />
                        <Text style={styles.moreActionText}>Start song radio</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export default function PlayerScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<StackRoute<'Player'>>();
    const { width, height } = useWindowDimensions();
    const [isQueueVisible, setIsQueueVisible] = useState(false);
    const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
    const [isMoreVisible, setIsMoreVisible] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const [progressWidth, setProgressWidth] = useState(1);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const currentIndex = usePlayerStore((state) => state.currentIndex);
    const playbackPosition = usePlayerStore((state) => state.playbackPosition);
    const shuffleEnabled = usePlayerStore((state) => state.shuffleEnabled);
    const repeatMode = usePlayerStore((state) => state.repeatMode);
    const playSong = usePlayerStore((state) => state.playSong);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);
    const playNext = usePlayerStore((state) => state.playNext);
    const playPrevious = usePlayerStore((state) => state.playPrevious);
    const seekTo = usePlayerStore((state) => state.seekTo);
    const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
    const setRepeatMode = usePlayerStore((state) => state.setRepeatMode);
    const updateSongById = usePlayerStore((state) => state.updateSongById);
    const durationLabel = formatDuration(currentSong?.duration);
    const durationSeconds = getDurationSeconds(currentSong?.duration);
    const progressRatio = durationSeconds
        ? Math.max(0, Math.min(1, playbackPosition / durationSeconds))
        : 0;
    const elapsedLabel = formatDuration(playbackPosition);
    const songId = route.params?.songId;
    const loadedRouteSongId = useRef<string | undefined>(undefined);
    const albumSize = Math.min(Math.max(width * 0.68, 210), height < 720 ? 250 : 300);

    const contentPaddingTop = useMemo(() => (height < 720 ? 54 : 72), [height]);

    useEffect(() => {
        if (!songId || loadedRouteSongId.current === songId) {
            return;
        }

        let cancelled = false;
        loadedRouteSongId.current = songId;

        const loadSongDetail = async () => {
            if (currentSong?.id === songId) {
                return;
            }

            setDetailLoading(true);
            setDetailError(null);

            try {
                const [detail] = await applyLikedStatus([
                    mapSongDtoToSong(await getSongById(songId)),
                ]);

                if (!cancelled) {
                    await playSong(detail, queue.length > 0 ? queue : [detail]);
                }
            } catch (error) {
                if (!cancelled) {
                    setDetailError(
                        error instanceof Error ? error.message : 'Could not load song detail.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setDetailLoading(false);
                }
            }
        };

        void loadSongDetail();

        return () => {
            cancelled = true;
        };
    }, [currentSong?.id, playSong, queue, songId]);

    const showInfo = (title: string, description: string) => {
        setInfoTitle(title);
        setInfoDescription(description);
        setInfoVisible(true);
    };

    const onTogglePlay = () => {
        if (isPlaying) {
            void pause();
            return;
        }

        if (currentSong) {
            void resume();
        }
    };

    const handleSeek = (locationX: number) => {
        if (!durationSeconds) {
            return;
        }

        const ratio = Math.max(0, Math.min(1, locationX / progressWidth));
        void seekTo(durationSeconds * ratio);
    };

    const handleCycleRepeat = () => {
        if (repeatMode === 'off') {
            setRepeatMode('all');
            return;
        }

        if (repeatMode === 'all') {
            setRepeatMode('one');
            return;
        }

        setRepeatMode('off');
    };

    const handleToggleLike = async () => {
        if (!currentSong) {
            return;
        }

        const nextLiked = !currentSong.isLiked;
        updateSongById(currentSong.id, { isLiked: nextLiked });
        publishSongPatch(currentSong.id, { isLiked: nextLiked });

        try {
            if (nextLiked) {
                await likeSong({ songId: currentSong.id });
            } else {
                await unlikeSong(currentSong.id);
            }
        } catch {
            updateSongById(currentSong.id, { isLiked: Boolean(currentSong.isLiked) });
            publishSongPatch(currentSong.id, { isLiked: Boolean(currentSong.isLiked) });
            showInfo('Error', 'Could not update liked songs.');
        }
    };

    const handleQueueSongPress = (song: Song) => {
        void playSong(song, queue.length > 0 ? queue : [song]);
    };

    const openArtist = () => {
        if (!currentSong) {
            return;
        }

        if (currentSong.artistId) {
            navigation.navigate('ArtistDetail', { artistId: currentSong.artistId });
            return;
        }

        navigation.navigate('SongList', {
            title: currentSong.artist,
            sourceType: 'search',
            query: currentSong.artist,
        });
    };

    return (
        <Layout>
            <View style={styles.container}>
                <SongBackground song={currentSong} />
                <View style={styles.topBar}>
                    <Pressable hitSlop={12} style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="keyboard-arrow-down" size={28} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.topTitle}>Now Playing</Text>
                    <Pressable
                        hitSlop={12}
                        style={styles.iconButton}
                        onPress={() => setIsMoreVisible(true)}
                    >
                        <MaterialIcons name="more-horiz" size={24} color="#FFFFFF" />
                    </Pressable>
                </View>

                {detailLoading && (
                    <ActivityIndicator style={styles.detailLoader} size="small" color="#FF5F7E" />
                )}
                {detailError && <Text style={styles.detailError}>{detailError}</Text>}

                {currentSong ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.content,
                            { paddingTop: contentPaddingTop },
                        ]}
                    >
                        <AlbumDisc song={currentSong} size={albumSize} isPlaying={isPlaying} />
                        <SongInfo
                            song={currentSong}
                            durationLabel={durationLabel}
                            onArtistPress={openArtist}
                        />
                        <PlayerProgress
                            elapsedLabel={elapsedLabel}
                            durationLabel={durationLabel}
                            progressRatio={progressRatio}
                            onSeek={handleSeek}
                            onMeasure={setProgressWidth}
                        />
                        <PlayerControls
                            isPlaying={isPlaying}
                            shuffleEnabled={shuffleEnabled}
                            repeatMode={repeatMode}
                            onTogglePlay={onTogglePlay}
                            onPrevious={() => void playPrevious()}
                            onNext={() => void playNext()}
                            onToggleShuffle={toggleShuffle}
                            onCycleRepeat={handleCycleRepeat}
                        />
                        <PlayerActions
                            song={currentSong}
                            onQueuePress={() => setIsQueueVisible(true)}
                            onLikePress={() => void handleToggleLike()}
                            onAddPress={() => setIsPlaylistVisible(true)}
                        />
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="music-note" size={44} color="#FF7B95" />
                        <Text style={styles.emptyText}>Select a song to start playback</Text>
                    </View>
                )}

                <QueueBottomSheet
                    visible={isQueueVisible}
                    queue={queue}
                    currentIndex={currentIndex}
                    onClose={() => setIsQueueVisible(false)}
                    onPlaySong={handleQueueSongPress}
                />
                <AddToPlaylistBottomSheet
                    visible={isPlaylistVisible}
                    song={currentSong}
                    onClose={() => setIsPlaylistVisible(false)}
                    onAdded={(song) => {
                        updateSongById(song.id, { isInPlaylist: true });
                        publishSongPatch(song.id, { isInPlaylist: true });
                    }}
                    onRemoved={(song) => {
                        updateSongById(song.id, { isInPlaylist: false });
                        publishSongPatch(song.id, { isInPlaylist: false });
                    }}
                    onError={(message) => showInfo('Error', message)}
                />
                <SongOptionsBottomSheet
                    visible={isMoreVisible}
                    song={currentSong}
                    onClose={() => setIsMoreVisible(false)}
                    onViewArtist={openArtist}
                    onAddToPlaylist={() => setIsPlaylistVisible(true)}
                    onStartRadio={() =>
                        showInfo('Song radio', 'Song radio is coming soon.')
                    }
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
        marginHorizontal: -30,
        backgroundColor: '#080B18',
    },
    backgroundImage: {
        resizeMode: 'cover',
        opacity: 0.38,
        transform: [{ scale: 1.2 }],
    },
    backgroundDim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 8, 18, 0.30)',
    },
    backgroundBlobWarm: {
        position: 'absolute',
        top: 66,
        left: -98,
        width: 360,
        height: 360,
        borderRadius: 180,
        opacity: 0.42,
        transform: [{ scale: 1.22 }],
    },
    backgroundBlobCool: {
        position: 'absolute',
        top: 150,
        right: -112,
        width: 340,
        height: 340,
        borderRadius: 170,
        opacity: 0.36,
        transform: [{ scale: 1.18 }],
    },
    backgroundBlobMint: {
        position: 'absolute',
        bottom: 108,
        left: '16%',
        width: 280,
        height: 280,
        borderRadius: 140,
        opacity: 0.28,
        transform: [{ scale: 1.24 }],
    },
    backgroundBlobSheen: {
        position: 'absolute',
        top: 20,
        right: 10,
        width: 220,
        height: 220,
        borderRadius: 110,
        opacity: 0.24,
        transform: [{ scale: 1.08 }],
    },
    backgroundGrain: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.08,
        backgroundColor: 'rgba(255,255,255,0.018)',
    },
    backgroundBottomFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '58%',
    },
    emptyBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#080B18',
    },
    topBar: {
        position: 'absolute',
        top: 12,
        left: 18,
        right: 18,
        zIndex: 5,
        minHeight: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topTitle: {
        color: 'rgba(255,255,255,0.84)',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 0,
        textTransform: 'uppercase',
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.09)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
    },
    detailLoader: {
        position: 'absolute',
        top: 62,
        alignSelf: 'center',
        zIndex: 5,
    },
    detailError: {
        position: 'absolute',
        top: 62,
        left: 24,
        right: 24,
        color: '#FF7B95',
        textAlign: 'center',
        zIndex: 5,
    },
    content: {
        minHeight: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 34,
    },
    albumShadow: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 16 },
        elevation: 10,
        marginTop: 16,
    },
    albumRing: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.14)',
    },
    albumRingActive: {
        borderColor: 'rgba(255,95,126,0.58)',
        shadowColor: '#FF5F7E',
        shadowOpacity: 0.26,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
    },
    albumDisc: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 7,
        borderColor: 'rgba(255,255,255,0.20)',
        backgroundColor: '#11162A',
    },
    albumImage: {
        width: '100%',
        height: '100%',
    },
    albumCenter: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(8, 11, 24, 0.92)',
        borderWidth: 9,
        borderColor: 'rgba(255,255,255,0.70)',
    },
    songInfo: {
        width: '100%',
        alignItems: 'center',
        marginTop: 28,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '900',
        textAlign: 'center',
    },
    artist: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'center',
    },
    metaRow: {
        maxWidth: '100%',
        minHeight: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 8,
        borderRadius: 17,
        paddingHorizontal: 13,
        paddingVertical: 7,
        marginTop: 14,
        backgroundColor: 'rgba(255,255,255,0.09)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.13)',
    },
    metaText: {
        color: 'rgba(255,255,255,0.78)',
        fontSize: 12,
        fontWeight: '800',
    },
    metaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.36)',
    },
    progressSection: {
        width: '100%',
        marginTop: 24,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeText: {
        color: 'rgba(255,255,255,0.62)',
        fontSize: 12,
        fontWeight: '700',
    },
    progressTouchArea: {
        height: 24,
        justifyContent: 'center',
    },
    progressTrack: {
        height: 7,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.18)',
    },
    progressFill: {
        height: 7,
        borderRadius: 999,
        backgroundColor: '#FF5F7E',
    },
    progressKnob: {
        position: 'absolute',
        top: -5,
        marginLeft: -8,
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor: '#FF5F7E',
    },
    controls: {
        width: '100%',
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideControl: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlActive: {
        backgroundColor: 'rgba(255,95,126,0.28)',
    },
    skipControl: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 78,
        height: 78,
        borderRadius: 39,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#FF5F7E',
        shadowOpacity: 0.38,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    actions: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        marginTop: 24,
    },
    actionButton: {
        flex: 1,
        minHeight: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.11)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.13)',
        gap: 5,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 12,
        textAlign: 'center',
    },
    sheetOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(3, 5, 16, 0.56)',
    },
    sheet: {
        maxHeight: '72%',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: '#101427',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 18,
    },
    sheetHandle: {
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.28)',
        alignSelf: 'center',
        marginBottom: 12,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sheetTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    sheetClose: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    moreSheet: {
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: '#101427',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 22,
    },
    moreSongRow: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        padding: 10,
        marginBottom: 10,
    },
    moreSongImage: {
        width: 46,
        height: 46,
        borderRadius: 9,
        marginRight: 11,
    },
    moreSongTextBlock: {
        flex: 1,
    },
    moreSongTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    moreSongArtist: {
        color: '#AEB8D8',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },
    moreAction: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 13,
        marginTop: 8,
        gap: 10,
    },
    moreActionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    queueList: {
        paddingBottom: 8,
    },
    sheetEmptyBlock: {
        paddingVertical: 22,
        alignItems: 'center',
    },
    sheetEmpty: {
        color: '#AEB8D8',
        textAlign: 'center',
        fontWeight: '700',
    },
    sheetEmptyHelper: {
        color: 'rgba(174,184,216,0.72)',
        fontSize: 12,
        lineHeight: 17,
        marginTop: 6,
        textAlign: 'center',
    },
    queueItem: {
        minHeight: 62,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 9,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    queueIndex: {
        width: 22,
        color: 'rgba(255,255,255,0.48)',
        fontSize: 12,
        fontWeight: '900',
    },
    queueImage: {
        width: 42,
        height: 42,
        borderRadius: 8,
        marginRight: 10,
    },
    queueTextBlock: {
        flex: 1,
    },
    queueTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    queueArtist: {
        color: '#AEB8D8',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 3,
    },
    queueDuration: {
        color: 'rgba(255,255,255,0.54)',
        fontSize: 12,
        fontWeight: '800',
        marginLeft: 8,
    },
});
