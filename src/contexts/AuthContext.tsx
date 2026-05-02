import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/auth.service";
import { UserProfileDto } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

interface AuthResult {
    success: boolean;
    message?: string;
}

interface AuthContextType {
    user: UserProfileDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (username: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 🔥 INIT APP (check token)
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

                if (token) {
                    setIsAuthenticated(true);

                    // optional: fetch profile
                    try {
                        const profile = await authService.getProfile();
                        setUser(profile);
                    } catch {
                        // token invalid → logout
                        await handleLogout();
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // 🔥 LOGIN
    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            const data = await authService.login({ email, password });

            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

            setUser(data.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    // 🔥 SIGNUP
    const signup = async (
        username: string,
        email: string,
        password: string
    ): Promise<AuthResult> => {
        try {
            const data = await authService.register({ username, email, password });

            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

            setUser(data.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    // 🔥 LOGOUT (CORE FIX)
    const handleLogout = async () => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

        try {
            if (refreshToken) {
                await authService.logout({ refreshToken });
            }
        } catch {
            // ignore BE error
        }

        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

        setUser(null);
        setIsAuthenticated(false);
    };

    const logout = async () => {
        await handleLogout();
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            login,
            signup,
            logout,
        }),
        [user, isAuthenticated, isLoading]
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