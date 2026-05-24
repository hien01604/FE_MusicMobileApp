import type { Song, SongListSource, SongListType } from '../types';
import type { SongDto } from '../types/song.types';
import api from './api';
import {
    getNewSongs as fetchNewSongDtos,
    getSongsFromEndpoint as fetchSongDtosFromEndpoint,
    searchSongs as fetchSearchSongDtos,
} from './songs.service';
import { getRecommendations as fetchRecommendationDtos } from './recommendations.service';
import { rankSongsByStoredPreferences } from './recommendationRanking.service';
import {
    getLikedSongs as fetchLikedSongDtos,
    getListeningHistory as fetchListeningHistory,
} from './users.service';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readString(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

function readArtistName(value: unknown): string | null {
    const directName = readString(value);
    if (directName) {
        return directName;
    }

    if (!isRecord(value)) {
        return null;
    }

    return (
        readString(value.name) ??
        readString(value.artist_name) ??
        readString(value.artistName) ??
        readArtistName(value.artist)
    );
}

function readArtistNames(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map(readArtistName).filter((name): name is string => Boolean(name));
    }

    const artistName = readArtistName(value);
    return artistName ? [artistName] : [];
}

function getArtistName(song: SongDto): string {
    const rawSong = song as Record<string, unknown>;

    const artists = [
        ...readArtistNames(rawSong.artist),
        ...readArtistNames(rawSong.artist_name),
        ...readArtistNames(rawSong.artistName),
        ...readArtistNames(rawSong.artists),
        ...readArtistNames(rawSong.song_artists),
    ];

    return artists.length > 0 ? Array.from(new Set(artists)).join(', ') : 'Unknown Artist';
}

function getArtistId(song: SongDto): string | undefined {
    if (typeof song.artist_id === 'string') {
        return song.artist_id;
    }

    const rawSong = song as Record<string, unknown>;
    const rawArtist = rawSong.artist;

    if (isRecord(rawArtist)) {
        return readString(rawArtist.id) ?? undefined;
    }

    return undefined;
}

export function mapSongDtoToSong(song: SongDto): Song {
    return {
        id: song.id,
        title: song.title || song.name || 'Untitled Song',
        artist: getArtistName(song),
        artistId: getArtistId(song),
        genreId: typeof song.genre_id === 'string' ? song.genre_id : undefined,
        image: song.thumbnail_url || song.thumbnail || song.image || FALLBACK_IMAGE,
        duration: song.duration,
        audioUrl: song.audio_url || song.audioUrl,
        streamUrl: song.streamUrl,
        releaseDate: song.release_date,
        createdAt: song.created_at,
        updatedAt: song.updated_at,
        playCount:
            readNumber(song.playCount) ??
            readNumber(song.play_count) ??
            readNumber(song.listenCount) ??
            readNumber(song.listen_count),
        isLiked: Boolean(song.isLiked ?? song.is_liked ?? song.liked),
        isInPlaylist: Boolean(song.isInPlaylist ?? song.is_in_playlist ?? song.inPlaylist),
    };
}

export async function applyLikedStatus(songs: Song[]): Promise<Song[]> {
    if (songs.length === 0) {
        return songs;
    }

    const songIds = new Set(songs.map((song) => song.id));

    try {
        const [likedSongs, playlistSongIds] = await Promise.all([
            fetchLikedSongDtos(200),
            getPlaylistSongIds(songIds),
        ]);
        const likedIds = new Set(likedSongs.map((song) => song.id));

        return songs.map((song) => ({
            ...song,
            isLiked: song.isLiked || likedIds.has(song.id),
            isInPlaylist: song.isInPlaylist || playlistSongIds.has(song.id),
        }));
    } catch {
        return songs;
    }
}

