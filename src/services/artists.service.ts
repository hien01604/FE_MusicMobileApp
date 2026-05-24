import type { Artist as OnboardingArtist } from '../types/artist.types';
import type { Artist } from '../types';
import type { SongDto } from '../types/song.types';
import api from './api';

export type SearchArtistsParams = {
    q: string;
    limit?: number;
};

export interface ArtistDto {
    id: string;
    name: string;
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    updated_at?: string;
    topTracks?: SongDto[];
}

export type ArtistWithTopTracksDto = ArtistDto & {
    topTracks: SongDto[];
};

const FALLBACK_ARTIST_IMAGE = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400';
const FOLLOWED_ARTISTS_ENDPOINT =
    process.env.EXPO_PUBLIC_FOLLOWED_ARTISTS_ENDPOINT?.trim() || '/artists/followed';

function unwrapResponseData<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
        return data as T;
    }

    if ('data' in data) {
        return (data as { data: T }).data;
    }

    if ('artists' in data) {
        return (data as { artists: T }).artists;
    }

    if ('followedArtists' in data) {
        return (data as { followedArtists: T }).followedArtists;
    }

    if ('value' in data) {
        return (data as { value: T }).value;
    }

    if ('items' in data) {
        return (data as { items: T }).items;
    }

    return data as T;
}

function getArtistImage(artist: ArtistDto): string {
    return artist.avatar_url || FALLBACK_ARTIST_IMAGE;
}

export function mapArtistDtoToArtist(artist: ArtistDto): Artist {
    return {
        id: artist.id,
        name: artist.name,
        image: getArtistImage(artist),
        bio: artist.bio,
    };
}

export function mapArtistDtoToOnboardingArtist(artist: ArtistDto): OnboardingArtist {
    return {
        id: artist.id,
        name: artist.name,
        imageUrl: getArtistImage(artist),
        bio: artist.bio,
    };
}

export async function searchArtists(params: SearchArtistsParams): Promise<ArtistDto[]> {
    const requestParams = {
        limit: params.limit,
        ...(params.q.trim() ? { q: params.q.trim() } : {}),
    };
    const response = await api.get('/artists', { params: requestParams });
    const artists = unwrapResponseData<ArtistDto[]>(response.data);
    return Array.isArray(artists) ? artists : [];
}

export async function getArtistById(id: string, limit = 10): Promise<ArtistWithTopTracksDto> {
    const response = await api.get(`/artists/${id}`, {
        params: { limit },
    });

    return unwrapResponseData<ArtistWithTopTracksDto>(response.data);
}

export async function getArtistTopTracks(id: string, limit = 20): Promise<SongDto[]> {
    const response = await api.get(`/artists/${id}/top-tracks`, {
        params: { limit },
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function followArtist(id: string): Promise<void> {
    await api.post(`/artists/${id}/follow`);
}

export async function unfollowArtist(id: string): Promise<void> {
    await api.delete(`/artists/${id}/follow`);
}

export async function getFollowedArtistsFromApi(): Promise<Artist[]> {
    const response = await api.get(FOLLOWED_ARTISTS_ENDPOINT);
    const artists = unwrapResponseData<ArtistDto[]>(response.data);

    return Array.isArray(artists) ? artists.map(mapArtistDtoToArtist) : [];
}

export async function getArtists(limit = 20, query = ''): Promise<OnboardingArtist[]> {
    const artists = await searchArtists({ q: query || 'a', limit });
    return artists.map(mapArtistDtoToOnboardingArtist);
}

export async function getPopularArtists(limit = 20, query = ''): Promise<Artist[]> {
    const artists = await searchArtists({ q: query || 'a', limit });
    return artists.map(mapArtistDtoToArtist);
}
