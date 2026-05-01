// ================= GENERIC API RESPONSE =================
export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data?: T;
    error?: string | Record<string, any>;
}

// ================= USER =================
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ================= LOGIN =================

// Request gửi lên BE
export interface LoginRequest {
    email: string;
    password: string;
}

// Data BE trả về trong field data
export interface LoginResponseData {
    user: User;
    token: string;
    refreshToken?: string;
}

// Response tổng thể
export type LoginResponse = ApiResponse<LoginResponseData>;


// ================= SIGNUP / REGISTER =================

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface SignupResponseData {
    user: User;
    token: string;
}

// ================= AUTH RESPONSE (from NestJS) =================

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface GoogleLoginDto {
    idToken: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}

export interface UpdateProfileDto {
    username?: string;
}

export interface SetPreferencesDto {
    artistIds: string[];
    genreIds: string[];
    moodIds: string[];
}

export interface UpdatePreferencesDto {
    artistIds?: string[];
    genreIds?: string[];
    moodIds?: string[];
}

export interface UserProfileDto {
    id: string;
    email: string;
    username: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserProfileDto;
}

export type SignupResponse = ApiResponse<SignupResponseData>;


// ================= FORGOT PASSWORD =================

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponseData {
    message: string;
    resetTokenSent: boolean;
}

export type ForgotPasswordResponse = ApiResponse<ForgotPasswordResponseData>;