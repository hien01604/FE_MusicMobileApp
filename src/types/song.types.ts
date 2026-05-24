export interface SongDto {
    id: string;
    title?: string;
    name?: string;
    artist?: string | { id?: unknown; name?: unknown; [key: string]: unknown };
    artists?:
        | Array<string | { name?: unknown; [key: string]: unknown }>
        | string
        | { name?: unknown; [key: string]: unknown };
    artist_name?: string;
    artistName?: string;
    artist_id?: string;
    genre_id?: string;
    thumbnail?: string;
    thumbnail_url?: string | null;
    image?: string;
    duration?: number;
    audioUrl?: string;
    audio_url?: string;
    streamUrl?: string;
    play_count?: number;
    playCount?: number;
    listen_count?: number;
    listenCount?: number;
    release_date?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
