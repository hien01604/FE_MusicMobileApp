import type { Song } from '../types';
import type { SongDto } from '../types/song.types';
import {
    allSongs,
    continueListeningSongs,
    newSongs,
    recommendedSongs,
    trendingSongs,
    type SongListType,
} from '../data/songLibraryData';
import { getNewSongs as fetchNewSongDtos } from './songs.service';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';

export function mapSongDtoToSong(song: SongDto): Song {
    const artists = Array.isArray(song.artists)
        ? song.artists.join(', ')
        : song.artists;

    return {
        id: song.id,
        title: song.title || song.name || 'Untitled Song',
        artist: song.artist || artists || 'Unknown Artist',
        image: song.thumbnail || song.image || FALLBACK_IMAGE,
        duration: song.duration,
        audioUrl: song.audioUrl,
        streamUrl: song.streamUrl,
    };
}

const simulateApi = async <T,>(result: T): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return result;
};

export async function getNewSongs(): Promise<Song[]> {
    try {
        const songs = await fetchNewSongDtos(20);
        return songs.map(mapSongDtoToSong);
    } catch {
        return simulateApi(newSongs);
    }
}

export async function getTrendingSongs(): Promise<Song[]> {
    try {
        const songs = await fetchNewSongDtos(20);
        return songs.map(mapSongDtoToSong);
    } catch {
        return simulateApi(trendingSongs);
    }
}

export async function getContinueListeningSongs(): Promise<Song[]> {
    return simulateApi(continueListeningSongs);
}

export async function getRecommendedSongs(): Promise<Song[]> {
    return simulateApi(recommendedSongs);
}

export async function getAllSongs(): Promise<Song[]> {
    return simulateApi(allSongs);
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
