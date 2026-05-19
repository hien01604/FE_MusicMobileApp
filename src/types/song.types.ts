export interface SongDto {
    id: string;
    title?: string;
    name?: string;
    artist?: string;
    artists?: string[] | string;
    thumbnail?: string;
    image?: string;
    duration?: number;
    audioUrl?: string;
    streamUrl?: string;
    [key: string]: any;
}
