import type { Artist } from "../types";
import type { SongDto } from "../types/song.types";
import api from "./api";
import { mapArtistDtoToArtist, type ArtistDto } from "./artists.service";

export interface SearchResultDto {
    songs: SongDto[];
    artists: Artist[];
}

function unwrapResponseData<T>(data: unknown): T {
    if (!data || typeof data !== "object") {
        return data as T;
    }

    if ("data" in data) {
        return (data as { data: T }).data;
    }

    return data as T;
}

export async function searchMusic(query: string, limit = 20): Promise<SearchResultDto> {
    const response = await api.get("/search", {
        params: { q: query, limit },
    });
    const result = unwrapResponseData<{ songs?: SongDto[]; artists?: ArtistDto[] }>(response.data);

    return {
        songs: result.songs ?? [],
        artists: (result.artists ?? []).map(mapArtistDtoToArtist),
    };
}
