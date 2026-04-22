import { Category, Song } from '../types';

export type ListeningHistoryItem = Song & {
    progress: number;
    genre: string;
    mood: string;
    lastListenedAt: string;
};

export const quickActions: Category[] = [
    { id: 'quick-liked', title: 'Liked Songs', icon: 'favorite' },
    { id: 'quick-playlists', title: 'My Playlists', icon: 'library-music' },
    { id: 'quick-recent', title: 'Recently Played', icon: 'history' },
    { id: 'quick-daily-mix', title: 'Daily Mix', icon: 'auto-awesome' },
];

export const newReleases: Song[] = [
    {
        id: 'song-1',
        title: 'Urgent Siege',
        artist: 'Damned Anthem',
        image: 'https://picsum.photos/200',
    },
    {
        id: 'release-2',
        title: 'Neon Skyline',
        artist: 'Pulse Theory',
        image: 'https://picsum.photos/202',
    },
    {
        id: 'release-3',
        title: 'Summer Echo',
        artist: 'Luma Tide',
        image: 'https://picsum.photos/203',
    },
    {
        id: 'release-4',
        title: 'Afterglow Drive',
        artist: 'Damned Anthem',
        image: 'https://picsum.photos/204',
    },
];

export const trendingSongs: Song[] = [
    ...newReleases,
    {
        id: 'trend-5',
        title: 'Midnight Frequency',
        artist: 'Aero Vox',
        image: 'https://picsum.photos/205',
    },
    {
        id: 'trend-6',
        title: 'Runaway City',
        artist: 'Sonic Harbor',
        image: 'https://picsum.photos/206',
    },
];

export const listeningHistory: ListeningHistoryItem[] = [
    {
        id: 'history-1',
        title: 'Afterglow Drive',
        artist: 'Damned Anthem',
        image: 'https://picsum.photos/204',
        progress: 0.58,
        genre: 'Alternative',
        mood: 'Focus',
        lastListenedAt: '2026-04-20T06:10:00.000Z',
    },
    {
        id: 'history-2',
        title: 'Neon Skyline',
        artist: 'Pulse Theory',
        image: 'https://picsum.photos/202',
        progress: 0.92,
        genre: 'Electronic',
        mood: 'Workout',
        lastListenedAt: '2026-04-19T19:30:00.000Z',
    },
    {
        id: 'history-3',
        title: 'Glass Horizon',
        artist: 'Luma Tide',
        image: 'https://picsum.photos/207',
        progress: 0.35,
        genre: 'Pop',
        mood: 'Chill',
        lastListenedAt: '2026-04-20T08:55:00.000Z',
    },
];
