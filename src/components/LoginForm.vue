<script setup lang="ts">
import { ref } from 'vue'
import type { LoginData } from '@/types/auth'

interface Props {
    loading?: boolean
}

interface Emits {
    (e: 'login', data: LoginData): void
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
})

const emit = defineEmits<Emits>()

const serverUrl = ref('')
const accessToken = ref('')

const handleSubmit = () => {
    if (!serverUrl.value || !accessToken.value) {
        alert('请填写服务器地址和访问令牌')
        return
    }

    emit('login', {
        serverUrl: serverUrl.value,
        accessToken: accessToken.value
    })
}
</script>

<template>
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 服务器地址 -->
            <div>
                <label for="serverUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    服务器地址
                </label>
                <input id="serverUrl" v-model="serverUrl" type="url" placeholder="https://your-memos-server.com"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required :disabled="loading" />
            </div>

            <!-- Access Token -->
            <div>
                <label for="accessToken" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    访问令牌
                </label>
                <input id="accessToken" v-model="accessToken" type="password" placeholder="请输入您的访问令牌"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required :disabled="loading" />
            </div>

            <!-- 登录按钮 -->
            <div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <span v-if="loading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        登录中...
                    </span>
                    <span v-else>登录</span>
                </button>
            </div>
        </form>
    </div>
</template>