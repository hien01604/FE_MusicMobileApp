import api from './api';
import { GENRE_OPTIONS, type PreferenceOption } from '../constants/preferences';

export interface GenreDto {
    id: string;
    name: string;
}

function unwrapResponseData<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
        return data as T;
    }

    if ('data' in data) {
        return unwrapResponseData<T>((data as { data: unknown }).data);
    }

    if ('value' in data) {
        return (data as { value: T }).value;
    }

    if ('genres' in data) {
        return (data as { genres: T }).genres;
    }

    if ('items' in data) {
        return (data as { items: T }).items;
    }

    return data as T;
}

export function mapGenreDtoToPreferenceOption(genre: GenreDto): PreferenceOption {
    return {
        id: genre.id,
        label: genre.name,
    };
}

export async function getGenres(): Promise<PreferenceOption[]> {
    try {
        const response = await api.get('/genres');
        const genres = unwrapResponseData<GenreDto[]>(response.data);

        if (!Array.isArray(genres)) {
            return GENRE_OPTIONS;
        }

        return genres.map(mapGenreDtoToPreferenceOption);
    } catch {
        return GENRE_OPTIONS;
    }
}
