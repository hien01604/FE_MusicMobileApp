import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Artist } from '../types';
import { getFollowedArtistsFromApi } from './artists.service';

const FOLLOWED_ARTISTS_KEY = 'followedArtists';
const UNFOLLOWED_ARTISTS_KEY = 'unfollowedArtists';

async function getUnfollowedArtistIds(): Promise<Set<string>> {
    const raw = await AsyncStorage.getItem(UNFOLLOWED_ARTISTS_KEY);

    if (!raw) {
        return new Set();
    }

    try {
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
    } catch {
        return new Set();
    }
}

async function saveUnfollowedArtistIds(ids: Set<string>): Promise<void> {
    await AsyncStorage.setItem(UNFOLLOWED_ARTISTS_KEY, JSON.stringify(Array.from(ids)));
}

export async function getStoredFollowedArtists(): Promise<Artist[]> {
    const raw = await AsyncStorage.getItem(FOLLOWED_ARTISTS_KEY);

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function dedupeArtists(artists: Artist[]): Artist[] {
    const seen = new Set<string>();
    const merged: Artist[] = [];

    artists.forEach((artist) => {
        if (!artist.id || seen.has(artist.id)) {
            return;
        }

        seen.add(artist.id);
        merged.push(artist);
    });

    return merged;
}

export async function getFollowedArtists(): Promise<Artist[]> {
    try {
        const artists = dedupeArtists(await getFollowedArtistsFromApi());
        await AsyncStorage.setItem(FOLLOWED_ARTISTS_KEY, JSON.stringify(artists));
        return artists;
    } catch {
        return getStoredFollowedArtists();
    }
}

export async function saveFollowedArtist(artist: Artist): Promise<Artist[]> {
    const unfollowedArtistIds = await getUnfollowedArtistIds();
    unfollowedArtistIds.delete(artist.id);

    const current = await getStoredFollowedArtists();
    const next = [artist, ...current.filter((item) => item.id !== artist.id)];
    await Promise.all([
        AsyncStorage.setItem(FOLLOWED_ARTISTS_KEY, JSON.stringify(next)),
        saveUnfollowedArtistIds(unfollowedArtistIds),
    ]);
    return next;
}

export async function removeFollowedArtist(artistId: string): Promise<Artist[]> {
    const unfollowedArtistIds = await getUnfollowedArtistIds();
    unfollowedArtistIds.add(artistId);

    const current = await getStoredFollowedArtists();
    const next = current.filter((item) => item.id !== artistId);
    await Promise.all([
        AsyncStorage.setItem(FOLLOWED_ARTISTS_KEY, JSON.stringify(next)),
        saveUnfollowedArtistIds(unfollowedArtistIds),
    ]);
    return next;
}

export async function isArtistFollowed(artistId: string): Promise<boolean> {
    const artists = await getFollowedArtists();
    return artists.some((artist) => artist.id === artistId);
}
