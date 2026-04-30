import { NativeModules, Platform } from 'react-native';
import type { Song } from '../types';

type TrackPlayerModule = {
    setupPlayer: () => Promise<void>;
    add: (track: Record<string, unknown>) => Promise<void>;
    reset: () => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    getActiveTrackIndex: () => Promise<number | undefined>;
    getTrack: (index: number) => Promise<Record<string, unknown> | undefined>;
    updateOptions?: (options: Record<string, unknown>) => Promise<void>;
    Event?: Record<string, string>;
    State?: Record<string, string | number>;
    Capability?: Record<string, string | number>;
    addEventListener?: (
        event: string,
        handler: (payload: Record<string, unknown>) => void
    ) => { remove: () => void };
};

let cachedTrackPlayer: TrackPlayerModule | null | undefined;
let isSetupDone = false;

function getTrackPlayerModule(): TrackPlayerModule | null {
    if (cachedTrackPlayer !== undefined) {
        return cachedTrackPlayer;
    }

    if (Platform.OS === 'web' || !NativeModules.TrackPlayer) {
        cachedTrackPlayer = null;
        return cachedTrackPlayer;
    }

    try {
        const loaded = require('react-native-track-player');
        if (!loaded) {
            cachedTrackPlayer = null;
        } else {
            cachedTrackPlayer = (loaded.default || loaded) as TrackPlayerModule;
        }
    } catch {
        cachedTrackPlayer = null;
    }

    return cachedTrackPlayer;
}

async function ensureSetup() {
    const trackPlayer = getTrackPlayerModule();
    if (!trackPlayer || isSetupDone) {
        return trackPlayer;
    }

    await trackPlayer.setupPlayer();

    // Some environments or native installs may expose Capability/values differently
    // Wrap in try/catch and defensively check each capability before using it.
    try {
        if (trackPlayer.updateOptions && trackPlayer.Capability) {
            const cap = trackPlayer.Capability as Record<string, unknown>;
            const capabilities: unknown[] = [];
            const compactCapabilities: unknown[] = [];

            if (cap.Play != null) capabilities.push(cap.Play);
            if (cap.Pause != null) capabilities.push(cap.Pause);
            if (cap.SkipToNext != null) capabilities.push(cap.SkipToNext);
            if (cap.SkipToPrevious != null) capabilities.push(cap.SkipToPrevious);

            if (cap.Play != null) compactCapabilities.push(cap.Play);
            if (cap.Pause != null) compactCapabilities.push(cap.Pause);

            // Only call updateOptions if we have at least one capability value
            if (capabilities.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                await trackPlayer.updateOptions({
                    capabilities,
                    compactCapabilities,
                });
            }
        }
    } catch {
        // Ignore failures configuring native options in non-standard environments
    }

    isSetupDone = true;
    return trackPlayer;
}

export async function playWithTrackPlayer(song: Song) {
    const trackPlayer = await ensureSetup();
    if (!trackPlayer) {
        return;
    }

    await trackPlayer.reset();
    await trackPlayer.add({
        id: song.id,
        title: song.title,
        artist: song.artist,
        artwork: song.image,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    });
    await trackPlayer.play();
}

export async function pauseTrackPlayer() {
    const trackPlayer = getTrackPlayerModule();
    if (!trackPlayer) {
        return;
    }
    await trackPlayer.pause();
}

export async function resumeTrackPlayer(song?: Song | null) {
    const trackPlayer = await ensureSetup();
    if (!trackPlayer) {
        return;
    }

    const activeTrackIndex = await trackPlayer.getActiveTrackIndex();
    if (activeTrackIndex === undefined || activeTrackIndex < 0) {
        if (song) {
            await playWithTrackPlayer(song);
        }
        return;
    }

    await trackPlayer.play();
}

export async function subscribeTrackPlayerState(
    onPlayStateChange: (isPlaying: boolean) => void
) {
    const trackPlayer = await ensureSetup();
    if (!trackPlayer || !trackPlayer.addEventListener || !trackPlayer.Event) {
        return () => undefined;
    }

    const eventName =
        trackPlayer.Event.PlaybackState ||
        trackPlayer.Event.PlaybackStateChanged ||
        'playback-state';

    const subscription = trackPlayer.addEventListener(
        eventName,
        (payload: Record<string, unknown>) => {
            if (!trackPlayer.State) {
                return;
            }

            const stateValue = payload.state as string | number | undefined;
            const isPlaying =
                stateValue === trackPlayer.State.Playing ||
                stateValue === trackPlayer.State.Buffering;

            onPlayStateChange(Boolean(isPlaying));
        }
    );

    return () => subscription.remove();
}
