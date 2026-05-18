import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponseDto, UserProfileDto } from "../types/auth.types";

export const AUTH_STORAGE_KEYS = {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    user: "user",
} as const;

export async function getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
}

export async function getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
}

export async function getStoredUser(): Promise<UserProfileDto | null> {
    const user = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.user);
    return user ? (JSON.parse(user) as UserProfileDto) : null;
}

export async function saveAuthData(data: AuthResponseDto): Promise<void> {
    await AsyncStorage.multiSet([
        [AUTH_STORAGE_KEYS.accessToken, data.accessToken],
        [AUTH_STORAGE_KEYS.refreshToken, data.refreshToken],
        [AUTH_STORAGE_KEYS.user, JSON.stringify(data.user)],
    ]);
}

export async function clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.accessToken,
        AUTH_STORAGE_KEYS.refreshToken,
        AUTH_STORAGE_KEYS.user,
    ]);
}
