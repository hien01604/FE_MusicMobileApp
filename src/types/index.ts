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
}

export interface Artist {
    id: string;
    name: string;
    image: string;
}
