import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PreferenceOption } from '../constants/preferences';

const PREFERENCES_STORAGE_KEY = 'userPreferences';

export type StoredPreferences = {
    artists: PreferenceOption[];
    genres: PreferenceOption[];
    moods: PreferenceOption[];
};

const EMPTY_PREFERENCES: StoredPreferences = {
    artists: [],
    genres: [],
    moods: [],
};

export async function getStoredPreferences(): Promise<StoredPreferences> {
    const raw = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (!raw) {
        return EMPTY_PREFERENCES;
    }

    try {
        const parsed = JSON.parse(raw) as Partial<StoredPreferences>;

        return {
            artists: Array.isArray(parsed.artists) ? parsed.artists : [],
            genres: Array.isArray(parsed.genres) ? parsed.genres : [],
            moods: Array.isArray(parsed.moods) ? parsed.moods : [],
        };
    } catch {
        return EMPTY_PREFERENCES;
    }
}

export async function saveStoredPreferences(preferences: StoredPreferences): Promise<void> {
    await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

export async function updateStoredPreferences(
    patch: Partial<StoredPreferences>
): Promise<StoredPreferences> {
    const current = await getStoredPreferences();
    const next = { ...current, ...patch };
    await saveStoredPreferences(next);
    return next;
}
