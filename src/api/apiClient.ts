import { ApiResponse } from "../types/auth.types";
import { API_CONFIG } from "../config/api.config";

const BASE_URL = API_CONFIG.BASE_URL;

interface RequestConfig {
    headers?: Record<string, string>;
    method?: string;
    body?: any;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string = BASE_URL) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string): void {
        this.token = token;
    }

    clearToken(): void {
        this.token = null;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T = any>(
        endpoint: string,
        config: RequestConfig
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = this.getHeaders();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

            const response = await fetch(url, {
                method: config.method || "GET",
                headers: { ...headers, ...config.headers },
                body: config.body ? JSON.stringify(config.body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            let data: any;
            try {
                data = await response.json();
            } catch (jsonError) {
                // Response is not valid JSON
                return {
                    success: false,
                    status: response.status,
                    message: "Invalid response format from server",
                    error: "Failed to parse response JSON",
                };
            }

            if (!response.ok) {
                return {
                    success: false,
                    status: response.status,
                    message: data.message || "An error occurred",
                    error: data.error || data.message,
                };
            }

            return {
                success: true,
                status: response.status,
                message: data.message || "Success",
                data: data.data,
            };
        } catch (error: any) {
            if (error.name === "AbortError") {
                return {
                    success: false,
                    status: 408,
                    message: "Request timeout",
                    error: "Request timeout",
                };
            }

            return {
                success: false,
                status: 500,
                message: error.message || "Network error",
                error: error.message,
            };
        }
    }

    async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET" });
    }

    async post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body,
        });
    }

    async put<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body,
        });
    }

    async patch<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body,
        });
    }

    async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }
}

export const apiClient = new ApiClient();
