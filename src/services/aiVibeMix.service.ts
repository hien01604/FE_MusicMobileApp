import api from './api';
import { applyLikedStatus, mapSongDtoToSong } from './song.service';
import type { Song } from '../types';
import type { SongDto } from '../types/song.types';

const AI_VIBEMIX_ENDPOINT =
    process.env.EXPO_PUBLIC_AI_VIBEMIX_ENDPOINT?.trim() || '/ai/vibemix';

export type AIVibeMixResult = {
    title: string;
    description?: string;
    songs: Song[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function unwrapData(data: unknown): unknown {
    if (isRecord(data) && 'data' in data) {
        return unwrapData(data.data);
    }

    return data;
}

function findSongs(value: unknown): SongDto[] {
    const data = unwrapData(value);

    if (Array.isArray(data)) {
        return data as SongDto[];
    }

    if (!isRecord(data)) {
        return [];
    }

    const directSongs = data.songs ?? data.tracks ?? data.items;
    if (Array.isArray(directSongs)) {
        return directSongs as SongDto[];
    }

    const playlist = data.playlist;
    if (isRecord(playlist)) {
        const playlistSongs = playlist.songs ?? playlist.tracks ?? playlist.items;
        return Array.isArray(playlistSongs) ? (playlistSongs as SongDto[]) : [];
    }

    return [];
}

function readPlaylistMeta(value: unknown, prompt: string): Pick<AIVibeMixResult, 'title' | 'description'> {
    const data = unwrapData(value);
    const playlist = isRecord(data) && isRecord(data.playlist) ? data.playlist : undefined;

    return {
        title:
            readString(playlist?.name) ??
            readString(playlist?.title) ??
            (isRecord(data) ? readString(data.name) ?? readString(data.title) : undefined) ??
            'Your VibeMix',
        description:
            readString(playlist?.description) ??
            (isRecord(data) ? readString(data.description) : undefined) ??
            prompt,
    };
}

export async function createAIVibeMix(prompt: string): Promise<AIVibeMixResult> {
    const response = await api.post(AI_VIBEMIX_ENDPOINT, { prompt });
    const songDtos = findSongs(response.data);
    const songs = await applyLikedStatus(songDtos.map(mapSongDtoToSong));

    return {
        ...readPlaylistMeta(response.data, prompt),
        songs,
    };
}
