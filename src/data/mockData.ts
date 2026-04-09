import { Category, Song, Artist } from "../types";

export const categories = [
    {
        id: '1',
        title: 'Liked Songs',
        icon: 'favorite',
    },
    {
        id: '2',
        title: 'My Playlists',
        icon: 'library-music',
    },
    {
        id: '3',
        title: 'Recently',
        icon: 'history',
    },
    {
        id: '4',
        title: 'Trending',
        icon: 'whatshot',

    },
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