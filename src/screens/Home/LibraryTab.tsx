import React, { memo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { newReleases, trendingSongs } from '../../data/homeData';
import type { Song } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

const LIBRARY_SONGS: Song[] = [...newReleases, ...trendingSongs].filter(
    (item, index, arr) => arr.findIndex((song) => song.id === item.id) === index
);

const LibraryTabComponent = () => {
    const navigation = useNavigation<any>();
    const playSong = usePlayerStore((state) => state.playSong);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    return (
        <FlatList
            data={LIBRARY_SONGS}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
                <Pressable
                    style={styles.card}
                    onPress={() => {
                        void playSong(item);
                        navigation.navigate('Player');
                    }}
                >
                    <Image source={{ uri: item.image }} style={styles.cover} />
                    <View style={styles.textContent}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.artist}</Text>
                    </View>

                    {currentSong?.id === item.id && isPlaying && (
                        <Text style={styles.badge}>Playing</Text>
                    )}
                </Pressable>
            )}
        />
    );
};

export const LibraryTab = memo(LibraryTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
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
});
