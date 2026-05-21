import axios, { InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, getApiUrl } from "../config/api.config";
import {
    clearAuthData,
    getAccessToken,
    getRefreshToken,
    saveAuthData,
} from "./auth.storage";
import { AuthResponseDto } from "../types/auth.types";

type RetryableRequest = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: RetryableRequest[] = [];
let unauthorizedHandler: (() => void) | null = null;

const api = axios.create({
    baseURL: getApiUrl(),
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: getApiUrl(),
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

export function setUnauthorizedHandler(handler: (() => void) | null): void {
    unauthorizedHandler = handler;
}

function resolveRefreshQueue(error: unknown, token?: string): void {
    refreshQueue.forEach((request) => {
        if (error || !token) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });
    refreshQueue = [];
}

function unwrapData(data: unknown): unknown {
    if (data && typeof data === "object" && "data" in data) {
        return (data as { data: unknown }).data;
    }

    return data;
}

function normalizeAuthResponse(data: unknown): AuthResponseDto {
    const payload = unwrapData(data) as Record<string, unknown>;
    const accessToken = payload.accessToken ?? payload.access_token ?? payload.token;
    const refreshToken = payload.refreshToken ?? payload.refresh_token;

    if (
        typeof accessToken !== "string" ||
        typeof refreshToken !== "string" ||
        !payload.user ||
        typeof payload.user !== "object"
    ) {
        throw new Error("Invalid auth response from server");
    }

    return {
        accessToken,
        refreshToken,
        user: payload.user as AuthResponseDto["user"],
    };
}

function isAuthSessionRequest(url?: string): boolean {
    return Boolean(
        url &&
        [
            "/auth/login",
            "/auth/register",
            "/auth/google",
            "/auth/refresh",
            "/auth/logout",
            "/auth/forgot-password",
            "/auth/reset-password",
        ].some((path) => url.includes(path))
    );
}

api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RequestConfigWithRetry | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthSessionRequest(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        const currentRefreshToken = await getRefreshToken();
        if (!currentRefreshToken) {
            await clearAuthData();
            unauthorizedHandler?.();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((token) => {
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const response = await refreshClient.post("/auth/refresh", {
                refreshToken: currentRefreshToken,
            });
            const authData = normalizeAuthResponse(response.data);
            await saveAuthData(authData);
            resolveRefreshQueue(null, authData.accessToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
            }

            return api(originalRequest);
        } catch (refreshError) {
            resolveRefreshQueue(refreshError);
            await clearAuthData();
            unauthorizedHandler?.();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
