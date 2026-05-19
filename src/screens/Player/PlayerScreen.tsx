import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../components/common/Layout';
import { usePlayerStore } from '../../store/playerStore';

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
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);
    const durationLabel = formatDuration(currentSong?.duration);

    const onTogglePlay = () => {
        if (isPlaying) {
            void pause();
            return;
        }

        if (currentSong) {
            void resume();
        }
    };

    const optionItems = [
        { id: 'playlist', label: 'Add to Playlist', icon: 'playlist-add' },
        { id: 'liked', label: 'Add to Liked Songs', icon: 'favorite' },
        { id: 'queue', label: 'Add to Queue', icon: 'queue-music' },
        { id: 'artist', label: 'View Artist', icon: 'person' },
        { id: 'lyrics', label: 'View Lyrics', icon: 'notes' },
    ] as const;

    return (
        <Layout>
            <View style={styles.container}>
                <Text style={styles.screenTitle}>Now Playing</Text>

                <View style={styles.playerCard}>
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

                    {currentSong ? (
                        <>
                            <ImageBackground
                                source={{ uri: currentSong.image }}
                                style={styles.hero}
                                imageStyle={styles.heroImage}
                                blurRadius={1}
                            >
                                <LinearGradient
                                    colors={[
                                        'rgba(15, 22, 54, 0.04)',
                                        'rgba(12, 17, 44, 0.28)',
                                        'rgba(7, 11, 35, 0.94)',
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
                </View>

                <Modal
                    transparent
                    visible={isOptionsVisible}
                    animationType="fade"
                    onRequestClose={() => setIsOptionsVisible(false)}
                >
                    <Pressable
                        style={styles.optionsOverlay}
                        onPress={() => setIsOptionsVisible(false)}
                    >
                        <Pressable style={styles.optionsSheet}>
                            <Text style={styles.optionsTitle}>More Options</Text>

                            {currentSong && (
                                <View style={styles.optionsSongRow}>
                                    <Image
                                        source={{ uri: currentSong.image }}
                                        style={styles.optionsCover}
                                    />
                                    <View style={styles.optionsSongInfo}>
                                        <Text style={styles.optionsSongTitle} numberOfLines={1}>
                                            {currentSong.title}
                                        </Text>
                                        <Text style={styles.optionsSongArtist} numberOfLines={1}>
                                            {currentSong.artist}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.optionList}>
                                {optionItems.map((item) => (
                                    <Pressable
                                        key={item.id}
                                        style={({ pressed }) => [
                                            styles.optionItem,
                                            pressed && styles.optionItemPressed,
                                        ]}
                                        onPress={() => setIsOptionsVisible(false)}
                                    >
                                        <MaterialIcons
                                            name={item.icon}
                                            size={18}
                                            color="#FF6F91"
                                        />
                                        <Text style={styles.optionText}>{item.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
    },
    screenTitle: {
        color: 'rgba(255, 255, 255, 0.82)',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    playerCard: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: 18,
        backgroundColor: '#071139',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
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
    iconButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hero: {
        height: '63%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 26,
        backgroundColor: '#11182F',
    },
    heroImage: {
        resizeMode: 'cover',
    },
    discShadow: {
        width: 172,
        height: 172,
        borderRadius: 86,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 91, 126, 0.82)',
        shadowColor: '#000000',
        shadowOpacity: 0.38,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    disc: {
        width: 154,
        height: 154,
        borderRadius: 77,
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
        marginTop: -2,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
        textAlign: 'center',
    },
    artist: {
        color: '#9EA8CB',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 5,
        textAlign: 'center',
    },
    progressSection: {
        marginTop: 28,
        paddingHorizontal: 22,
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
        backgroundColor: '#FF5D79',
    },
    progressKnob: {
        position: 'absolute',
        left: '15%',
        top: -3,
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#FF5D79',
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
        marginTop: 18,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        backgroundColor: '#FF7891',
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
    optionsOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        paddingBottom: 30,
        backgroundColor: 'rgba(4, 7, 24, 0.2)',
    },
    optionsSheet: {
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: 'rgba(70, 20, 72, 0.96)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    optionsTitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 8,
    },
    optionsSongRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingBottom: 10,
    },
    optionsCover: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    optionsSongInfo: {
        flex: 1,
        marginLeft: 10,
    },
    optionsSongTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    optionsSongArtist: {
        color: '#C9A4C9',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    optionList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    optionItem: {
        minHeight: 36,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    },
    optionItemPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 12,
    },
});
