import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthState, LoginData, LoginResponse, } from '@/types/auth'
import { login as Login } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const authState = ref<AuthState>({
    isAuthenticated: false
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
          accessToken: data.accessToken
        }

        persistAuthState(response.user, data.serverUrl, data.accessToken)

        console.log('login success, updating persisted auth state', {
          user: response.user,
          serverUrl: data.serverUrl
        })
      }

      return response
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    console.log('logout, cleaning persisted auth state')

    authState.value = {
      isAuthenticated: false
    }

    clearPersistedAuthState()
  }

  const checkAuth = () => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    const userStr = localStorage.getItem('user')
    const serverUrl = localStorage.getItem('serverUrl')
    const accessToken = localStorage.getItem('accessToken')

    if (isAuth && userStr && serverUrl && accessToken) {
      try {
        const user = JSON.parse(userStr)

        authState.value = {
          isAuthenticated: true,
          user,
          serverUrl,
          accessToken
        }

        console.log('restore auth state from localStorage', {
          user: user.name,
          serverUrl
        })

        return true
      } catch (error) {
        console.error('restore auth state failed', error)
        clearPersistedAuthState()
        return false
      }
    }

    console.log('no valid auth state found')
    return false
  }

  const debugStore = () => {
    console.debug('debug auth store', authState.value)
    console.debug('- isAuthenticated:', isAuthenticated.value)
    console.debug('- user:', user.value)
    console.debug('- serverUrl:', serverUrl.value)
    console.debug('- isLoading:', isLoading.value)
    console.debug('- localStorage:', {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      user: localStorage.getItem('user'),
      serverUrl: localStorage.getItem('serverUrl'),
      accessToken: localStorage.getItem('accessToken') ? '[set]' : '[unset]'
    })
  }

  const persistAuthState = (user: any, serverUrl: string, accessToken: string) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('serverUrl', serverUrl)
    localStorage.setItem('accessToken', accessToken)
  }

  const clearPersistedAuthState = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('serverUrl')
    localStorage.removeItem('accessToken')
  }

  checkAuth()

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

    // dev tools
    debugStore
  }
})
