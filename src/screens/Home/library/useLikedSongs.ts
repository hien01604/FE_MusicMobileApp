import { useCallback, useEffect, useState } from 'react';
import type { Song } from '../../../types';
import { mapSongDtoToSong } from '../../../services/song.service';
import { getLikedSongs } from '../../../services/users.service';

type UseLikedSongsResult = {
    songs: Song[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    removeSong: (songId: string) => void;
};

export function useLikedSongs(limit = 50): UseLikedSongsResult {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSongs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getLikedSongs(limit);
            setSongs(result.map(mapSongDtoToSong));
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

    const removeSong = useCallback((songId: string) => {
        setSongs((current) => current.filter((song) => song.id !== songId));
    }, []);

    return {
        songs,
        loading,
        error,
        refresh: loadSongs,
        removeSong,
    };
}