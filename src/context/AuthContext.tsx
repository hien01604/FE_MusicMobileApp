import React, { createContext, useEffect, useMemo, useState, ReactNode } from "react";
import { User } from "../types/auth.types";
import { tokenStorage } from "../../utils/tokenStorage";

interface AuthResult {
    success: boolean;
    message: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (username: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const MOCK_TOKEN = "fake_token_123";

const randomDelay = (): Promise<void> => {
    const delay = 500 + Math.floor(Math.random() * 501);
    return new Promise((resolve) => setTimeout(resolve, delay));
};

const getUsernameFromEmail = (email: string): string => {
    const localPart = email.split("@")[0] || "music_user";
    return localPart.replace(/[^a-zA-Z0-9_]/g, "_");
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const bootstrapAuth = async (): Promise<void> => {
            try {
                const { token: storedToken, user: storedUser } = await tokenStorage.getAuthData();

                if (storedToken) {
                    setToken(storedToken);
                    setUser(
                        storedUser || {
                            id: "mock-user-1",
                            username: "music_user",
                            email: "user@example.com",
                        }
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    const login = async (email: string, _password: string): Promise<AuthResult> => {
        await randomDelay();

        const mockUser: User = {
            id: "mock-user-1",
            username: getUsernameFromEmail(email),
            email,
        };

        setUser(mockUser);
        setToken(MOCK_TOKEN);

        // Optional persistence for app restarts. Remove if you want pure in-memory auth only.
        await tokenStorage.saveAuthData(MOCK_TOKEN, mockUser);

        // Optional AsyncStorage-only approach:
        // await AsyncStorage.setItem("@auth_token", MOCK_TOKEN);

        return { success: true, message: "Login successful" };
    };

    const signup = async (username: string, email: string, _password: string): Promise<AuthResult> => {
        await randomDelay();

        const mockUser: User = {
            id: `mock-user-${Date.now()}`,
            username,
            email,
        };

        setUser(mockUser);
        setToken(MOCK_TOKEN);

        // Optional persistence for app restarts. Remove if you want pure in-memory auth only.
        await tokenStorage.saveAuthData(MOCK_TOKEN, mockUser);

        return { success: true, message: "Signup successful" };
    };

    const logout = async (): Promise<void> => {
        setUser(null);
        setToken(null);

        await tokenStorage.clearAllAuthData();
    };

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(user && token),
            isLoading,
            login,
            signup,
            logout,
        }),
        [user, token, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
