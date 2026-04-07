import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Song } from '../../src/types/index';

interface Props {
    item: Song;
}

export const SongCard = ({ item }: Props) => (
    <TouchableOpacity style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { marginRight: 16, width: 140 },
    image: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
    title: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    artist: { color: '#aaa', fontSize: 12 },
});