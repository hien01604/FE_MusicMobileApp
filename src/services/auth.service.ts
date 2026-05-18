import api from './api';
import axios from 'axios';
import {
    RegisterDto,
    LoginDto,
    GoogleLoginDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    UpdateProfileDto,
    SetPreferencesDto,
    UpdatePreferencesDto,
    AuthResponseDto,
    UserProfileDto,
} from '../types/auth.types';

/**
 * POST /auth/register
 * Register new user
 */
export async function register(payload: RegisterDto): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/register', payload);
        return normalizeAuthResponse(resp.data);
    } catch (err) {
        throw handleAuthError(err, 'Registration failed');
    }
}

/**
 * POST /auth/login
 * Login with email and password
 */
export async function login(payload: LoginDto): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/login', payload);
        return normalizeAuthResponse(resp.data);
    } catch (err) {
        throw handleAuthError(err, 'Login failed');
    }
}

/**
 * POST /auth/google
 * Login with Google idToken
 */
export async function googleLogin(idToken: string): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/google', { idToken } satisfies GoogleLoginDto);
        return normalizeAuthResponse(resp.data);
    } catch (err) {
        throw handleAuthError(err, 'Google login failed');
    }
}

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/refresh', { refreshToken } satisfies RefreshTokenDto);
        return normalizeAuthResponse(resp.data);
    } catch (err) {
        throw handleAuthError(err, 'Token refresh failed');
    }
}

/**
 * POST /auth/logout
 * Logout and revoke refresh token
 */
export async function logout(refreshToken: string): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/logout', { refreshToken } satisfies RefreshTokenDto);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Logout failed');
    }
}

/**
 * POST /auth/forgot-password
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/forgot-password', { email } satisfies ForgotPasswordDto);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Failed to send reset email');
    }
}

/**
 * POST /auth/reset-password
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/reset-password', {
            token,
            newPassword,
        } satisfies ResetPasswordDto);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Password reset failed');
    }
}

/**
 * Backend AuthController does not expose profile routes yet.
 */
export async function getProfile(): Promise<UserProfileDto> {
    throw new Error('Profile API is not available. Ask backend team to add GET /auth/profile.');
}

/**
 * Backend AuthController does not expose profile routes yet.
 */
export async function updateProfile(payload: UpdateProfileDto): Promise<UserProfileDto> {
    void payload;
    throw new Error('Profile API is not available. Ask backend team to add PATCH /auth/profile.');
}

/**
 * Backend AuthController does not expose preferences routes yet.
 */
export async function setPreferences(payload: SetPreferencesDto): Promise<{ message: string }> {
    void payload;
    throw new Error('Preferences API is not available. Ask backend team to add POST /auth/preferences.');
}

/**
 * Backend AuthController does not expose preferences routes yet.
 */
export async function updatePreferences(payload: UpdatePreferencesDto): Promise<{ message: string }> {
    void payload;
    throw new Error('Preferences API is not available. Ask backend team to add PATCH /auth/preferences.');
}

function unwrapData(data: unknown): unknown {
    if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: unknown }).data;
    }

    return data;
}

function normalizeAuthResponse(data: unknown): AuthResponseDto {
    const payload = unwrapData(data) as Record<string, any>;
    const accessToken = payload.accessToken ?? payload.access_token ?? payload.token;
    const refreshToken = payload.refreshToken ?? payload.refresh_token;

    if (!accessToken || !refreshToken || !payload.user) {
        throw new Error('Invalid auth response from server');
    }

    return {
        accessToken,
        refreshToken,
        user: payload.user as UserProfileDto,
    };
}

/**
 * Handle auth API errors and extract message
 */
function handleAuthError(err: unknown, fallbackMessage: string): Error {
    let message = fallbackMessage;

    if (axios.isAxiosError(err)) {
        if (err.response?.data) {
            const data = err.response.data as any;
            if (typeof data.message === 'string') {
                message = data.message;
            } else if (Array.isArray(data.message)) {
                message = data.message.join(' ');
            } else if (data.error) {
                message = String(data.error);
            }
        } else if (err.message) {
            message = err.message;
        }
    } else if (err instanceof Error) {
        message = err.message;
    }

    return new Error(message);
}
