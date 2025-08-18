import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthState, LoginData, LoginResponse } from '@/types/auth'
import { login as Login, logout as Logout } from '@/api/auth'
import { TauriStore } from '@/utils/tauriStore'
import { updateClientConfig } from '@/api/client'
import { V1User } from '@/api/schema/api'
import { sanitizeFileName } from '@/utils/fileUtils'
import { useDataCacheStore } from './dataCache'

export const useAuthStore = defineStore('auth', () => {
    const authState = ref<AuthState>({
        isAuthenticated: false,
    })

    const isLoading = ref(false)

    const isAuthenticated = computed(() => authState.value.isAuthenticated)
    const user = computed(() => authState.value.user)
    const serverUrl = computed(() => authState.value.serverUrl)
    const accessToken = computed(() => authState.value.accessToken)

    const login = async (data: LoginData): Promise<LoginResponse> => {
        isLoading.value = true

        try {
            const response = await Login(data)

            if (response.success && response.user) {
                authState.value = {
                    isAuthenticated: true,
                    user: response.user,
                    serverUrl: data.serverUrl,
                    accessToken: data.accessToken,
                }

                await persistAuthState(
                    response.user,
                    data.serverUrl,
                    data.accessToken
                )

                // Update API client configuration
                updateClientConfig(data.serverUrl, data.accessToken)

                console.log('login success, updating persisted auth state', {
                    user: response.user,
                    serverUrl: data.serverUrl,
                })
            }

            return response
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        console.log('logout, cleaning persisted auth state')

        Logout()

        authState.value = {
            isAuthenticated: false,
        }

        await clearPersistedAuthState()
    }

    const checkAuth = async () => {
        try {
            const isAuth = await TauriStore.get<boolean>('isAuthenticated')
            const user = await TauriStore.get<V1User>('user')
            const serverUrl = await TauriStore.getItem('serverUrl')
            const accessToken = await TauriStore.getItem('accessToken')

            if (isAuth && user && serverUrl && accessToken) {
                authState.value = {
                    isAuthenticated: true,
                    user,
                    serverUrl,
                    accessToken,
                }

                updateClientConfig(serverUrl, accessToken)

                console.log('restore auth state from TauriStore', {
                    user: user.name,
                    serverUrl,
                })

                return true
            }

            console.log('no valid auth state found')
            return false
        } catch (error) {
            console.error('restore auth state failed', error)
            await clearPersistedAuthState()
            return false
        }
    }

    const persistAuthState = async (
        user: any,
        serverUrl: string,
        accessToken: string
    ) => {
        try {
            await Promise.all([
                TauriStore.set('isAuthenticated', true),
                TauriStore.set('user', user),
                TauriStore.setItem('serverUrl', serverUrl),
                TauriStore.setItem('accessToken', accessToken),
            ])
        } catch (error) {
            console.error('Failed to persist auth state:', error)
            throw error
        }
    } 

    const clearPersistedAuthState = async () => {
        try {
            await TauriStore.remove([
                'isAuthenticated',
                'user',
                'serverUrl',
                'accessToken',
                'lastEditText',
                'lastEditVisibility',
            ])
            const dataCacheStore = useDataCacheStore()
            dataCacheStore.cleanImageCache()
        } catch (error) {
            console.error('Failed to clear persisted auth state:', error)
            throw error
        }
    }

    const getUniqueId = () => {
        return (
            sanitizeFileName(serverUrl.value!) +
            '_' +
            sanitizeFileName(
                user.value?.name ||
                    user.value?.username ||
                    user.value?.displayName ||
                    user.value?.uid ||
                    ''
            )
        )
    }

    return {
        // state
        authState,
        isLoading,

        // computed values
        isAuthenticated,
        user,
        serverUrl,
        accessToken,

        // actions
        login,
        logout,
        checkAuth,
        getUniqueId,
    }
})
