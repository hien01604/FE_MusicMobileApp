import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import * as authService from "../services/auth.service";
import { AuthResponseDto, RegisterDto, UserProfileDto } from "../types/auth.types";
import {
    clearAuthData,
    getAccessToken,
    getRefreshToken,
    getStoredUser,
    saveAuthData,
    saveStoredUser,
} from "../services/auth.storage";
import { setUnauthorizedHandler } from "../services/api";
import { getMe } from "../services/users.service";

interface AuthResult {
    success: boolean;
    data?: unknown;
    message?: string;
}

interface AuthContextType {
    user: UserProfileDto | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loading: boolean;
    error: string | null;

    register: (data: RegisterDto) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (username: string, email: string, password: string) => Promise<AuthResult>;
    googleLogin: (idToken: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<AuthResult>;
    resetPassword: (token: string, newPassword: string) => Promise<AuthResult>;
    setAuth: (data: AuthResponseDto) => Promise<void>;
    setUserProfile: (user: UserProfileDto) => Promise<void>;
    clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
                    getAccessToken(),
                    getRefreshToken(),
                    getStoredUser(),
                ]);

                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setUser(storedUser);

                if (storedAccessToken && storedRefreshToken) {
                    const profile = await getMe();
                    await saveStoredUser(profile);
                    setUser(profile);
                }
            } catch (err) {
                await clearAuthData();
                setAccessToken(null);
                setRefreshToken(null);
                setUser(null);
                setError(err instanceof Error ? err.message : "Failed to restore auth session");
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const clearAuth = async () => {
        await clearAuthData();
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
    };

    useEffect(() => {
        setUnauthorizedHandler(() => {
            void clearAuth();
        });

        return () => {
            setUnauthorizedHandler(null);
        };
    }, []);

    const setAuth = async (data: AuthResponseDto) => {
        await saveAuthData(data);
        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setError(null);
    };

    const setUserProfile = async (profile: UserProfileDto) => {
        await saveStoredUser(profile);
        setUser(profile);
        setError(null);
    };

    const runAuthAction = async (
        action: () => Promise<AuthResponseDto>,
        fallbackMessage: string
    ): Promise<AuthResult> => {
        try {
            setLoading(true);
            setError(null);
            const data = await action();
            await setAuth(data);
            return { success: true, data };
        } catch (err: any) {
            const message = err?.message || fallbackMessage;
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterDto): Promise<AuthResult> =>
        runAuthAction(() => authService.register(data), "Registration failed");

    const login = async (email: string, password: string): Promise<AuthResult> =>
        runAuthAction(() => authService.login({ email, password }), "Login failed");

    const signup = async (
        username: string,
        email: string,
        password: string
    ): Promise<AuthResult> => register({ username, email, password });

    const googleLogin = async (idToken: string): Promise<AuthResult> =>
        runAuthAction(() => authService.loginWithGoogle(idToken), "Google login failed");

    const logout = async () => {
        try {
            const currentRefreshToken = await getRefreshToken();
            if (currentRefreshToken) {
                await authService.logout(currentRefreshToken);
            }
        } catch (err: any) {
            setError(err?.message || "Logout failed");
        } finally {
            await clearAuth();
        }
    };

    const forgotPassword = async (email: string): Promise<AuthResult> => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.forgotPassword(email);
            return { success: true, data };
        } catch (err: any) {
            const message = err?.message || "Failed to send reset email";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string): Promise<AuthResult> => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.resetPassword({ token, newPassword });
            return { success: true, data };
        } catch (err: any) {
            const message = err?.message || "Password reset failed";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = Boolean(accessToken && refreshToken && user);

    const value = useMemo(
        () => ({
            user,
            accessToken,
            refreshToken,
            isAuthenticated,
            isLoading,
            loading,
            error,
            register,
            login,
            signup,
            googleLogin,
            logout,
            forgotPassword,
            resetPassword,
            setAuth,
            setUserProfile,
            clearAuth,
        }),
        [user, accessToken, refreshToken, isAuthenticated, isLoading, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
};
