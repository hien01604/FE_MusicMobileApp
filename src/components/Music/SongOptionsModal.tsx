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
import type { Song } from '../../types';
import { likeSong, unlikeSong } from '../../services/users.service';
import { usePlayerStore } from '../../store/playerStore';

type SongOptionId = 'queue' | 'liked';

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
    { id: 'queue', label: 'Add to Queue', icon: 'queue-music' },
    { id: 'liked', label: 'Add to Liked Songs', icon: 'favorite' },
];

export default function SongOptionsModal({
    visible,
    song,
    onClose,
    onSuccess,
    onError,
    isLiked = false,
    onLikedChange,
}: Props) {
    const [loadingAction, setLoadingAction] = useState<SongOptionId | null>(null);
    const addToQueue = usePlayerStore((state) => state.addToQueue);

    const closeModal = () => {
        onClose();
    };

    const runAction = async (action: SongOptionId) => {
        if (!song || loadingAction) {
            return;
        }

        setLoadingAction(action);

        try {
            if (action === 'queue') {
                await addToQueue(song);
                onSuccess?.('Added to queue.');
            }

            if (action === 'liked') {
                if (isLiked) {
                    await unlikeSong(song.id);
                    onLikedChange?.(song, false);
                    onSuccess?.('Removed from liked songs.');
                } else {
                    await likeSong({ songId: song.id });
                    onLikedChange?.(song, true);
                    onSuccess?.('Added to liked songs.');
                }
            }

            closeModal();
        } catch {
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
                                item.id === 'liked' && isLiked
                                    ? 'Remove from Liked Songs'
                                    : item.label;

                            return (
                                <Pressable
                                    key={item.id}
                                    disabled={Boolean(loadingAction)}
                                    style={({ pressed }) => [
                                        styles.optionItem,
                                        pressed && styles.optionItemPressed,
                                        loadingAction && styles.optionItemDisabled,
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
