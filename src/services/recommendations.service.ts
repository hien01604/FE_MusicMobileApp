import api from './api';
import type { SongDto } from '../types/song.types';

function unwrapResponseData<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
        return data as T;
    }

    if ('data' in data) {
        return (data as { data: T }).data;
    }

    if ('songs' in data) {
        return (data as { songs: T }).songs;
    }

    if ('value' in data) {
        return (data as { value: T }).value;
    }

    return data as T;
}

export async function getRecommendations(): Promise<SongDto[]> {
    const response = await api.get('/recommendations');
    const data = unwrapResponseData<unknown>(response.data);

    if (Array.isArray(data)) {
        return data as SongDto[];
    }

    if (data && typeof data === 'object' && 'songs' in data) {
        const songs = (data as { songs?: unknown }).songs;
        return Array.isArray(songs) ? (songs as SongDto[]) : [];
    }

    return [];
}
