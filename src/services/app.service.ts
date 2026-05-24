import api from './api';

export async function getApiHealth(): Promise<unknown> {
    const response = await api.get('');
    return response.data;
}
