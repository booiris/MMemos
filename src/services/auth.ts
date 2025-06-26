import type { LoginData, LoginResponse } from '@/types/auth'
import fetch from '@/lib/fetchWrapper'

export class AuthService {
    private static instance: AuthService
    private serverUrl: string = ''
    private accessToken: string = ''

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    async login(data: LoginData): Promise<LoginResponse> {
        try {
            if (!this.isValidUrl(data.serverUrl)) {
                throw new Error('invalid server url')
            }

            if (!data.accessToken.trim()) {
                throw new Error('access token is required')
            }

            const response = await this.testConnection(data.serverUrl, data.accessToken)

            if (response.success) {
                this.serverUrl = data.serverUrl
                this.accessToken = data.accessToken
                return response
            } else {
                throw new Error(response.message || 'login failed')
            }
        } catch (error) {
            console.error(error instanceof Error ? error.message : 'unknown error')
            return {
                success: false,
                message: error instanceof Error ? error.message : 'login failed'
            }
        }
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    private async testConnection(serverUrl: string, accessToken: string): Promise<LoginResponse> {
        try {
            const apiUrl = `${serverUrl.replace(/\/$/, '')}/api/v1/auth/status`

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 8000)
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal
            })
            clearTimeout(timeoutId)

            console.log(response)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const userData = await response.json()

            return {
                success: true,
                user: {
                    id: userData.id || 'unknown',
                    name: userData.name || 'Unknown User',
                    email: userData.email
                }
            }
        } catch (error) {
            let message = 'connect to server failed'
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    message = 'connection timeout (8 seconds)'
                } else {
                    message = error.message
                }
            }
            return {
                success: false,
                message
            }
        }
    }

    logout(): void {
        this.serverUrl = ''
        this.accessToken = ''
    }

    isAuthenticated(): boolean {
        return !!(this.serverUrl && this.accessToken)
    }

    getServerUrl(): string {
        return this.serverUrl
    }

    getAccessToken(): string {
        return this.accessToken
    }
}

export const authService = AuthService.getInstance() 