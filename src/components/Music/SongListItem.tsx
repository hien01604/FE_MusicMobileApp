import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Song } from '../../types';

interface SongListItemProps {
    song: Song;
    onPress?: (song: Song) => void;
    onMenuPress?: (song: Song) => void;
}

const SongListItemComponent = ({
    song,
    onPress,
    onMenuPress,
}: SongListItemProps) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.containerPressed,
            ]}
            onPress={() => onPress?.(song)}
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

            {/* Menu Icon */}
            <Pressable
                style={({ pressed }) => [
                    styles.menuButton,
                    pressed && styles.menuButtonPressed,
                ]}
                onPress={() => onMenuPress?.(song)}
            >
                <MaterialIcons
                    name="more-vert"
                    size={20}
                    color="#FFFFFF"
                    style={styles.menuIcon}
                />
            </Pressable>
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
    menuButton: {
        padding: 8,
        marginLeft: 8,
    },
    menuButtonPressed: {
        opacity: 0.6,
    },
    menuIcon: {
        opacity: 0.7,
    },
});
