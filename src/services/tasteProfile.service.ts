import { getFollowedArtists } from './followedArtists.storage';
import { getStoredPreferences } from './preferences.storage';
import { getLikedSongs, getListeningHistory } from './users.service';
import { mapSongDtoToSong } from './song.service';

export type TasteProfile = {
    likedSongsCount: number;
    topArtists: string[];
    topGenres: string[];
};

function topLabelsFromCounts(counts: Map<string, number>, limit: number): string[] {
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([label]) => label);
}

export async function getTasteProfile(): Promise<TasteProfile> {
    const [likedSongs, history, followedArtists, preferences] = await Promise.all([
        getLikedSongs(200).catch(() => []),
        getListeningHistory(100).catch(() => []),
        getFollowedArtists().catch(() => []),
        getStoredPreferences(),
    ]);

    const artistCounts = new Map<string, number>();

    history.forEach((item) => {
        const songDto = item.song;
        if (!songDto) {
            return;
        }

        const song = mapSongDtoToSong(songDto);
        if (song.artist && song.artist !== 'Unknown Artist') {
            artistCounts.set(song.artist, (artistCounts.get(song.artist) ?? 0) + 1);
        }
    });

    const topArtists = [
        ...topLabelsFromCounts(artistCounts, 3),
        ...followedArtists.map((artist) => artist.name),
        ...preferences.artists.map((artist) => artist.label),
    ].filter((artist, index, artists) => artist && artists.indexOf(artist) === index);

    return {
        likedSongsCount: likedSongs.length,
        topArtists: topArtists.slice(0, 3),
        topGenres: preferences.genres.map((genre) => genre.label).slice(0, 3),
    };
}
