import api from './api';
import { MOOD_OPTIONS, type PreferenceOption } from '../constants/preferences';

export interface MoodDto {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
}

export type MoodOption = PreferenceOption & {
    icon?: string | null;
    color?: string | null;
};

function unwrapResponseData<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
        return data as T;
    }

    if ('data' in data) {
        return unwrapResponseData<T>((data as { data: unknown }).data);
    }

    if ('value' in data) {
        return (data as { value: T }).value;
    }

    if ('moods' in data) {
        return (data as { moods: T }).moods;
    }

    if ('items' in data) {
        return (data as { items: T }).items;
    }

    return data as T;
}

export async function getMoods(): Promise<MoodDto[]> {
    try {
        const response = await api.get('/moods');
        const moods = unwrapResponseData<MoodDto[]>(response.data);

        if (!Array.isArray(moods)) {
            return MOOD_OPTIONS.map((mood) => ({ id: mood.id, name: mood.label }));
        }

        return moods;
    } catch {
        return MOOD_OPTIONS.map((mood) => ({ id: mood.id, name: mood.label }));
    }
}

export function mapMoodDtoToOption(mood: MoodDto): MoodOption {
    return {
        id: mood.id,
        label: mood.name,
        icon: mood.icon ?? null,
        color: mood.color ?? null,
    };
}

export async function getMoodOptions(): Promise<MoodOption[]> {
    const moods = await getMoods();
    return moods.map(mapMoodDtoToOption);
}
