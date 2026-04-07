import { Category, Song, Artist } from "../types";

export const categories: Category[] = [
    { id: "1", title: "Liked Songs" },
    { id: "2", title: "My Playlists" },
    { id: "3", title: "Recently Played" },
    { id: "4", title: "Trending" },
];

export const songs: Song[] = [
    {
        id: "1",
        title: "Urgent Siege",
        artist: "Damned Anthem",
        image: "https://picsum.photos/200",
    },
];

export const artists: Artist[] = [
    {
        id: "1",
        name: "Damned Anthem",
        image: "https://picsum.photos/201",
    },
];