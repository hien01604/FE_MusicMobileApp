// API Configuration
export const API_CONFIG = {
    // Change this to your actual API URL
    BASE_URL: "http://localhost:3000/api",
    // BASE_URL: "https://your-production-api.com/api",

    TIMEOUT: 10000, // 10 seconds
};

// Optional: Add different configs for different environments
export const ENV = {
    DEV: "development",
    PROD: "production",
};

// You can switch based on __DEV__ flag
export const getApiUrl = (): string => {
    if (__DEV__) {
        return "http://localhost:3000/api"; // Development
    }
    return "https://your-production-api.com/api"; // Production
};
