import type { SongDto } from "../types/song.types";
import api from "./api";

export type SearchSongsParams = {
    q: string;
    limit?: number;
};

export type NewSongsParams = {
    limit?: number;
};

function unwrapResponseData<T>(data: unknown): T {
    if (data && typeof data === "object" && "data" in data) {
        return (data as { data: T }).data;
    }

    return data as T;
}

export async function searchSongs(params: SearchSongsParams): Promise<SongDto[]> {
    const response = await api.get("/songs", {
        params,
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function getNewSongs(params: NewSongsParams = {}): Promise<SongDto[]> {
    const response = await api.get("/songs/new", {
        params,
    });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function getSongsFromEndpoint(endpoint: string, limit = 20): Promise<SongDto[]> {
    if (!endpoint.startsWith("/") || endpoint.startsWith("//") || endpoint.includes("://")) {
        throw new Error("Song endpoint must be a relative API path");
    }

    const response = await api.get(endpoint, { params: { limit } });

    return unwrapResponseData<SongDto[]>(response.data);
}

export async function getSongById(id: string): Promise<SongDto> {
    const response = await api.get(`/songs/${id}`);

    return unwrapResponseData<SongDto>(response.data);
}
