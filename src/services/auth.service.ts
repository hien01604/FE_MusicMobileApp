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
        return resp.data as AuthResponseDto;
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
        return resp.data as AuthResponseDto;
    } catch (err) {
        throw handleAuthError(err, 'Login failed');
    }
}

/**
 * POST /auth/google
 * Login with Google idToken
 */
export async function googleLogin(payload: GoogleLoginDto): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/google', payload);
        return resp.data as AuthResponseDto;
    } catch (err) {
        throw handleAuthError(err, 'Google login failed');
    }
}

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
export async function refreshToken(payload: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
        const resp = await api.post('/auth/refresh', payload);
        return resp.data as AuthResponseDto;
    } catch (err) {
        throw handleAuthError(err, 'Token refresh failed');
    }
}

/**
 * POST /auth/logout
 * Logout and revoke refresh token
 */
export async function logout(payload: RefreshTokenDto): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/logout', payload);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Logout failed');
    }
}

/**
 * POST /auth/forgot-password
 * Request password reset email
 */
export async function forgotPassword(payload: ForgotPasswordDto): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/forgot-password', payload);
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

/**
 * GET /auth/me
 * Get current user profile
 * Requires JWT in Authorization header (handled by interceptor)
 */
export async function getProfile(): Promise<UserProfileDto> {
    try {
        const resp = await api.get('/auth/me');
        return resp.data as UserProfileDto;
    } catch (err) {
        throw handleAuthError(err, 'Failed to fetch profile');
    }
}

/**
 * PUT /auth/me
 * Update current user profile
 * Requires JWT in Authorization header (handled by interceptor)
 */
export async function updateProfile(payload: UpdateProfileDto): Promise<UserProfileDto> {
    try {
        const resp = await api.put('/auth/me', payload);
        return resp.data as UserProfileDto;
    } catch (err) {
        throw handleAuthError(err, 'Failed to update profile');
    }
}

/**
 * POST /auth/preferences
 * Set user preferences (onboarding)
 * Requires JWT in Authorization header (handled by interceptor)
 * Must have ≥3 artists, ≥1 genre, ≥1 mood
 */
export async function setPreferences(payload: SetPreferencesDto): Promise<{ message: string }> {
    try {
        const resp = await api.post('/auth/preferences', payload);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Failed to set preferences');
    }
}

/**
 * PUT /auth/preferences
 * Update user preferences (all fields optional)
 * Requires JWT in Authorization header (handled by interceptor)
 */
export async function updatePreferences(payload: UpdatePreferencesDto): Promise<{ message: string }> {
    try {
        const resp = await api.put('/auth/preferences', payload);
        return resp.data as { message: string };
    } catch (err) {
        throw handleAuthError(err, 'Failed to update preferences');
    }
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
