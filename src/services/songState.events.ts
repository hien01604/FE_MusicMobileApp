import type { Song } from '../types';

type SongPatchListener = (songId: string, patch: Partial<Song>) => void;

const listeners = new Set<SongPatchListener>();

export function publishSongPatch(songId: string, patch: Partial<Song>): void {
    listeners.forEach((listener) => listener(songId, patch));
}

export function subscribeSongPatches(listener: SongPatchListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
