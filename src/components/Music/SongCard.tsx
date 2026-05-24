import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Song } from '../../types/index';

interface Props {
    item: Song;
    onPress?: () => void;
    onToggleLike?: (item: Song) => void;
    onAddToPlaylist?: (item: Song) => void;
}

export const SongCard = ({ item, onPress, onToggleLike, onAddToPlaylist }: Props) => (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.coverWrap}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.badges}>
                <TouchableOpacity
                    activeOpacity={0.75}
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onToggleLike?.(item);
                    }}
                >
                    <MaterialIcons
                        name={item.isLiked ? 'favorite' : 'favorite-border'}
                        size={18}
                        color={item.isLiked ? '#FF4D6D' : 'rgba(255,255,255,0.72)'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.75}
                    hitSlop={8}
                    onPress={(event) => {
                        event.stopPropagation();
                        onAddToPlaylist?.(item);
                    }}
                >
                    <MaterialIcons
                        name="playlist-add"
                        size={18}
                        color={item.isInPlaylist ? '#7CF7B0' : 'rgba(255,255,255,0.72)'}
                    />
                </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { marginRight: 16, width: 140 },
    coverWrap: { marginBottom: 8, position: 'relative' },
    image: { width: 140, height: 140, borderRadius: 12 },
    badges: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(10,12,24,0.42)',
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    title: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    artist: { color: '#aaa', fontSize: 12 },
});
