export type { SongDto } from './song.types';

export interface Category {
    id: string;
    title: string;
    icon?: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    artistId?: string;
    genreId?: string;
    image: string;
    duration?: number;
    audioUrl?: string;
    streamUrl?: string;
    releaseDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
    playCount?: number;
    isLiked?: boolean;
    isInPlaylist?: boolean;
}

export interface Playlist {
    id: string;
    name: string;
    thumbnail?: string;
    songCount?: number;
    songs?: Song[];
    createdAt?: string;
}

export interface Artist {
    id: string;
    name: string;
    image: string;
    bio?: string | null;
}

export type SongListType = 'all' | 'new' | 'trending' | 'continueListening' | 'recommended';

export type SongListSourceType =
    | SongListType
    | 'recent'
    | 'liked'
    | 'search'
    | 'section'
    | 'genre';

export interface SongListSource {
    title: string;
    sourceType: SongListSourceType;
    sectionId?: string;
    query?: string;
    endpoint?: string;
}
