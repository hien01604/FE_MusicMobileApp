interface JWTPayload {
    exp?: number;
    iat?: number;
    userId?: string;
    email?: string;
    [key: string]: any;
}

class TokenManager {
    /**
     * Decode JWT token (without verification)
     * Note: This only decodes the payload, does not verify signature
     */
    decodeToken(token: string): JWTPayload | null {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                console.error("Invalid JWT format");
                return null;
            }

            const payload = parts[1];
            const decoded = this.base64UrlDecode(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }

    /**
     * Base64 URL decode
     */
    private base64UrlDecode(str: string): string {
        // Replace URL-safe characters
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

        // Add padding if needed
        const pad = base64.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error("Invalid base64 string");
            }
            base64 += new Array(5 - pad).join("=");
        }

        // Decode base64
        try {
            return decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
        } catch (error) {
            throw new Error("Failed to decode base64");
        }
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) {
                return true;
            }

            // exp is in seconds, Date.now() is in milliseconds
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            console.error("Failed to check token expiry:", error);
            return true;
        }
    }

    /**
     * Get token expiration date
     */
    getTokenExpirationDate(token: string): Date | null {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) {
                return null;
            }

            return new Date(decoded.exp * 1000);
        } catch (error) {
            console.error("Failed to get token expiration date:", error);
            return null;
        }
    }

    /**
     * Get time remaining until token expires (in seconds)
     */
    getTimeUntilExpiry(token: string): number {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) {
                return 0;
            }

            const currentTime = Date.now() / 1000;
            const timeRemaining = decoded.exp - currentTime;
            return Math.max(0, timeRemaining);
        } catch (error) {
            console.error("Failed to get time until expiry:", error);
            return 0;
        }
    }

    /**
     * Check if token will expire soon (within threshold seconds)
     */
    willExpireSoon(token: string, thresholdSeconds: number = 300): boolean {
        try {
            const timeRemaining = this.getTimeUntilExpiry(token);
            return timeRemaining > 0 && timeRemaining <= thresholdSeconds;
        } catch (error) {
            console.error("Failed to check if token will expire soon:", error);
            return true;
        }
    }

    /**
     * Validate token format
     */
    isValidTokenFormat(token: string): boolean {
        if (!token || typeof token !== "string") {
            return false;
        }

        const parts = token.split(".");
        return parts.length === 3;
    }

    /**
     * Get user ID from token
     */
    getUserIdFromToken(token: string): string | null {
        try {
            const decoded = this.decodeToken(token);
            return decoded?.userId || decoded?.sub || null;
        } catch (error) {
            console.error("Failed to get user ID from token:", error);
            return null;
        }
    }
}

export const tokenManager = new TokenManager();
