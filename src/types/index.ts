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
    image: string;
    duration?: number;
    audioUrl?: string;
    streamUrl?: string;
    isLiked?: boolean;
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
