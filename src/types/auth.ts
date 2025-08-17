import { V1User } from "@/api/schema/api"

export interface LoginData {
    serverUrl: string
    accessToken: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    user?: V1User
}

export interface AuthState {
    isAuthenticated: boolean
    user?: V1User
    serverUrl?: string
    accessToken?: string
} 