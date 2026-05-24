import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlayerStore } from '../../store/playerStore';
import { likeSong, unlikeSong } from '../../services/users.service';
import AddToPlaylistModal from '../common/AddToPlaylistModal';
import { publishSongPatch } from '../../services/songState.events';

type MiniPlayerProps = {
    onOpenPlayer: () => void;
};

export default function MiniPlayer({ onOpenPlayer }: MiniPlayerProps) {
    const insets = useSafeAreaInsets();
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const playbackPosition = usePlayerStore((state) => state.playbackPosition);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);
    const playNext = usePlayerStore((state) => state.playNext);
    const playPrevious = usePlayerStore((state) => state.playPrevious);
    const dismissPlayer = usePlayerStore((state) => state.dismissPlayer);
    const updateSongById = usePlayerStore((state) => state.updateSongById);
    const [playlistVisible, setPlaylistVisible] = useState(false);

    const progress = useMemo(() => {
        const duration = currentSong?.duration;
        if (!duration || duration <= 0) {
            return 0;
        }

        const ratio = playbackPosition / duration;
        return Math.max(0, Math.min(1, ratio));
    }, [currentSong?.duration, playbackPosition]);

    if (!currentSong) {
        return null;
    }

    const onTogglePlay = () => {
        if (isPlaying) {
            void pause();
            return;
        }

        void resume();
    };

    const handleToggleLike = async () => {
        if (!currentSong) {
            return;
        }

        const nextLiked = !currentSong.isLiked;
        updateSongById(currentSong.id, { isLiked: nextLiked });
        publishSongPatch(currentSong.id, { isLiked: nextLiked });

        try {
            if (!nextLiked) {
                await unlikeSong(currentSong.id);
            } else {
                await likeSong({ songId: currentSong.id });
            }
        } catch {
            updateSongById(currentSong.id, { isLiked: Boolean(currentSong.isLiked) });
            publishSongPatch(currentSong.id, { isLiked: Boolean(currentSong.isLiked) });
        }
    };


    return (
        <View style={[styles.wrapper, { bottom: insets.bottom + 8 }]} pointerEvents="box-none">
            <View style={styles.container}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>

                <View style={styles.topRow}>
                    <Pressable style={styles.infoArea} onPress={onOpenPlayer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {currentSong.title}
                        </Text>
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {currentSong.artist}
                        </Text>
                    </Pressable>

                    <View style={styles.actionsRow}>
                        <Pressable style={styles.iconButton} onPress={handleToggleLike}>
                            <MaterialIcons
                                name={currentSong.isLiked ? 'favorite' : 'favorite-border'}
                                size={22}
                                color={currentSong.isLiked ? '#FF4D6D' : '#FFFFFF'}
                            />
                        </Pressable>

                        <Pressable style={styles.iconButton} onPress={() => setPlaylistVisible(true)}>
                            <MaterialIcons
                                name="playlist-add"
                                size={22}
                                color={currentSong.isInPlaylist ? '#7CF7B0' : '#FFFFFF'}
                            />
                        </Pressable>

                        <View style={styles.transportControls}>
                            <Pressable style={styles.iconButton} onPress={() => void playPrevious()}>
                                <MaterialIcons name="skip-previous" size={24} color="#FFFFFF" />
                            </Pressable>

                            <Pressable style={styles.playButton} onPress={onTogglePlay}>
                                <MaterialIcons
                                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                                    size={32}
                                    color="#FFFFFF"
                                />
                            </Pressable>

                            <Pressable style={styles.iconButton} onPress={() => void playNext()}>
                                <MaterialIcons name="skip-next" size={24} color="#FFFFFF" />
                            </Pressable>
                        </View>

                        <Pressable style={styles.closeButton} onPress={() => void dismissPlayer()}>
                            <MaterialIcons name="close" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>
            </View>

            <AddToPlaylistModal
                visible={playlistVisible}
                song={currentSong}
                onClose={() => setPlaylistVisible(false)}
                onAdded={(song) => {
                    updateSongById(song.id, { isInPlaylist: true });
                    publishSongPatch(song.id, { isInPlaylist: true });
                }}
                onRemoved={(song) => {
                    updateSongById(song.id, { isInPlaylist: false });
                    publishSongPatch(song.id, { isInPlaylist: false });
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 12,
        right: 12,
        zIndex: 999,
    },
    container: {
        borderRadius: 18,
        backgroundColor: 'rgba(12, 16, 34, 0.96)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        minHeight: 92,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 12,
    },
    progressTrack: {
        height: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.12)',
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressFill: {
        height: 3,
        borderRadius: 999,
        backgroundColor: '#FF4D6D',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoArea: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 4,
        color: '#B8C6E8',
        fontSize: 12,
        fontWeight: '600',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 8,
    },
    transportControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    playButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,77,109,0.18)',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
});
