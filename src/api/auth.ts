import type { LoginData, LoginResponse } from '@/types/auth'
import fetch from '@/lib/fetchWrapper'

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
        const apiUrl = `${serverUrl.replace(/\/$/, '')}/api/v1/auth/status`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
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

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const userData = await response.json()

        return {
            success: true,
            user: userData
        }
    } catch (error) {
        let message = 'connect to server failed'
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                message = 'connection timeout (4 seconds)'
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