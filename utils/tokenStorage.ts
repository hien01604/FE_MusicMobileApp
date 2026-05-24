import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const TOKEN_KEY = "@auth_token";
const REFRESH_TOKEN_KEY = "@auth_refresh_token";
const USER_KEY = "@auth_user";

export interface StoredUser {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

class TokenStorage {
    // Token methods
    async saveToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error("Failed to save token:", error);
            throw new Error("Failed to save authentication token");
        }
    }

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error("Failed to get token:", error);
            return null;
        }
    }

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error("Failed to remove token:", error);
        }
    }

    // Refresh token methods
    async saveRefreshToken(refreshToken: string): Promise<void> {
        try {
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } catch (error) {
            console.error("Failed to save refresh token:", error);
            throw new Error("Failed to save refresh token");
        }
    }

    async getRefreshToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error("Failed to get refresh token:", error);
            return null;
        }
    }

    async removeRefreshToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error("Failed to remove refresh token:", error);
        }
    }

    // User methods
    async saveUser(user: StoredUser): Promise<void> {
        try {
            const userJson = JSON.stringify(user);
            await AsyncStorage.setItem(USER_KEY, userJson);
        } catch (error) {
            console.error("Failed to save user:", error);
            throw new Error("Failed to save user data");
        }
    }

    async getUser(): Promise<StoredUser | null> {
        try {
            const userJson = await AsyncStorage.getItem(USER_KEY);
            if (!userJson) return null;
            return JSON.parse(userJson);
        } catch (error) {
            console.error("Failed to get user:", error);
            return null;
        }
    }

    async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error("Failed to remove user:", error);
        }
    }

    // Combined methods
    async saveAuthData(token: string, user: StoredUser, refreshToken?: string): Promise<void> {
        try {
            await Promise.all([
                this.saveToken(token),
                this.saveUser(user),
                refreshToken ? this.saveRefreshToken(refreshToken) : Promise.resolve(),
            ]);
        } catch (error) {
            console.error("Failed to save auth data:", error);
            throw new Error("Failed to save authentication data");
        }
    }

    async getAuthData(): Promise<{
        token: string | null;
        user: StoredUser | null;
        refreshToken: string | null;
    }> {
        try {
            const [token, user, refreshToken] = await Promise.all([
                this.getToken(),
                this.getUser(),
                this.getRefreshToken(),
            ]);

            return { token, user, refreshToken };
        } catch (error) {
            console.error("Failed to get auth data:", error);
            return { token: null, user: null, refreshToken: null };
        }
    }

    async clearAllAuthData(): Promise<void> {
        try {
            await Promise.all([
                this.removeToken(),
                this.removeUser(),
                this.removeRefreshToken(),
            ]);
        } catch (error) {
            console.error("Failed to clear auth data:", error);
        }
    }

    // Check if user is logged in
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    }
}

export const tokenStorage = new TokenStorage();
