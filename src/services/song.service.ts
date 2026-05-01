import type { Song } from '../types';
import {
    allSongs,
    continueListeningSongs,
    newSongs,
    recommendedSongs,
    trendingSongs,
    type SongListType,
} from '../data/songLibraryData';

const simulateApi = async <T,>(result: T): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return result;
};

export async function getNewSongs(): Promise<Song[]> {
    return simulateApi(newSongs);
}

export async function getTrendingSongs(): Promise<Song[]> {
    return simulateApi(trendingSongs);
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
