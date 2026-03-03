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


// ================= SIGNUP =================

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface SignupResponseData {
    user: User;
    token: string;
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