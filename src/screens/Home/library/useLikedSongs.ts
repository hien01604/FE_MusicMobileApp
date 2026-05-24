import { useCallback, useEffect, useState } from 'react';
import type { Song } from '../../../types';
import { getLikedSongs } from '../../../services/song.service';
import { subscribeSongPatches } from '../../../services/songState.events';

type UseLikedSongsResult = {
    songs: Song[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    removeSong: (songId: string) => void;
    updateSong: (songId: string, patch: Partial<Song>) => void;
};

export function useLikedSongs(limit = 50): UseLikedSongsResult {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSongs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setSongs(await getLikedSongs(limit));
        } catch {
            setSongs([]);
            setError('Could not load liked songs.');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        void loadSongs();
    }, [loadSongs]);

    useEffect(
        () =>
            subscribeSongPatches((songId, patch) => {
                setSongs((current) => {
                    if (patch.isLiked === false) {
                        return current.filter((song) => song.id !== songId);
                    }

                    return current.map((song) =>
                        song.id === songId ? { ...song, ...patch } : song
                    );
                });
            }),
        []
    );

    const removeSong = useCallback((songId: string) => {
        setSongs((current) => current.filter((song) => song.id !== songId));
    }, []);

    const updateSong = useCallback((songId: string, patch: Partial<Song>) => {
        setSongs((current) =>
            current.map((song) => (song.id === songId ? { ...song, ...patch } : song))
        );
    }, []);

    return {
        songs,
        loading,
        error,
        refresh: loadSongs,
        removeSong,
        updateSong,
    };
}
