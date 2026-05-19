import { create } from 'zustand';
import type { Song } from '../types';
import {
    pauseTrackPlayer,
    playWithTrackPlayer,
    resumeTrackPlayer,
    subscribeTrackPlayerState,
} from '../services/trackPlayer.service';

type PlayerStore = {
    currentSong: Song | null;
    isPlaying: boolean;
    playSong: (song: Song) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    initPlayerSync: () => Promise<void>;
};

let unsubscribeTrackPlayer: (() => void) | null = null;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,

    playSong: async (song) => {
        set({ currentSong: song, isPlaying: true });

        try {
            await playWithTrackPlayer(song);
        } catch {
            set({ isPlaying: false });
        }
    },

    pause: async () => {
        await pauseTrackPlayer();
        set({ isPlaying: false });
    },

    resume: async () => {
        const song = get().currentSong;
        await resumeTrackPlayer(song);
        if (song) {
            set({ isPlaying: true });
        }
    },

    initPlayerSync: async () => {
        if (unsubscribeTrackPlayer) {
            return;
        }

        const unsubscribe = await subscribeTrackPlayerState((isPlaying) => {
            set({ isPlaying });
        });

        unsubscribeTrackPlayer = unsubscribe;
    },
}));
