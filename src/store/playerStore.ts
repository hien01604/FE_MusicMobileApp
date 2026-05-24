import { create } from 'zustand';
import type { Song } from '../types';
import {
    addToTrackPlayerQueue,
    pauseTrackPlayer,
    playWithTrackPlayer,
    resumeTrackPlayer,
    subscribeTrackPlayerState,
    getPosition,
    seekTo as trackSeekTo,
} from '../services/trackPlayer.service';
import { recordSongPlay } from '../services/player.service';

type PlayerStore = {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    playbackPosition: number;
    shuffleEnabled: boolean;
    repeatMode: 'off' | 'one' | 'all';
    addToQueue: (song: Song) => Promise<void>;
    playSong: (song: Song, queue?: Song[]) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    dismissPlayer: () => Promise<void>;
    toggleShuffle: () => void;
    setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
    seekTo: (seconds: number) => Promise<void>;
    updateSongById: (songId: string, patch: Partial<Song>) => void;
    initPlayerSync: () => Promise<void>;
};

let unsubscribeTrackPlayer: (() => void) | null = null;
let playbackTimer: ReturnType<typeof setInterval> | null = null;

function stopPlaybackTimer() {
    if (playbackTimer) {
        clearInterval(playbackTimer);
        playbackTimer = null;
    }
}

function startPlaybackTimer(onTick: () => Promise<void>) {
    stopPlaybackTimer();
    playbackTimer = setInterval(() => {
        void onTick();
    }, 1000);
}

function recordPlayStart(song: Song) {
    void recordSongPlay({ songId: song.id }).catch((error) => {
        console.error('Failed to record play history:', error);
    });
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    playbackPosition: 0,
    shuffleEnabled: false,
    repeatMode: 'off',

    addToQueue: async (song) => {
        set((state) => ({
            queue: state.queue.some((queuedSong) => queuedSong.id === song.id)
                ? state.queue
                : [...state.queue, song],
        }));

        try {
            await addToTrackPlayerQueue(song);
        } catch {
            // Keep the in-app queue even if native queueing is unavailable.
        }
    },

    playSong: async (song, queue) => {
        const nextQueue = queue && Array.isArray(queue) && queue.length > 0 ? queue : [song];
        const nextIndex = Math.max(0, nextQueue.findIndex((item) => item.id === song.id));

        set({
            queue: nextQueue,
            currentIndex: nextIndex,
            currentSong: song,
            isPlaying: true,
            playbackPosition: 0,
        });

        recordPlayStart(song);

        try {
            await playWithTrackPlayer(song);
            startPlaybackTimer(async () => {
                const current = get().currentSong;
                if (!current) {
                    stopPlaybackTimer();
                    return;
                }

                try {
                    const position = await getPosition();
                    set({ playbackPosition: position });
                } catch {
                    // ignore polling failures
                }
            });

        } catch (error) {
            console.error('Failed to play audio:', error);
            stopPlaybackTimer();
            set({ isPlaying: false });
        }
    },

    pause: async () => {
        await pauseTrackPlayer();
        stopPlaybackTimer();
        set({ isPlaying: false });
    },

    resume: async () => {
        const song = get().currentSong;
        await resumeTrackPlayer(song);
        if (song) {
            set({ isPlaying: true });
            startPlaybackTimer(async () => {
                try {
                    const position = await getPosition();
                    set({ playbackPosition: position });
                } catch {
                    // ignore polling failures
                }
            });
        }
    },

    playNext: async () => {
        const state = get();
        const { queue, currentIndex, currentSong, shuffleEnabled, repeatMode } = state;
        if (!queue || queue.length === 0) return;

        // Repeat one: replay current
        if (repeatMode === 'one') {
            const song = queue[currentIndex] ?? currentSong ?? queue[0];
            if (song) {
                recordPlayStart(song);
                await playWithTrackPlayer(song);
                set({
                    currentIndex: Math.max(0, queue.findIndex((item) => item.id === song.id)),
                    currentSong: song,
                    isPlaying: true,
                    playbackPosition: 0,
                });
            }
            return;
        }

        let nextIndex = currentIndex + 1;

        if (shuffleEnabled) {
            if (queue.length === 1) {
                nextIndex = 0;
            } else {
                let attempts = 0;
                do {
                    nextIndex = Math.floor(Math.random() * queue.length);
                    attempts++;
                } while (nextIndex === currentIndex && attempts < 5);
            }
        }

        if (nextIndex >= queue.length) {
            nextIndex = 0;
        }

        const nextSong = queue[nextIndex];
        if (!nextSong) return;

        set({ currentIndex: nextIndex, currentSong: nextSong, isPlaying: true, playbackPosition: 0 });

        recordPlayStart(nextSong);

        try {
            await playWithTrackPlayer(nextSong);
            startPlaybackTimer(async () => {
                try {
                    const position = await getPosition();
                    set({ playbackPosition: position });
                } catch {
                    // ignore polling failures
                }
            });
        } catch {
            stopPlaybackTimer();
            set({ isPlaying: false });
        }
    },

    playPrevious: async () => {
        const state = get();
        const { queue, currentIndex, currentSong: fallbackSong, isPlaying } = state;
        if (!queue || queue.length === 0) return;

        const currentSong = queue[currentIndex] ?? fallbackSong ?? queue[0];
        try {
            const pos = await getPosition();
            if (pos > 3) {
                await trackSeekTo(0);
                if (isPlaying) {
                    await resumeTrackPlayer(currentSong);
                    set({ isPlaying: true, playbackPosition: 0 });
                }
                return;
            }
        } catch {
            // ignore position errors
        }

        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevSong = queue[prevIndex];
            if (!prevSong) return;

            set({ currentIndex: prevIndex, currentSong: prevSong, isPlaying: true, playbackPosition: 0 });
            recordPlayStart(prevSong);
            try {
                await playWithTrackPlayer(prevSong);
                startPlaybackTimer(async () => {
                    try {
                        const position = await getPosition();
                        set({ playbackPosition: position });
                    } catch {
                        // ignore polling failures
                    }
                });
            } catch {
                stopPlaybackTimer();
                set({ isPlaying: false });
            }
        } else {
            try {
                await trackSeekTo(0);
                if (isPlaying) {
                    await resumeTrackPlayer(currentSong);
                    set({ isPlaying: true, playbackPosition: 0 });
                }
            } catch {
                // ignore
            }
        }
    },

    dismissPlayer: async () => {
        try {
            await pauseTrackPlayer();
        } catch {
            // ignore native pause failures while dismissing UI
        }

        stopPlaybackTimer();
        set({
            currentSong: null,
            isPlaying: false,
            queue: [],
            currentIndex: -1,
            playbackPosition: 0,
        });
    },

    toggleShuffle: () => {
        set((state) => ({ shuffleEnabled: !state.shuffleEnabled }));
    },

    setRepeatMode: (mode) => {
        set({ repeatMode: mode });
    },

    seekTo: async (seconds: number) => {
        await trackSeekTo(seconds);
        set({ playbackPosition: seconds });
    },

    updateSongById: (songId, patch) => {
        set((state) => {
            const updateSong = (song: Song | null) =>
                song && song.id === songId ? { ...song, ...patch } : song;

            return {
                currentSong: updateSong(state.currentSong),
                queue: state.queue.map((item) =>
                    item.id === songId ? { ...item, ...patch } : item
                ),
            };
        });
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
