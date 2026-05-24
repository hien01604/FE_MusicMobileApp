import type { Artist } from "../types";
import type { SongDto } from "../types/song.types";
import { getPopularArtists } from "./artist.service";
import { searchSongs } from "./songs.service";

export interface SearchResultDto {
    songs: SongDto[];
    artists: Artist[];
}

export async function searchMusic(query: string, limit = 20): Promise<SearchResultDto> {
    const [songs, artists] = await Promise.all([
        searchSongs({ q: query, limit }),
        getPopularArtists(limit, query),
    ]);

    return {
        songs,
        artists,
    };
}
