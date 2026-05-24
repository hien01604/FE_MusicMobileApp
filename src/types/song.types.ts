export interface SongDto {
    id: string;
    title?: string;
    name?: string;
    artist?: string;
    artists?: string[] | string;
    artist_id?: string;
    genre_id?: string;
    thumbnail?: string;
    thumbnail_url?: string | null;
    image?: string;
    duration?: number;
    audioUrl?: string;
    audio_url?: string;
    streamUrl?: string;
    release_date?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
