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

const baseUrl = getApiUrl();
// Log base URL at startup to help debugging environment issues
// (remove or guard this in production if desired)
// eslint-disable-next-line no-console
console.log('API base URL:', baseUrl);

const api = axios.create({
    baseURL: baseUrl,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: baseUrl,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isHtmlResponse(data: string): boolean {
    return /<!doctype html|<html[\s>]/i.test(data);
}

function isNgrokOfflineResponse(data: string): boolean {
    return /ERR_NGROK_3200|endpoint .*ngrok-free\.app is offline/i.test(data);
}

function summarizeResponseData(data: unknown): unknown {
    if (typeof data === "string") {
        if (isNgrokOfflineResponse(data)) {
            return "ngrok endpoint is offline";
        }

        if (isHtmlResponse(data)) {
            return "HTML error page returned by API host";
        }

        return data.length > 300 ? `${data.slice(0, 300)}...` : data;
    }

    return data;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error ? error.message : fallbackMessage;
    }

    if (!error.response) {
        if (error.code === "ECONNABORTED") {
            return "API request timed out. Check that the backend is running and reachable.";
        }

        return error.message || fallbackMessage;
    }

    const { status, data } = error.response;
    let message = fallbackMessage;

    if (typeof data === "string") {
        if (isNgrokOfflineResponse(data)) {
            message = "API tunnel is offline. Start a new ngrok tunnel, update EXPO_PUBLIC_API_URL, then restart Expo.";
        } else if (isHtmlResponse(data)) {
            message = "API host returned an HTML error page instead of JSON. Check EXPO_PUBLIC_API_URL.";
        } else if (data.trim()) {
            message = data.trim();
        }
    } else if (isRecord(data)) {
        if (typeof data.message === "string") {
            message = data.message;
        } else if (Array.isArray(data.message)) {
            message = data.message.map(String).join(" ");
        } else if (data.error) {
            message = String(data.error);
        }
    } else if (error.message) {
        message = error.message;
    }

    return status ? `[${status}] ${message}` : message;
}

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
            // Log only errors that will actually be returned to callers. A 401
            // may still be recovered below by refreshing the access token.
            // eslint-disable-next-line no-console
            console.error('API error:', {
                url: error?.config?.url,
                method: error?.config?.method,
                status: error?.response?.status,
                data: summarizeResponseData(error?.response?.data),
                message: getApiErrorMessage(error, "API request failed"),
            });
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
