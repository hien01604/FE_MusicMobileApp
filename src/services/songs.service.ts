import type { SongDto } from "../types/song.types";
import api from "./api";

function unwrapResponseData<T>(data: unknown): T {
    if (data && typeof data === "object" && "data" in data) {
        return (data as { data: T }).data;
    }

    return data as T;
}

export async function searchSongs(query: string, limit = 20): Promise<SongDto[]> {
    const response = await api.get("/songs", {
        params: { q: query, limit },
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function getNewSongs(limit = 20): Promise<SongDto[]> {
    const response = await api.get("/songs/new", {
        params: { limit },
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function getSongById(songId: string): Promise<SongDto> {
    const response = await api.get(`/songs/${songId}`);

    return unwrapResponseData<SongDto>(response.data);
}
