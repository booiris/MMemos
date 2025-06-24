<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- 顶部导航栏 -->
        <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center space-x-4">
                        <button @click="router.push({ name: 'Dashboard' })"
                            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            ← 返回
                        </button>
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                            设置
                        </h1>
                    </div>
                </div>
            </div>
        </nav>

        <!-- 主要内容 -->
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="max-w-2xl mx-auto">
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        应用设置
                    </h2>

                    <div class="space-y-6">
                        <!-- 主题设置 -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                外观
                            </h3>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="theme" value="light" class="mr-3">
                                    <span class="text-gray-700 dark:text-gray-300">浅色主题</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="theme" value="dark" class="mr-3">
                                    <span class="text-gray-700 dark:text-gray-300">深色主题</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="theme" value="auto" class="mr-3" checked>
                                    <span class="text-gray-700 dark:text-gray-300">跟随系统</span>
                                </label>
                            </div>
                        </div>

                        <!-- 用户信息 -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                用户信息
                            </h3>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <div class="text-sm space-y-2">
                                    <div>
                                        <span class="font-medium text-gray-700 dark:text-gray-300">用户名：</span>
                                        <span class="text-gray-600 dark:text-gray-400">{{ authStore.user?.name || '未设置'
                                            }}</span>
                                    </div>
                                    <div v-if="authStore.user?.email">
                                        <span class="font-medium text-gray-700 dark:text-gray-300">邮箱：</span>
                                        <span class="text-gray-600 dark:text-gray-400">{{ authStore.user.email }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 服务器信息 -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                服务器信息
                            </h3>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <div class="text-sm space-y-2">
                                    <div>
                                        <span class="font-medium text-gray-700 dark:text-gray-300">服务器地址：</span>
                                        <span class="text-gray-600 dark:text-gray-400">{{ authStore.serverUrl || '未设置'
                                            }}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-700 dark:text-gray-300">登录状态：</span>
                                        <span class="text-green-600 dark:text-green-400">已连接</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 其他设置 -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                其他
                            </h3>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                更多设置功能正在开发中...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>