import type { Artist } from '../types';

type ArtistFollowListener = (artists: Artist[]) => void;

const listeners = new Set<ArtistFollowListener>();

export function publishFollowedArtistsChange(artists: Artist[]): void {
    listeners.forEach((listener) => listener(artists));
}

export function subscribeFollowedArtists(listener: ArtistFollowListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
