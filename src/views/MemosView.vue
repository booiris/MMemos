<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
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
                            我的笔记
                        </h1>
                    </div>
                </div>
            </div>
        </nav>

        <!-- 主要内容 -->
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        笔记功能
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        这里将显示您的所有笔记
                    </p>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        TODO: 实现笔记列表、创建、编辑等功能
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>