async function getPlaylistSongIds(targetSongIds: Set<string>): Promise<Set<string>> {
    const playlistIds = await getPlaylistIds();
    const matchedSongIds = new Set<string>();

    await Promise.all(
        playlistIds.map(async (playlistId) => {
            try {
                const response = await api.get(`/playlists/${playlistId}`);
                const playlist = unwrapPlaylist(response.data);
                const songs = Array.isArray(playlist.songs) ? playlist.songs : [];

                songs.forEach((rawSong) => {
                    const songId =
                        rawSong && typeof rawSong === 'object'
                            ? String(
                                  (rawSong as Record<string, unknown>).id ??
                                      ((rawSong as Record<string, unknown>).song as
                                          | Record<string, unknown>
                                          | undefined)?.id ??
                                      ''
                              )
                            : '';

                    if (targetSongIds.has(songId)) {
                        matchedSongIds.add(songId);
                    }
                });
            } catch {
                // Keep song loading resilient if one playlist detail fails.
            }
        })
    );

    return matchedSongIds;
}

async function getPlaylistIds(): Promise<string[]> {
    const response = await api.get('/playlists');
    const data = unwrapResponse(response.data);
    const playlists = Array.isArray(data)
        ? data
        : data && typeof data === 'object' && 'playlists' in data
          ? ((data as { playlists?: unknown[] }).playlists ?? [])
          : [];

    return playlists
        .map((playlist) =>
            playlist && typeof playlist === 'object'
                ? String((playlist as Record<string, unknown>).id ?? '')
                : ''
        )
        .filter(Boolean);
}

function unwrapResponse(data: unknown): unknown {
    if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: unknown }).data;
    }

    return data;
}

function unwrapPlaylist(data: unknown): Record<string, unknown> {
    const unwrapped = unwrapResponse(data);

    if (unwrapped && typeof unwrapped === 'object' && 'playlist' in unwrapped) {
        return ((unwrapped as { playlist: unknown }).playlist ?? {}) as Record<string, unknown>;
    }

    return (unwrapped ?? {}) as Record<string, unknown>;
}

function dedupeSongsById(songs: Song[]): Song[] {
    const seenSongIds = new Set<string>();

    return songs.filter((song) => {
        if (seenSongIds.has(song.id)) {
            return false;
        }

        seenSongIds.add(song.id);
        return true;
    });
}

function getSongTimestamp(song: Song): number {
    const date = song.releaseDate ?? song.createdAt ?? song.updatedAt;
    const timestamp = date ? Date.parse(date) : 0;
    return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortSongsByNewest(songs: Song[]): Song[] {
    return [...songs].sort((left, right) => getSongTimestamp(right) - getSongTimestamp(left));
}

function countHistorySongs(history: Awaited<ReturnType<typeof fetchListeningHistory>>): Map<string, number> {
    const counts = new Map<string, number>();

    history.forEach((item) => {
        const song = item.song ?? (isRecord(item) && typeof item.id === 'string' ? item : null);
        const songId = isRecord(song) && typeof song.id === 'string' ? song.id : null;

        if (songId) {
            counts.set(songId, (counts.get(songId) ?? 0) + 1);
        }
    });

    return counts;
}

function sortSongsByTrending(songs: Song[], historyCounts: Map<string, number>): Song[] {
    return [...songs].sort((left, right) => {
        const leftPlays = left.playCount ?? historyCounts.get(left.id) ?? 0;
        const rightPlays = right.playCount ?? historyCounts.get(right.id) ?? 0;

        return rightPlays - leftPlays || getSongTimestamp(right) - getSongTimestamp(left);
    });
}

export async function getNewSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 20 });
    return applyLikedStatus(sortSongsByNewest(songs.map(mapSongDtoToSong)));
}

export async function getTrendingSongs(): Promise<Song[]> {
    const [songResult, historyResult] = await Promise.allSettled([
        fetchNewSongDtos({ limit: 50 }),
        fetchListeningHistory(100),
    ]);
    const songs = songResult.status === 'fulfilled' ? songResult.value : [];
    const history = historyResult.status === 'fulfilled' ? historyResult.value : [];

    return applyLikedStatus(
        sortSongsByTrending(songs.map(mapSongDtoToSong), countHistorySongs(history)).slice(0, 20)
    );
}

export async function getContinueListeningSongs(): Promise<Song[]> {
    const history = await fetchListeningHistory(20);
    return mapHistoryToUniqueSongs(history);
}

