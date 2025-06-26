import type { LoginData, LoginResponse } from '@/types/auth'
import { client } from './client'

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
        if (!isValidUrl(data.serverUrl)) {
            throw new Error('invalid server url')
        }

        if (!data.accessToken.trim()) {
            throw new Error('access token is required')
        }

        const response = await testConnection(data.serverUrl, data.accessToken)

        if (response.success) {
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

export function logout() {
    client.http.setSecurityData(null)
    client.http.baseUrl = ''
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

async function testConnection(serverUrl: string, accessToken: string): Promise<LoginResponse> {
    try {
        client.http.baseUrl = serverUrl
        client.http.setSecurityData(accessToken)

        const response = await client.api.authServiceGetAuthStatus({
            secure: true,
        })

        return {
            success: true,
            user: response
        }
    } catch (error) {
        let message = 'connect to server failed, error: ' + error
        return {
            success: false,
            message
        }
    }
}