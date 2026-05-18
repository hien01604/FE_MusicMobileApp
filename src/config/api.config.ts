const ENV_API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    process.env.NEXT_PUBLIC_API_URL;
const DEV_FALLBACK_API_URL = "http://localhost:3000/api";

export const API_CONFIG = {
    BASE_URL: ENV_API_URL || DEV_FALLBACK_API_URL,
    TIMEOUT: 15000,
};

// Optional: Add different configs for different environments
export const ENV = {
    DEV: "development",
    PROD: "production",
};

export const getApiUrl = (): string => {
    return API_CONFIG.BASE_URL;
};
