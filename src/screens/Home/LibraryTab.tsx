import React, { memo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Song } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import SongOptionsModal from '../../components/Music/SongOptionsModal';
import { LibrarySongItem } from './library/LibrarySongItem';
import { useLikedSongs } from './library/useLikedSongs';

const LibraryTabComponent = () => {
    const navigation = useNavigation<any>();
    const playSong = usePlayerStore((state) => state.playSong);
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const { songs, error, loading, refresh, removeSong } = useLikedSongs(50);

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            refreshing={loading}
            onRefresh={() => {
                void refresh();
            }}
            renderItem={({ item }) => (
                <LibrarySongItem
                    song={item}
                    isPlaying={currentSong?.id === item.id && isPlaying}
                    onPress={(song) => {
                        void playSong(song);
                        navigation.navigate('Player', { songId: song.id });
                    }}
                    onMenuPress={setSelectedSong}
                />
            )}
            ListEmptyComponent={
                loading ? (
                    <ActivityIndicator size="small" color="#FF4D6D" />
                ) : (
                    <Text style={styles.emptyText}>
                        {error ?? 'No liked songs yet.'}
                    </Text>
                )
            }
            ListFooterComponent={
                <SongOptionsModal
                    visible={Boolean(selectedSong)}
                    song={selectedSong}
                    onClose={() => setSelectedSong(null)}
                    onSuccess={(message) => Alert.alert('Done', message)}
                    onError={(message) => Alert.alert('Error', message)}
                    isLiked
                    onLikedChange={(song, liked) => {
                        if (!liked) {
                            removeSong(song.id);
                        }
                    }}
                />
            }
        />
    );
};

export const LibraryTab = memo(LibraryTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    emptyText: {
        color: '#AEB8D8',
        textAlign: 'center',
        marginTop: 18,
    },
});
