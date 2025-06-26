import { AuthStatus } from "./gen/authStatus"

export interface LoginData {
    serverUrl: string
    accessToken: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    user?: AuthStatus
}

export interface AuthState {
    isAuthenticated: boolean
    user?: LoginResponse['user']
    serverUrl?: string
    accessToken?: string
} 