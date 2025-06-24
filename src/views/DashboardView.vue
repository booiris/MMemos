<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push({ name: 'Login' })
}

onMounted(() => {
    // 确保认证状态已加载
    if (!authStore.isAuthenticated) {
        authStore.checkAuth()
    }
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- 顶部导航栏 -->
        <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Memos 客户端
                        </h1>
                    </div>

                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                            欢迎，{{ authStore.user?.name || '用户' }}
                        </span>
                        <button @click="handleLogout"
                            class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            退出登录
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- 主要内容 -->
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    欢迎来到 Memos 客户端
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-8">
                    您已成功登录，可以开始使用笔记功能了
                </p>

                <div class="space-x-4">
                    <button @click="router.push({ name: 'Memos' })"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                        查看笔记
                    </button>
                    <button @click="router.push({ name: 'Settings' })"
                        class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md">
                        设置
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>