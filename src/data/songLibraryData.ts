import type { Song } from '../types';

export type SongListType = 'all' | 'new' | 'trending' | 'continueListening' | 'recommended';

export const newSongs: Song[] = [
    {
        id: 'new-1',
        title: 'Imagine Dragons',
        artist: 'Camren Williamson',
        image: 'https://picsum.photos/200/200?random=1',
    },
    {
        id: 'new-2',
        title: 'Renaissance',
        artist: 'Podval Capella',
        image: 'https://picsum.photos/200/200?random=2',
    },
    {
        id: 'new-3',
        title: "Ivar's Revenge",
        artist: 'Savannah Nguyen',
        image: 'https://picsum.photos/200/200?random=3',
    },
    {
        id: 'new-4',
        title: 'Neon Skyline',
        artist: 'Pulse Theory',
        image: 'https://picsum.photos/200/200?random=4',
    },
    {
        id: 'new-5',
        title: 'Afterglow Drive',
        artist: 'Damned Anthem',
        image: 'https://picsum.photos/200/200?random=5',
    },
    {
        id: 'new-6',
        title: 'Midnight Frequency',
        artist: 'Aero Vox',
        image: 'https://picsum.photos/200/200?random=6',
    },
    {
        id: 'new-7',
        title: 'Runaway City',
        artist: 'Sonic Harbor',
        image: 'https://picsum.photos/200/200?random=7',
    },
    {
        id: 'new-8',
        title: 'Glass Horizon',
        artist: 'Luma Tide',
        image: 'https://picsum.photos/200/200?random=8',
    },
];

export const trendingSongs: Song[] = [
    ...newSongs,
    {
        id: 'trend-9',
        title: 'Moonlit Static',
        artist: 'Aria Nova',
        image: 'https://picsum.photos/200/200?random=9',
    },
    {
        id: 'trend-10',
        title: 'Velvet Pulse',
        artist: 'Neon Drift',
        image: 'https://picsum.photos/200/200?random=10',
    },
];

export const continueListeningSongs: Song[] = [
    {
        id: 'listen-1',
        title: 'Afterglow Drive',
        artist: 'Damned Anthem',
        image: 'https://picsum.photos/200/200?random=5',
    },
    {
        id: 'listen-2',
        title: 'Neon Skyline',
        artist: 'Pulse Theory',
        image: 'https://picsum.photos/200/200?random=4',
    },
    {
        id: 'listen-3',
        title: 'Glass Horizon',
        artist: 'Luma Tide',
        image: 'https://picsum.photos/200/200?random=8',
    },
    {
        id: 'listen-4',
        title: 'Midnight Frequency',
        artist: 'Aero Vox',
        image: 'https://picsum.photos/200/200?random=6',
    },
];

export const recommendedSongs: Song[] = [
    {
        id: 'rec-1',
        title: 'Shifting Lights',
        artist: 'Noah Voss',
        image: 'https://picsum.photos/200/200?random=11',
    },
    {
        id: 'rec-2',
        title: 'Echo Chamber',
        artist: 'Mira Vale',
        image: 'https://picsum.photos/200/200?random=12',
    },
    {
        id: 'rec-3',
        title: 'Paper Satellites',
        artist: 'Atlas Bloom',
        image: 'https://picsum.photos/200/200?random=13',
    },
    {
        id: 'rec-4',
        title: 'Second Sun',
        artist: 'Opal Waves',
        image: 'https://picsum.photos/200/200?random=14',
    },
    {
        id: 'rec-5',
        title: 'Gravity Bloom',
        artist: 'The Shoreline',
        image: 'https://picsum.photos/200/200?random=15',
    },
    {
        id: 'rec-6',
        title: 'Northern Frame',
        artist: 'Solstice Kids',
        image: 'https://picsum.photos/200/200?random=16',
    },
];

export const allSongs: Song[] = [
    ...newSongs,
    ...trendingSongs.slice(newSongs.length),
    ...continueListeningSongs,
    ...recommendedSongs,
];
