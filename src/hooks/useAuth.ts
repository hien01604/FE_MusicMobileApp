import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth.service';
import {
    RegisterDto,
    LoginDto,
    GoogleLoginDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    UpdateProfileDto,
    SetPreferencesDto,
    UpdatePreferencesDto,
    AuthResponseDto,
    UserProfileDto,
} from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface SignupResult {
    success: boolean;
    user?: UserProfileDto;
    message?: string;
}

export interface AuthResult {
    success: boolean;
    data?: any;
    message?: string;
}

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfileDto | null>(null);

    // Initialize auth state from AsyncStorage
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
                setIsAuthenticated(!!token);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const register = useCallback(
        async (username: string, email: string, password: string): Promise<SignupResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.register({ username, email, password });
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                setIsAuthenticated(true);
                setUser(data.user);
                return { success: true, user: data.user };
            } catch (err: any) {
                const message = err?.message || 'Registration failed';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Alias for backward compatibility
    const signup = register;

    const login = useCallback(
        async (email: string, password: string): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.login({ email, password });
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                setIsAuthenticated(true);
                setUser(data.user);
                return { success: true, data };
            } catch (err: any) {
                const message = err?.message || 'Login failed';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const googleLogin = useCallback(
        async (idToken: string): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.googleLogin({ idToken });
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                setIsAuthenticated(true);
                setUser(data.user);
                return { success: true, data };
            } catch (err: any) {
                const message = err?.message || 'Google login failed';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                try {
                    await authService.logout({ refreshToken });
                } catch {
                    // Continue logout even if API call fails
                }
            }
            await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
            await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    }, []);

    // Alias for backward compatibility
    const signout = logout;

    const refreshToken = useCallback(async (): Promise<AuthResult> => {
        try {
            const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (!token) {
                throw new Error('No refresh token available');
            }
            const data = await authService.refreshToken({ refreshToken: token });
            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            setUser(data.user);
            return { success: true, data };
        } catch (err: any) {
            const message = err?.message || 'Token refresh failed';
            setError(message);
            setIsAuthenticated(false);
            return { success: false, message };
        }
    }, []);

    const forgotPassword = useCallback(async (email: string): Promise<AuthResult> => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.forgotPassword({ email });
            return { success: true, data };
        } catch (err: any) {
            const message = err?.message || 'Failed to send reset email';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(
        async (token: string, newPassword: string): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.resetPassword({ token, newPassword });
                return { success: true, data };
            } catch (err: any) {
                const message = err?.message || 'Password reset failed';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const getProfile = useCallback(async (): Promise<AuthResult> => {
        try {
            const profile = await authService.getProfile();
            setUser(profile);
            return { success: true, data: profile };
        } catch (err: any) {
            const message = err?.message || 'Failed to fetch profile';
            setError(message);
            return { success: false, message };
        }
    }, []);

    const updateProfile = useCallback(
        async (payload: UpdateProfileDto): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const profile = await authService.updateProfile(payload);
                setUser(profile);
                return { success: true, data: profile };
            } catch (err: any) {
                const message = err?.message || 'Failed to update profile';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const setPreferences = useCallback(
        async (artistIds: string[], genreIds: string[], moodIds: string[]): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.setPreferences({ artistIds, genreIds, moodIds });
                return { success: true, data };
            } catch (err: any) {
                const message = err?.message || 'Failed to set preferences';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updatePreferences = useCallback(
        async (payload: UpdatePreferencesDto): Promise<AuthResult> => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.updatePreferences(payload);
                return { success: true, data };
            } catch (err: any) {
                const message = err?.message || 'Failed to update preferences';
                setError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        // Auth state
        isAuthenticated,
        loading,
        error,
        user,

        // Auth methods (standard naming)
        register,
        login,
        googleLogin,
        logout,
        refreshToken,

        // Password reset
        forgotPassword,
        resetPassword,

        // Profile
        getProfile,
        updateProfile,

        // Preferences
        setPreferences,
        updatePreferences,

        // Backward compatibility aliases
        signup,
        signout,
    };
}

export { useAuth };
export default useAuth;
