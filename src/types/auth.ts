export interface LoginData {
    serverUrl: string
    accessToken: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    user?: {
        id: string
        name: string
        email?: string
    }
}

export interface AuthState {
    isAuthenticated: boolean
    user?: LoginResponse['user']
    serverUrl?: string
    accessToken?: string
} 