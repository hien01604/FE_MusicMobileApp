import api from './api';

export type RecordSongPlayPayload = {
    songId: string;
    listenDuration?: number;
};

export async function recordSongPlay(payload: RecordSongPlayPayload): Promise<void> {
    await api.post('/player/play', payload);
}
