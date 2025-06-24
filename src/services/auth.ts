import type { LoginData, LoginResponse } from '@/types/auth'

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
            // 验证服务器地址格式
            if (!this.isValidUrl(data.serverUrl)) {
                throw new Error('无效的服务器地址')
            }

            // 验证访问令牌
            if (!data.accessToken.trim()) {
                throw new Error('访问令牌不能为空')
            }

            // 测试连接
            const response = await this.testConnection(data.serverUrl, data.accessToken)

            if (response.success) {
                this.serverUrl = data.serverUrl
                this.accessToken = data.accessToken
                return response
            } else {
                throw new Error(response.message || '登录失败')
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : '登录失败'
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
            // 构建API URL
            const apiUrl = `${serverUrl.replace(/\/$/, '')}/api/v1/user/me`

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })

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
            return {
                success: false,
                message: error instanceof Error ? error.message : '连接服务器失败'
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