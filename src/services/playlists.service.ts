import api from './api';
import type { Playlist } from '../types';
import type { SongDto } from '../types/song.types';
import { mapSongDtoToSong } from './song.service';

function unwrapResponseData<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: T }).data;
    }

    return data as T;
}

function normalizePlaylist(data: unknown, fallbackName?: string): Playlist {
    const unwrapped = unwrapResponseData<unknown>(data);
    const playlist =
        unwrapped && typeof unwrapped === 'object' && 'playlist' in unwrapped
            ? (unwrapped as { playlist: unknown }).playlist
            : unwrapped;

    if (!playlist || typeof playlist !== 'object') {
        throw new Error('Invalid playlist response from server');
    }

    const raw = playlist as Record<string, unknown>;

    return {
        ...(raw as unknown as Playlist),
        name:
            typeof raw.name === 'string'
                ? raw.name
                : typeof raw.title === 'string'
                  ? raw.title
                  : fallbackName ?? 'Untitled playlist',
        createdAt:
            typeof raw.createdAt === 'string'
                ? raw.createdAt
                : typeof raw.created_at === 'string'
                  ? raw.created_at
                  : undefined,
    };
}

function normalizePlaylistSong(data: unknown) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    const raw = data as Record<string, unknown>;
    const song = raw.song && typeof raw.song === 'object' ? raw.song : raw;

    return mapSongDtoToSong(song as SongDto);
}

function normalizePlaylistDetail(data: unknown): Playlist {
    const playlist = normalizePlaylist(data);
    const raw = (unwrapResponseData<unknown>(data) ?? {}) as Record<string, unknown>;
    const detail =
        raw && typeof raw === 'object' && 'playlist' in raw
            ? ((raw as { playlist: unknown }).playlist as Record<string, unknown>)
            : raw;

    const songs = Array.isArray(detail.songs)
        ? detail.songs.map(normalizePlaylistSong).filter((song) => Boolean(song))
        : [];

    return {
        ...playlist,
        songs: songs.map((song) => ({ ...song, isInPlaylist: true })) as Playlist['songs'],
        songCount: playlist.songCount ?? songs.length,
        thumbnail: playlist.thumbnail ?? songs[0]?.image,
    };
}

export async function getPlaylists(): Promise<Playlist[]> {
    const response = await api.get('/playlists');
    const data = unwrapResponseData<unknown>(response.data);

    const hydratePlaylist = async (playlist: Playlist) => {
        if (playlist.songCount !== undefined && playlist.songs) {
            return playlist;
        }

        try {
            return await getPlaylistById(playlist.id);
        } catch {
            return playlist;
        }
    };

    const hydratePlaylists = (playlists: Playlist[]) => Promise.all(playlists.map(hydratePlaylist));

    if (Array.isArray(data)) {
        return hydratePlaylists(data.map((playlist) => normalizePlaylist(playlist)));
    }

    if (data && typeof data === 'object' && 'playlists' in data) {
        return hydratePlaylists(
            ((data as { playlists: unknown[] }).playlists ?? []).map((playlist) =>
                normalizePlaylist(playlist)
            )
        );
    }

    return [];
}

export async function createPlaylist(name: string): Promise<Playlist> {
    const response = await api.post('/playlists', { name });
    return normalizePlaylist(response.data, name);
}

export async function updatePlaylist(playlistId: string, name: string): Promise<Playlist> {
    const response = await api.patch(`/playlists/${playlistId}`, { name });
    return normalizePlaylist(response.data, name);
}

export async function deletePlaylist(playlistId: string): Promise<void> {
    await api.delete(`/playlists/${playlistId}`);
}

export async function addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    await api.post(`/playlists/${playlistId}/songs`, { songId });
}

export async function removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`);
}

export async function getPlaylistIdsContainingSong(songId: string): Promise<string[]> {
    const playlists = await getPlaylists();

    return playlists
        .filter((playlist) => playlist.songs?.some((song) => song.id === songId))
        .map((playlist) => playlist.id);
}

export async function removeSongFromAllPlaylists(songId: string): Promise<string[]> {
    const playlistIds = await getPlaylistIdsContainingSong(songId);

    await Promise.all(
        playlistIds.map((playlistId) => removeSongFromPlaylist(playlistId, songId))
    );

    return playlistIds;
}

export async function getPlaylistById(playlistId: string): Promise<Playlist> {
    const response = await api.get(`/playlists/${playlistId}`);
    return normalizePlaylistDetail(response.data);
}
