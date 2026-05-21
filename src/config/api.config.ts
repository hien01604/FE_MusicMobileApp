export const API_CONFIG = {
    TIMEOUT: 15000,
};

// Optional: Add different configs for different environments
export const ENV = {
    DEV: "development",
    PROD: "production",
};

export const getApiUrl = (): string => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
        throw new Error("Missing EXPO_PUBLIC_API_URL");
    }

    return baseUrl;
};
