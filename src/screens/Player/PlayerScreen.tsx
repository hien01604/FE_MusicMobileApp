import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../components/common/Layout';
import SongOptionsModal from '../../components/Music/SongOptionsModal';
import { usePlayerStore } from '../../store/playerStore';
import { getSongById } from '../../services/songs.service';
import { mapSongDtoToSong } from '../../services/song.service';
import type { StackRoute } from '../../navigation/type';

function formatDuration(duration?: number) {
    if (!duration) {
        return '2:54';
    }

    const seconds = duration > 10000 ? Math.round(duration / 1000) : Math.round(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
    const navigation = useNavigation();
    const route = useRoute<StackRoute<'Player'>>();
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const playSong = usePlayerStore((state) => state.playSong);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);
    const durationLabel = formatDuration(currentSong?.duration);
    const songId = route.params?.songId;

    useEffect(() => {
        if (!songId) {
            return;
        }

        let cancelled = false;

        const loadSongDetail = async () => {
            setDetailLoading(true);
            setDetailError(null);

            try {
                const detail = mapSongDtoToSong(await getSongById(songId));

                if (!cancelled) {
                    await playSong(detail);
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
    }, [playSong, songId]);

    const onTogglePlay = () => {
        if (isPlaying) {
            void pause();
            return;
        }

        if (currentSong) {
            void resume();
        }
    };

    return (
        <Layout>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#08091D', '#171342', '#4E1848', '#0B102B']}
                    locations={[0, 0.28, 0.64, 1]}
                    style={styles.playerSurface}
                >
                    {currentSong && (
                        <ImageBackground
                            source={{ uri: currentSong.image }}
                            style={styles.surfaceBackdrop}
                            imageStyle={styles.surfaceBackdropImage}
                            blurRadius={8}
                        />
                    )}
                    <LinearGradient
                        pointerEvents="none"
                        colors={[
                            'rgba(7, 8, 28, 0.08)',
                            'rgba(255, 92, 95, 0.24)',
                            'rgba(252, 128, 72, 0.18)',
                            'rgba(11, 14, 42, 0.86)',
                        ]}
                        locations={[0, 0.32, 0.5, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                    <LinearGradient
                        pointerEvents="none"
                        colors={[
                            'rgba(20, 24, 76, 0.02)',
                            'rgba(255, 54, 137, 0.2)',
                            'rgba(255, 184, 92, 0.12)',
                            'rgba(11, 12, 36, 0.72)',
                        ]}
                        start={{ x: 0.05, y: 0.1 }}
                        end={{ x: 0.85, y: 0.75 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.topBar}>
                        <Pressable
                            hitSlop={12}
                            style={styles.iconButton}
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialIcons name="arrow-back-ios-new" size={18} color="#FFFFFF" />
                        </Pressable>

                        <View style={styles.topActions}>
                            <Pressable hitSlop={12} style={styles.iconButton}>
                                <MaterialIcons name="ios-share" size={18} color="#FFFFFF" />
                            </Pressable>
                            <Pressable
                                hitSlop={12}
                                style={styles.iconButton}
                                onPress={() => setIsOptionsVisible(true)}
                            >
                                <MaterialIcons name="more-horiz" size={22} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>

                    {detailLoading && (
                        <ActivityIndicator
                            style={styles.detailLoader}
                            size="small"
                            color="#FF7B95"
                        />
                    )}
                    {detailError && (
                        <Text style={styles.detailError}>{detailError}</Text>
                    )}

                    {currentSong ? (
                        <>
                            <ImageBackground
                                source={{ uri: currentSong.image }}
                                style={styles.hero}
                                imageStyle={styles.heroImage}
                                blurRadius={10}
                            >
                                <LinearGradient
                                    colors={[
                                        'rgba(255, 90, 112, 0.18)',
                                        'rgba(255, 126, 78, 0.14)',
                                        'rgba(9, 12, 36, 0.1)',
                                    ]}
                                    style={StyleSheet.absoluteFill}
                                />

                                <View style={styles.discShadow}>
                                    <View style={styles.disc}>
                                        <Image
                                            source={{ uri: currentSong.image }}
                                            style={styles.discImage}
                                        />
                                        <View style={styles.discHole} />
                                    </View>
                                </View>
                            </ImageBackground>

                            <View style={styles.songInfo}>
                                <Text style={styles.title} numberOfLines={1}>
                                    {currentSong.title}
                                </Text>
                                <Text style={styles.artist} numberOfLines={1}>
                                    {currentSong.artist}
                                </Text>
                            </View>

                            <View style={styles.progressSection}>
                                <View style={styles.progressTrack}>
                                    <View style={styles.progressFill} />
                                    <View style={styles.progressKnob} />
                                </View>
                                <View style={styles.timeRow}>
                                    <Text style={styles.timeText}>0:13</Text>
                                    <Text style={styles.timeText}>{durationLabel}</Text>
                                </View>
                            </View>

                            <View style={styles.controls}>
                                <Pressable hitSlop={12} style={styles.controlButton}>
                                    <MaterialIcons name="shuffle" size={18} color="#FF5D79" />
                                </Pressable>
                                <Pressable hitSlop={12} style={styles.controlButton}>
                                    <MaterialIcons name="skip-previous" size={26} color="#FF7B95" />
                                </Pressable>
                                <Pressable
                                    hitSlop={12}
                                    onPress={onTogglePlay}
                                    style={styles.playButton}
                                >
                                    <MaterialIcons
                                        name={isPlaying ? 'pause' : 'play-arrow'}
                                        size={32}
                                        color="#142047"
                                    />
                                </Pressable>
                                <Pressable hitSlop={12} style={styles.controlButton}>
                                    <MaterialIcons name="skip-next" size={26} color="#FF7B95" />
                                </Pressable>
                                <Pressable
                                    hitSlop={12}
                                    style={styles.controlButton}
                                    onPress={() => setIsOptionsVisible(true)}
                                >
                                    <MaterialIcons name="more-horiz" size={22} color="#FF5D79" />
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="music-note" size={44} color="#FF7B95" />
                            <Text style={styles.emptyText}>Select a song to start playback</Text>
                        </View>
                    )}
                </LinearGradient>

                <SongOptionsModal
                    visible={isOptionsVisible}
                    song={currentSong}
                    onClose={() => setIsOptionsVisible(false)}
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
        marginHorizontal: -30,
    },
    playerSurface: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#070812',
    },
    surfaceBackdrop: {
        ...StyleSheet.absoluteFillObject,
        opacity: 1,
    },
    surfaceBackdropImage: {
        resizeMode: 'cover',
        transform: [{ scale: 1.08 }],
    },
    topBar: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    detailLoader: {
        position: 'absolute',
        top: 56,
        alignSelf: 'center',
        zIndex: 5,
    },
    detailError: {
        position: 'absolute',
        top: 54,
        left: 24,
        right: 24,
        color: '#FF7B95',
        textAlign: 'center',
        zIndex: 5,
    },
    iconButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hero: {
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 28,
        backgroundColor: 'transparent',
    },
    heroImage: {
        resizeMode: 'cover',
        opacity: 0,
    },
    discShadow: {
        width: 190,
        height: 190,
        borderRadius: 95,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 91, 126, 0.9)',
        shadowColor: '#000000',
        shadowOpacity: 0.38,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
        zIndex: 1,
    },
    disc: {
        width: 170,
        height: 170,
        borderRadius: 85,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.22)',
        backgroundColor: '#12152B',
    },
    discImage: {
        width: '100%',
        height: '100%',
    },
    discHole: {
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(8, 11, 28, 0.9)',
        borderWidth: 7,
        borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    songInfo: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 8,
        zIndex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
        textAlign: 'center',
    },
    artist: {
        color: '#D3B8EF',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 5,
        textAlign: 'center',
    },
    progressSection: {
        marginTop: 28,
        paddingHorizontal: 30,
        zIndex: 1,
    },
    progressTrack: {
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
    progressFill: {
        width: '16%',
        height: 3,
        borderRadius: 2,
        backgroundColor: '#FF7C4F',
    },
    progressKnob: {
        position: 'absolute',
        left: '15%',
        top: -3,
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#FF7C4F',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 7,
    },
    timeText: {
        color: 'rgba(255, 255, 255, 0.45)',
        fontSize: 10,
    },
    controls: {
        marginTop: 20,
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    controlButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFB85C',
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
});
