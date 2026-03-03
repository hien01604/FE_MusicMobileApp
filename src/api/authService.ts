import { apiClient } from "./apiClient";
import {
    LoginRequest,
    LoginResponse,
    LoginResponseData,
    SignupRequest,
    SignupResponse,
    SignupResponseData,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ForgotPasswordResponseData,
} from "../types/auth.types";

class AuthService {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponseData>(
            "/auth/login",
            payload
        );
    }

    async signup(payload: SignupRequest): Promise<SignupResponse> {
        return apiClient.post<SignupResponseData>(
            "/auth/signup",
            payload
        );
    }

    async forgotPassword(
        payload: ForgotPasswordRequest
    ): Promise<ForgotPasswordResponse> {
        return apiClient.post<ForgotPasswordResponseData>(
            "/auth/forgot-password",
            payload
        );
    }

    logout(): void {
        apiClient.clearToken();
    }

    setAuthToken(token: string): void {
        apiClient.setToken(token);
    }
}

export const authService = new AuthService();
