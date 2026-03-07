import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../api/authService";
import { User } from "../types/auth.types";
import { tokenStorage } from "../../utils/tokenStorage";
import { tokenManager } from "../../utils/tokenManager";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isAuthenticated = !!user && !!token;

    // Load user and token from storage on app start
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const { token: storedToken, user: storedUser } = await tokenStorage.getAuthData();

            if (storedToken && storedUser) {
                // Check if token is expired
                if (tokenManager.isTokenExpired(storedToken)) {
                    console.log("Token expired, clearing auth data");
                    await tokenStorage.clearAllAuthData();
                    setIsLoading(false);
                    return;
                }

                setToken(storedToken);
                setUser(storedUser);
                authService.setAuthToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to load auth from storage:", error);
            await tokenStorage.clearAllAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    const saveAuthToStorage = async (token: string, user: User, refreshToken?: string): Promise<void> => {
        try {
            await tokenStorage.saveAuthData(token, user, refreshToken);
        } catch (error) {
            console.error("Failed to save auth to storage:", error);
            throw error;
        }
    };

    const clearAuthFromStorage = async (): Promise<void> => {
        try {
            await tokenStorage.clearAllAuthData();
        } catch (error) {
            console.error("Failed to clear auth from storage:", error);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const result = await authService.login({ email, password });

            if (result.success && result.data) {
                const { user: userData, token: userToken } = result.data;
                setUser(userData);
                setToken(userToken);
                authService.setAuthToken(userToken);
                await saveAuthToStorage(userToken, userData);

                return { success: true, message: "Login successful" };
            }

            return { success: false, message: result.message || "Login failed" };
        } catch (error: any) {
            return { success: false, message: error.message || "An error occurred" };
        }
    };

    const signup = async (
        username: string,
        email: string,
        password: string
    ): Promise<{ success: boolean; message: string }> => {
        try {
            const result = await authService.signup({ username, email, password });

            if (result.success && result.data) {
                const { user: userData, token: userToken } = result.data;
                setUser(userData);
                setToken(userToken);
                authService.setAuthToken(userToken);
                await saveAuthToStorage(userToken, userData);

                return { success: true, message: "Signup successful" };
            }

            return { success: false, message: result.message || "Signup failed" };
        } catch (error: any) {
            return { success: false, message: error.message || "An error occurred" };
        }
    };

    const logout = async (): Promise<void> => {
        setUser(null);
        setToken(null);
        authService.logout();
        await clearAuthFromStorage();
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
