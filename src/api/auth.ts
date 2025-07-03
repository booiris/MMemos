import type { LoginData, LoginResponse } from '@/types/auth'
import client from './client'
import { getError } from './error'
import { isValidUrl } from '@/lib/urlHelper'

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
        console.error('[login] ' + error)
        return {
            success: false,
            message: error instanceof Error ? error.message : 'login failed',
        }
    }
}

export function logout() {
    client.http.setSecurityData(null)
    client.http.baseUrl = ''
}

async function testConnection(
    serverUrl: string,
    accessToken: string
): Promise<LoginResponse> {
    try {
        client.http.baseUrl = serverUrl
        client.http.setSecurityData(accessToken)

        console.log('[testConnection] serverUrl', serverUrl)

        const response = await client.api.authServiceGetAuthStatus({
            secure: true,
            signal: AbortSignal.timeout(6000),
        })

        return {
            success: true,
            user: response,
        }
    } catch (error) {
        let message = 'Error: ' + getError(error)
        return {
            success: false,
            message,
        }
    }
}
