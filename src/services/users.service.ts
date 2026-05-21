import api from './api';
import type {
    SetPreferencesDto,
    UpdatePreferencesDto,
    UpdateProfileDto,
    UserProfileDto,
} from '../types/auth.types';
import type { SongDto } from '../types/song.types';

export type LikeSongPayload = {
    songId: string;
};

function unwrapResponseData<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: T }).data;
    }

    return data as T;
}

export async function getMe(): Promise<UserProfileDto> {
    const response = await api.get('/users/me');
    return unwrapResponseData<UserProfileDto>(response.data);
}

export async function updateMe(payload: UpdateProfileDto): Promise<UserProfileDto> {
    const response = await api.put('/users/me', payload);
    return unwrapResponseData<UserProfileDto>(response.data);
}

export async function setPreferences(payload: SetPreferencesDto): Promise<void> {
    await api.post('/users/preferences', payload);
}

export async function updatePreferences(payload: UpdatePreferencesDto): Promise<void> {
    await api.put('/users/preferences', payload);
}

export async function getLikedSongs(limit = 20, page = 1): Promise<SongDto[]> {
    const response = await api.get('/users/liked', {
        params: { page, limit },
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function likeSong(payload: LikeSongPayload): Promise<void> {
    await api.post('/users/liked', payload);
}

export async function unlikeSong(songId: string): Promise<void> {
    await api.delete(`/users/liked/${songId}`);
}
