import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthState, LoginData, LoginResponse } from '@/types/auth'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const authState = ref<AuthState>({
    isAuthenticated: false
  })
  
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const user = computed(() => authState.value.user)
  const serverUrl = computed(() => authState.value.serverUrl)
  const accessToken = computed(() => authState.value.accessToken)

  // 动作
  const login = async (data: LoginData): Promise<LoginResponse> => {
    isLoading.value = true
    
    try {
      const response = await authService.login(data)
      
      if (response.success && response.user) {
        // 更新状态
        authState.value = {
          isAuthenticated: true,
          user: response.user,
          serverUrl: data.serverUrl,
          accessToken: data.accessToken
        }
        
        // 持久化到 localStorage
        persistAuthState(response.user, data.serverUrl, data.accessToken)
        
        console.log('✅ 登录成功 - Pinia store 已更新', {
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
    console.log('🚪 用户退出登录 - 清除 Pinia store')
    
    // 清除服务
    authService.logout()
    
    // 重置状态
    authState.value = {
      isAuthenticated: false
    }
    
    // 清除持久化数据
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
        
        // 恢复状态
        authState.value = {
          isAuthenticated: true,
          user,
          serverUrl,
          accessToken
        }
        
        // 同步到 authService
        authService.login({ serverUrl, accessToken })
        
        console.log('🔄 从 localStorage 恢复认证状态', {
          user: user.name,
          serverUrl
        })
        
        return true
      } catch (error) {
        console.error('❌ 恢复认证状态失败:', error)
        clearPersistedAuthState()
        return false
      }
    }
    
    console.log('🔓 未找到有效的认证状态')
    return false
  }

  const updateUser = (userData: any) => {
    if (authState.value.isAuthenticated) {
      authState.value.user = { ...authState.value.user, ...userData }
      
      // 更新持久化数据
      localStorage.setItem('user', JSON.stringify(authState.value.user))
      
      console.log('👤 用户信息已更新', userData)
    }
  }

  // 开发时的调试方法
  const debugStore = () => {
    console.log('🔍 Pinia Auth Store 调试信息:')
    console.log('- 认证状态:', authState.value)
    console.log('- 是否已认证:', isAuthenticated.value)
    console.log('- 用户信息:', user.value)
    console.log('- 服务器地址:', serverUrl.value)
    console.log('- 加载状态:', isLoading.value)
    console.log('- localStorage 数据:', {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      user: localStorage.getItem('user'),
      serverUrl: localStorage.getItem('serverUrl'),
      accessToken: localStorage.getItem('accessToken') ? '[已设置]' : '[未设置]'
    })
  }

  // 辅助方法
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

  // 初始化时检查认证状态
  checkAuth()

  return {
    // 状态
    authState,
    isLoading,
    
    // 计算属性
    isAuthenticated,
    user,
    serverUrl,
    accessToken,
    
    // 动作
    login,
    logout,
    checkAuth,
    updateUser,
    
    // 开发工具
    debugStore
  }
})
