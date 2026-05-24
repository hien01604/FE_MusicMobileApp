export type PreferenceTab = 'artists' | 'genres';

export type PreferenceOption = {
    id: string;
    label: string;
};

export const GENRE_OPTIONS: PreferenceOption[] = [
    { id: 'pop', label: 'Pop' },
    { id: 'indie', label: 'Indie' },
    { id: 'rnb', label: 'R&B' },
    { id: 'edm', label: 'EDM' },
    { id: 'rock', label: 'Rock' },
    { id: 'lofi', label: 'Lofi' },
    { id: 'jazz', label: 'Jazz' },
    { id: 'k-pop', label: 'K-pop' },
    { id: 'hip-hop', label: 'Hip-hop' },
    { id: 'acoustic', label: 'Acoustic' },
    { id: 'rap', label: 'Rap' },
];

export const MOOD_OPTIONS: PreferenceOption[] = [
    { id: 'party', label: 'Party' },
    { id: 'chill', label: 'Chill' },
    { id: 'sad', label: 'Sad' },
    { id: 'workout', label: 'Workout' },
    { id: 'focus', label: 'Focus' },
    { id: 'sleep', label: 'Sleep' },
];
