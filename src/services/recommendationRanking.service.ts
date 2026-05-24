import type { Song } from '../types';
import { getStoredPreferences } from './preferences.storage';

type RankSongsOptions = {
    historySongs?: Song[];
};

function countById(values: Array<string | undefined>): Map<string, number> {
    const counts = new Map<string, number>();

    values.forEach((value) => {
        if (!value) {
            return;
        }

        counts.set(value, (counts.get(value) ?? 0) + 1);
    });

    return counts;
}

function scoreSong(
    song: Song,
    artistIds: Set<string>,
    genreIds: Set<string>,
    historyArtistCounts: Map<string, number>,
    historyGenreCounts: Map<string, number>
): number {
    let score = 0;

    if (song.artistId && artistIds.has(song.artistId)) {
        score += 100;
    }

    if (song.genreId && genreIds.has(song.genreId)) {
        score += 40;
    }

    if (song.artistId) {
        score += Math.min(historyArtistCounts.get(song.artistId) ?? 0, 5) * 16;
    }

    if (song.genreId) {
        score += Math.min(historyGenreCounts.get(song.genreId) ?? 0, 5) * 8;
    }

    return score;
}

export async function rankSongsByStoredPreferences(
    songs: Song[],
    options: RankSongsOptions = {}
): Promise<Song[]> {
    const preferences = await getStoredPreferences();
    const artistIds = new Set(preferences.artists.map((artist) => artist.id));
    const genreIds = new Set(preferences.genres.map((genre) => genre.id));
    const historySongs = options.historySongs ?? [];
    const historyArtistCounts = countById(historySongs.map((song) => song.artistId));
    const historyGenreCounts = countById(historySongs.map((song) => song.genreId));

    if (
        artistIds.size === 0 &&
        genreIds.size === 0 &&
        historyArtistCounts.size === 0 &&
        historyGenreCounts.size === 0
    ) {
        return songs;
    }

    return songs
        .map((song, index) => ({
            song,
            index,
            score: scoreSong(
                song,
                artistIds,
                genreIds,
                historyArtistCounts,
                historyGenreCounts
            ),
        }))
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .map((item) => item.song);
}
