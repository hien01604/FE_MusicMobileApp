import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlayerStore } from '../../store/playerStore';

type MiniPlayerProps = {
    onOpenPlayer: () => void;
};

export default function MiniPlayer({ onOpenPlayer }: MiniPlayerProps) {
    const insets = useSafeAreaInsets();
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const pause = usePlayerStore((state) => state.pause);
    const resume = usePlayerStore((state) => state.resume);

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

    return (
        <View style={[styles.wrapper, { bottom: insets.bottom + 8 }]} pointerEvents="box-none">
            <View style={styles.container}>
                <Pressable style={styles.infoArea} onPress={onOpenPlayer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {currentSong.title}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {currentSong.artist}
                    </Text>
                </Pressable>

                <Pressable style={styles.playButton} onPress={onTogglePlay}>
                    <MaterialIcons
                        name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                        size={32}
                        color="#FFFFFF"
                    />
                </Pressable>
            </View>
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
        borderRadius: 14,
        backgroundColor: 'rgba(16, 22, 45, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        minHeight: 64,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoArea: {
        flex: 1,
        paddingVertical: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 2,
        color: '#B8C6E8',
        fontSize: 12,
    },
    playButton: {
        marginLeft: 12,
    },
});
