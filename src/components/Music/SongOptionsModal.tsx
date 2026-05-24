import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { Song } from '../../types';
import { likeSong, unlikeSong } from '../../services/users.service';
import { usePlayerStore } from '../../store/playerStore';
import AddToPlaylistModal from '../common/AddToPlaylistModal';
import { publishSongPatch } from '../../services/songState.events';
import { searchArtists } from '../../services/artists.service';

type SongOptionId = 'liked' | 'playlist' | 'artist';

type SongOption = {
    id: SongOptionId;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
};

type Props = {
    visible: boolean;
    song: Song | null;
    onClose: () => void;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    isLiked?: boolean;
    onLikedChange?: (song: Song, liked: boolean) => void;
};

const options: SongOption[] = [
    { id: 'liked', label: 'Add to Liked Songs', icon: 'favorite' },
    { id: 'playlist', label: 'Add to Playlist', icon: 'playlist-add' },
    { id: 'artist', label: 'View Artist', icon: 'person' },
];

export default function SongOptionsModal({
    visible,
    song,
    onClose,
    onSuccess,
    onError,
    isLiked,
    onLikedChange,
}: Props) {
    const navigation = useNavigation<any>();
    const [loadingAction, setLoadingAction] = useState<SongOptionId | null>(null);
    const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
    const updateSongById = usePlayerStore((state) => state.updateSongById);
    const liked = isLiked ?? song?.isLiked ?? false;

    const closeModal = () => {
        onClose();
    };

    const getSongArtistId = async (currentSong: Song): Promise<string | null> => {
        if (currentSong.artistId) {
            return currentSong.artistId;
        }

        const [artistName] = currentSong.artist.split(',').map((name) => name.trim()).filter(Boolean);
        if (!artistName || artistName === 'Unknown Artist') {
            return null;
        }

        const artists = await searchArtists({ q: artistName, limit: 5 });
        const matchedArtist =
            artists.find((artist) => artist.name.toLowerCase() === artistName.toLowerCase()) ??
            artists[0];

        return matchedArtist?.id ?? null;
    };

    const runAction = async (action: SongOptionId) => {
        if (!song || loadingAction) {
            return;
        }

        if (action === 'playlist') {
            setIsPlaylistModalVisible(true);
            return;
        }

        if (action === 'artist') {
            setLoadingAction(action);
            try {
                const artistId = await getSongArtistId(song);

                if (!artistId) {
                    onError?.('Artist detail is not available for this song.');
                    return;
                }

                updateSongById(song.id, { artistId });
                closeModal();
                navigation.navigate('ArtistDetail', { artistId });
            } catch {
                onError?.('Could not open artist detail.');
            } finally {
                setLoadingAction(null);
            }
            return;
        }

        setLoadingAction(action);

        try {
            if (action === 'liked') {
                const nextLiked = !liked;
                onLikedChange?.(song, nextLiked);
                updateSongById(song.id, { isLiked: nextLiked });
                publishSongPatch(song.id, { isLiked: nextLiked });

                if (liked) {
                    await unlikeSong(song.id);
                    onSuccess?.('Removed from liked songs.');
                } else {
                    await likeSong({ songId: song.id });
                    onSuccess?.('Added to liked songs.');
                }
            }

            closeModal();
        } catch {
            if (action === 'liked') {
                onLikedChange?.(song, liked);
                updateSongById(song.id, { isLiked: liked });
                publishSongPatch(song.id, { isLiked: liked });
            }
            onError?.('Could not update this song. Please try again.');
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={closeModal}
        >
            <Pressable style={styles.overlay} onPress={closeModal}>
                <Pressable style={styles.sheet}>
                    <Text style={styles.title}>Song Options</Text>

                    {song && (
                        <View style={styles.songRow}>
                            <Image source={{ uri: song.image }} style={styles.cover} />
                            <View style={styles.songInfo}>
                                <Text style={styles.songTitle} numberOfLines={1}>
                                    {song.title}
                                </Text>
                                <Text style={styles.songArtist} numberOfLines={1}>
                                    {song.artist}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.optionList}>
                        {options.map((item) => {
                            const isLoading = loadingAction === item.id;
                            const label =
                                item.id === 'liked' && liked
                                    ? 'Remove from Liked Songs'
                                    : item.label;
                            const disabled = Boolean(loadingAction);

                            return (
                                <Pressable
                                    key={item.id}
                                    disabled={disabled}
                                    style={({ pressed }) => [
                                        styles.optionItem,
                                        pressed && styles.optionItemPressed,
                                        disabled && styles.optionItemDisabled,
                                    ]}
                                    onPress={() => {
                                        void runAction(item.id);
                                    }}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#FF6F91" />
                                    ) : (
                                        <MaterialIcons
                                            name={item.icon}
                                            size={20}
                                            color="#FF6F91"
                                        />
                                    )}
                                    <Text style={styles.optionText}>{label}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>

            <AddToPlaylistModal
                visible={isPlaylistModalVisible}
                song={song}
                onClose={() => setIsPlaylistModalVisible(false)}
                onAdded={(addedSong, playlist) => {
                    updateSongById(addedSong.id, { isInPlaylist: true });
                    publishSongPatch(addedSong.id, { isInPlaylist: true });
                    onSuccess?.(`Added to ${playlist.name}.`);
                }}
                onRemoved={(removedSong) => {
                    updateSongById(removedSong.id, { isInPlaylist: false });
                    publishSongPatch(removedSong.id, { isInPlaylist: false });
                    onSuccess?.('Removed from playlist.');
                }}
                onError={onError}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 30,
        backgroundColor: 'rgba(4, 7, 24, 0.28)',
    },
    sheet: {
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: 'rgba(70, 20, 72, 0.96)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'center',
        paddingTop: 12,
        paddingBottom: 10,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingBottom: 12,
    },
    cover: {
        width: 42,
        height: 42,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    songInfo: {
        flex: 1,
        marginLeft: 10,
    },
    songTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    songArtist: {
        color: '#C9A4C9',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 3,
    },
    optionList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    optionItem: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    },
    optionItemPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    optionItemDisabled: {
        opacity: 0.72,
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 12,
    },
});
