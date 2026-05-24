import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Song } from '../../types';

interface SongListItemProps {
    song: Song;
    onPress?: (song: Song) => void;
    onLongPress?: (song: Song) => void;
    onToggleLike?: (song: Song) => void;
    onAddToPlaylist?: (song: Song) => void;
}

const SongListItemComponent = ({
    song,
    onPress,
    onLongPress,
    onToggleLike,
    onAddToPlaylist,
}: SongListItemProps) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.containerPressed,
            ]}
            onPress={() => onPress?.(song)}
            onLongPress={() => onLongPress?.(song)}
        >
            {/* Album Cover */}
            <Image
                source={{ uri: song.image }}
                style={styles.cover}
                resizeMode="cover"
            />

            {/* Song Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {song.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {song.artist}
                </Text>
            </View>

            <View style={styles.statusIcons}>
                <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onToggleLike?.(song);
                    }}
                >
                    <MaterialIcons
                        name={song.isLiked ? 'favorite' : 'favorite-border'}
                        size={18}
                        color={song.isLiked ? '#FF4D6D' : 'rgba(255,255,255,0.55)'}
                    />
                </Pressable>
                <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onAddToPlaylist?.(song);
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

export const SongListItem = memo(SongListItemComponent);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 32, 61, 0.6)',
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    containerPressed: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 0, 47, 0.4)',
    },
    cover: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        marginRight: 14,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    statusIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    artist: {
        color: '#9CA3AF',
        fontSize: 13,
    },
});
