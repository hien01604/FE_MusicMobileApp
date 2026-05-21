import api from './api';
import axios from 'axios';
import type {
    AuthResponseDto,
    ForgotPasswordDto,
    GoogleLoginDto,
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
    ResetPasswordDto,
    SetPreferencesDto,
    UpdatePreferencesDto,
    UpdateProfileDto,
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
export async function loginWithGoogle(idToken: string): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/google', { idToken } satisfies GoogleLoginDto);
        return normalizeAuthResponse(resp.data);
    } catch (err) {
        throw handleAuthError(err, 'Google login failed');
    }
}

export const googleLogin = loginWithGoogle;

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
export async function resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/reset-password', payload);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Password reset failed');
    }
}

export async function getProfile(): Promise<UserProfileDto> {
    const resp = await api.get('/users/me');
    return unwrapData(resp.data) as UserProfileDto;
}

export async function updateProfile(payload: UpdateProfileDto): Promise<UserProfileDto> {
    const resp = await api.put('/users/me', payload);
    return unwrapData(resp.data) as UserProfileDto;
}

export async function setPreferences(payload: SetPreferencesDto): Promise<{ message: string }> {
    const resp = await api.post('/users/preferences', payload);
    return resp.data as { message: string };
}

export async function updatePreferences(payload: UpdatePreferencesDto): Promise<{ message: string }> {
    const resp = await api.put('/users/preferences', payload);
    return resp.data as { message: string };
}

function unwrapData(data: unknown): unknown {
    if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: unknown }).data;
    }

    return data;
}

export function normalizeAuthResponse(data: unknown): AuthResponseDto {
    const payload = unwrapData(data) as Record<string, unknown>;
    const accessToken = payload.accessToken ?? payload.access_token ?? payload.token;
    const refreshToken = payload.refreshToken ?? payload.refresh_token;

    if (
        typeof accessToken !== 'string' ||
        typeof refreshToken !== 'string' ||
        !payload.user ||
        typeof payload.user !== 'object'
    ) {
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
        if (err.response) {
            const { status, data } = err.response;
            const payload = data as Record<string, unknown> | undefined;
            if (payload) {
                if (typeof payload.message === 'string') {
                    message = payload.message;
                } else if (Array.isArray(payload.message)) {
                    message = payload.message.map(String).join(' ');
                } else if (payload.error) {
                    message = String(payload.error);
                } else {
                    try {
                        message = JSON.stringify(payload);
                    } catch (_e) {
                        message = String(payload);
                    }
                }
            } else if (err.message) {
                message = err.message;
            }

            if (status) {
                message = `[${status}] ${message}`;
            }
        } else if (err.message) {
            message = err.message;
        }
    } else if (err instanceof Error) {
        message = err.message;
    }

    return new Error(message);
}
