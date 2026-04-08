import { Category, Song, Artist } from "../types";

export const categories = [
    {
        id: '1',
        title: 'Liked Songs',
        icon: 'favorite',
        color: '#6351ce' // Màu tím đậm
    },
    {
        id: '2',
        title: 'My Playlists',
        icon: 'library-music',
        color: '#3e4a89' // Màu xanh đậm
    },
    {
        id: '3',
        title: 'Recently Played',
        icon: 'history',
        color: '#7c3a6b' // Màu tím hồng
    },
    {
        id: '4',
        title: 'Trending',
        icon: 'whatshot',
        color: '#b25d38' // Màu cam đất
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