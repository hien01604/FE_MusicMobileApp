import { Platform } from "react-native";

export const API_CONFIG = {
    TIMEOUT: 15000,
};

const LOCAL_API_URL = "http://localhost:3000/api";

// Optional: Add different configs for different environments
export const ENV = {
    DEV: "development",
    PROD: "production",
};

function normalizeApiUrl(baseUrl: string): string {
    const url = baseUrl.trim().replace(/\/+$/, "");

    // Swagger lives at /api/docs. Resource requests must use the /api root.
    return url.replace(/\/docs$/, "");
}

export const getApiUrl = (): string => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || LOCAL_API_URL;
    const normalizedUrl = normalizeApiUrl(baseUrl);

    if (
        Platform.OS === "android" &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i.test(normalizedUrl)
    ) {
        return normalizedUrl.replace(/\/\/(localhost|127\.0\.0\.1)/i, "//10.0.2.2");
    }

    return normalizedUrl;
};
