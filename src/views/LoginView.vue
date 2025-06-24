<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import type { LoginData } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async (data: LoginData) => {
    try {
        const response = await authStore.login(data)

        if (response.success) {
            // 保存认证状态到 localStorage
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('serverUrl', data.serverUrl)
            localStorage.setItem('accessToken', data.accessToken)

            alert(`登录成功！欢迎 ${response.user?.name}`)

            // 跳转到仪表板
            router.push({ name: 'Dashboard' })
        } else {
            alert(`登录失败：${response.message}`)
        }
    } catch (error) {
        alert('登录失败，请检查网络连接')
    }
}

onMounted(() => {
    // 如果已经登录，直接跳转到仪表板
    if (authStore.isAuthenticated) {
        router.push({ name: 'Dashboard' })
    }
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Memos 客户端
                </h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    请输入您的服务器信息进行登录
                </p>
            </div>

            <!-- 登录表单 -->
            <LoginForm :loading="authStore.isLoading" @login="handleLogin" />

            <!-- 帮助信息 -->
            <div class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    访问令牌可以在您的 Memos 服务器设置中找到
                </p>
            </div>
        </div>
    </div>
</template>