export async function getRecentlyPlayedSongs(limit = 20): Promise<Song[]> {
    const history = await fetchListeningHistory(limit);
    return mapHistoryToUniqueSongs(history);
}

function mapHistoryToUniqueSongs(
    history: Awaited<ReturnType<typeof fetchListeningHistory>>
): Promise<Song[]> {
    const seenSongIds = new Set<string>();
    const songs = history
        .map((item) => item.song ?? (isRecord(item) && typeof item.id === 'string' ? item : null))
        .filter((song): song is SongDto => Boolean(song));

    return applyLikedStatus(
        songs
            .map((song) => mapSongDtoToSong(song))
            .filter((song) => {
                if (seenSongIds.has(song.id)) {
                    return false;
                }

                seenSongIds.add(song.id);
                return true;
            })
    );
}

export async function getRecommendedSongs(): Promise<Song[]> {
    const [recommendationResult, fallbackSongsResult, historyResult] = await Promise.allSettled([
        fetchRecommendationDtos(),
        fetchNewSongDtos({ limit: 50 }),
        fetchListeningHistory(50),
    ]);
    const recommendationDtos =
        recommendationResult.status === 'fulfilled' ? recommendationResult.value : [];
    const fallbackSongDtos =
        fallbackSongsResult.status === 'fulfilled' ? fallbackSongsResult.value : [];
    const historyItems = historyResult.status === 'fulfilled' ? historyResult.value : [];
    const historySongs = historyItems
        .map((item) => item.song ?? (isRecord(item) && typeof item.id === 'string' ? item : null))
        .filter((song): song is SongDto => Boolean(song))
        .map(mapSongDtoToSong);
    const candidates = dedupeSongsById([
        ...recommendationDtos.map(mapSongDtoToSong),
        ...fallbackSongDtos.map(mapSongDtoToSong),
    ]);
    const rankedSongs = await rankSongsByStoredPreferences(candidates, { historySongs });
    return applyLikedStatus(rankedSongs);
}

export async function getLikedSongs(limit = 20): Promise<Song[]> {
    const songs = await fetchLikedSongDtos(limit);
    return applyLikedStatus(
        songs.map((song) => ({
            ...mapSongDtoToSong(song),
            isLiked: true,
        }))
    );
}

export async function getAllSongs(): Promise<Song[]> {
    const songs = await fetchNewSongDtos({ limit: 50 });
    return applyLikedStatus(songs.map(mapSongDtoToSong));
}

export async function getSongsByType(type: SongListType): Promise<Song[]> {
    switch (type) {
        case 'new':
            return getNewSongs();
        case 'trending':
            return getTrendingSongs();
        case 'continueListening':
            return getContinueListeningSongs();
        case 'recommended':
            return getRecommendedSongs();
        case 'all':
        default:
            return getAllSongs();
    }
}

export async function getSongsBySource(source: SongListSource, limit = 50): Promise<Song[]> {
    if (source.endpoint) {
        const songs = await fetchSongDtosFromEndpoint(source.endpoint, limit);
        return applyLikedStatus(songs.map(mapSongDtoToSong));
    }

    switch (source.sourceType) {
        case 'new':
        case 'trending':
        case 'continueListening':
        case 'all':
            return getSongsByType(source.sourceType);
        case 'recommended': {
            const songs = await getRecommendedSongs();
            return limit ? songs.slice(0, limit) : songs;
        }
        case 'liked':
            return getLikedSongs();
        case 'recent':
            return getRecentlyPlayedSongs(limit);
        case 'search': {
            const songs = await fetchSearchSongDtos({ q: source.query ?? '', limit });
            return applyLikedStatus(songs.map(mapSongDtoToSong));
        }
        case 'genre':
        case 'section': {
            const query = source.query ?? source.sectionId ?? '';
            const songs = query
                ? await fetchSearchSongDtos({ q: query, limit })
                : await fetchNewSongDtos({ limit });
            return applyLikedStatus(songs.map(mapSongDtoToSong));
        }
        default:
            return getAllSongs();
    }
}
