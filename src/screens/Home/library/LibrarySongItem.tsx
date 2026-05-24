import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Song } from '../../../types';

type LibrarySongItemProps = {
    song: Song;
    isPlaying?: boolean;
    onPress: (song: Song) => void;
    onToggleLike: (song: Song) => void;
    onAddToPlaylist: (song: Song) => void;
};

const LibrarySongItemComponent = ({
    song,
    isPlaying = false,
    onPress,
    onToggleLike,
    onAddToPlaylist,
}: LibrarySongItemProps) => {
    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onPress(song)}
        >
            <Image source={{ uri: song.image }} style={styles.cover} />
            <View style={styles.textContent}>
                <Text style={styles.title} numberOfLines={1}>
                    {song.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {song.artist}
                </Text>
            </View>

            {isPlaying && <Text style={styles.badge}>Playing</Text>}

            <View style={styles.statusIcons}>
                <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onToggleLike(song);
                    }}
                >
                    <MaterialIcons name="favorite" size={18} color="#FF4D6D" />
                </Pressable>
                <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onAddToPlaylist(song);
                    }}
                >
                    <MaterialIcons
                        name="playlist-add"
                        size={18}
                        color={song.isInPlaylist ? '#7CF7B0' : 'rgba(255,255,255,0.55)'}
                    />
                </Pressable>
            </View>
        </Pressable>
    );
};

export const LibrarySongItem = memo(LibrarySongItemComponent);

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(24, 57, 88, 0.85)',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardPressed: {
        opacity: 0.9,
    },
    cover: {
        width: 52,
        height: 52,
        borderRadius: 10,
    },
    textContent: {
        flex: 1,
        marginHorizontal: 12,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 6,
        color: '#AEDAFB',
        fontSize: 13,
    },
    badge: {
        color: '#FF4D6D',
        fontSize: 12,
        fontWeight: '700',
    },
    statusIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 10,
    },
});
