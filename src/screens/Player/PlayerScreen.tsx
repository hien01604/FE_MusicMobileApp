import React from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../components/common/Layout';
import { newReleases, trendingSongs } from '../../data/homeData';
import { Song } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

const songQueue: Song[] = [...newReleases, ...trendingSongs].filter(
    (item, index, arr) => arr.findIndex((s) => s.id === item.id) === index
);

export default function PlayerScreen() {
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const playSong = usePlayerStore((state) => state.playSong);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);

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
                <Text style={styles.header}>Now Playing</Text>

                {currentSong ? (
                    <View style={styles.currentSongCard}>
                        <Image source={{ uri: currentSong.image }} style={styles.cover} />
                        <Text style={styles.title}>{currentSong.title}</Text>
                        <Text style={styles.artist}>{currentSong.artist}</Text>

                        <Pressable onPress={onTogglePlay} style={styles.mainControlButton}>
                            <MaterialIcons
                                name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                                size={56}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>Select a song to start playback</Text>
                    </View>
                )}

                <Text style={styles.queueTitle}>Song List</Text>
                <FlatList
                    data={songQueue}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.queueContent}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.queueItem}
                            onPress={() => {
                                void playSong(item);
                            }}
                        >
                            <Image source={{ uri: item.image }} style={styles.queueImage} />
                            <View style={styles.queueInfo}>
                                <Text style={styles.queueItemTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={styles.queueItemArtist} numberOfLines={1}>
                                    {item.artist}
                                </Text>
                            </View>
                            {currentSong?.id === item.id && isPlaying && (
                                <MaterialIcons name="graphic-eq" size={20} color="#FF4D6D" />
                            )}
                        </Pressable>
                    )}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 6,
    },
    header: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
    },
    currentSongCard: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(16, 22, 45, 0.72)',
        padding: 16,
        alignItems: 'center',
    },
    cover: {
        width: 180,
        height: 180,
        borderRadius: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 14,
    },
    artist: {
        color: '#B8C6E8',
        fontSize: 14,
        marginTop: 4,
    },
    mainControlButton: {
        marginTop: 10,
    },
    emptyCard: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(16, 22, 45, 0.72)',
        padding: 18,
    },
    emptyText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    queueTitle: {
        marginTop: 18,
        marginBottom: 10,
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    queueContent: {
        paddingBottom: 140,
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(17, 20, 38, 0.8)',
    },
    queueImage: {
        width: 46,
        height: 46,
        borderRadius: 8,
    },
    queueInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    queueItemTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    queueItemArtist: {
        marginTop: 2,
        color: '#AEC0EA',
        fontSize: 12,
    },
});
