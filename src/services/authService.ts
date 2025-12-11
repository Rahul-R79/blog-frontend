import api from "../config/api";

export interface SignUpData {
    displayName: string;
    email: string;
    password: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        displayName: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface MeResponse {
    valid: boolean;
    userId: string;
}

class AuthService {
    async signUp(data: SignUpData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/signup", data);
        return response.data;
    }

    async signIn(data: SignInData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/signin", data);
        return response.data;
    }

    async refreshToken(): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const response = await api.post("/auth/refresh");
        return response.data;
    }

    async getMe(): Promise<MeResponse> {
        const response = await api.get<MeResponse>("/auth/me");
        return response.data;
    }

    async logout(): Promise<void> {
        await api.post("/auth/logout");
    }
}


const authservice = new AuthService();
export default authservice;