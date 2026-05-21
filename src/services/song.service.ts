import type { Song, SongListSource, SongListType } from '../types';
import type { SongDto } from '../types/song.types';
import {
    getNewSongs as fetchNewSongDtos,
    getSongsFromEndpoint as fetchSongDtosFromEndpoint,
    searchSongs as fetchSearchSongDtos,
} from './songs.service';
import { getLikedSongs as fetchLikedSongDtos } from './users.service';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';

export function mapSongDtoToSong(song: SongDto): Song {
    const artists = Array.isArray(song.artists)
        ? song.artists.join(', ')
        : song.artists;

    return {
        id: song.id,
        title: song.title || song.name || 'Untitled Song',
        artist: song.artist || artists || 'Unknown Artist',
        image: song.thumbnail_url || song.thumbnail || song.image || FALLBACK_IMAGE,
        duration: song.duration,
        audioUrl: song.audio_url || song.audioUrl,
        streamUrl: song.streamUrl,
    };
}

export async function getNewSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 20 });
    return songs.map(mapSongDtoToSong);
}

export async function getTrendingSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 20 });
    return songs.map(mapSongDtoToSong);
}

export async function getContinueListeningSongs(): Promise<Song[]> {
    const songs = await fetchLikedSongDtos(20);
    return songs.map(mapSongDtoToSong);
}

export async function getRecommendedSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 20 });
    return songs.map(mapSongDtoToSong);
}

export async function getLikedSongs(): Promise<Song[]> {
    const songs = await fetchLikedSongDtos(20);
    return songs.map(mapSongDtoToSong);
}

export async function getAllSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 50 });
    return songs.map(mapSongDtoToSong);
}

export async function getSongsByType(type: SongListType): Promise<Song[]> {
    switch (type) {
        case 'new':
            return getNewSongs();
        case 'trending':
            return getTrendingSongs();
        case 'continueListening':
            return getContinueListeningSongs();
        case 'recommended':
            return getRecommendedSongs();
        case 'all':
        default:
            return getAllSongs();
    }
}

export async function getSongsBySource(source: SongListSource, limit = 50): Promise<Song[]> {
    if (source.endpoint) {
        const songs = await fetchSongDtosFromEndpoint(source.endpoint, limit);
        return songs.map(mapSongDtoToSong);
    }

    switch (source.sourceType) {
        case 'new':
        case 'trending':
        case 'continueListening':
        case 'recommended':
        case 'all':
            return getSongsByType(source.sourceType);
        case 'liked':
            return getLikedSongs();
        case 'search': {
            const songs = await fetchSearchSongDtos({ q: source.query ?? '', limit });
            return songs.map(mapSongDtoToSong);
        }
        case 'genre':
        case 'section': {
            const query = source.query ?? source.sectionId ?? '';
            const songs = query
                ? await fetchSearchSongDtos({ q: query, limit })
                : await fetchNewSongDtos({ limit });
            return songs.map(mapSongDtoToSong);
        }
        default:
            return getAllSongs();
    }
}
