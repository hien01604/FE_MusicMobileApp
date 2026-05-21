import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Song } from '../../../types';

type LibrarySongItemProps = {
    song: Song;
    isPlaying?: boolean;
    onPress: (song: Song) => void;
    onMenuPress: (song: Song) => void;
};

const LibrarySongItemComponent = ({
    song,
    isPlaying = false,
    onPress,
    onMenuPress,
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

            <Pressable
                hitSlop={10}
                style={({ pressed }) => [
                    styles.menuButton,
                    pressed && styles.menuButtonPressed,
                ]}
                onPress={(event) => {
                    event.stopPropagation();
                    onMenuPress(song);
                }}
            >
                <MaterialIcons name="more-vert" size={20} color="#FFFFFF" />
            </Pressable>
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
    menuButton: {
        padding: 8,
        marginLeft: 8,
    },
    menuButtonPressed: {
        opacity: 0.6,
    },
});