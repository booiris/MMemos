<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push({ name: 'Login' })
}

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

onMounted(() => {
})
</script>

<template>
    <div>
        <div class="flex justify-between items-center px-6 mt-2">
            <div class="text-4xl text-primary"
                style="font-family: 'EB Garamond', ui-sans-serif, system-ui, -apple-system;">
                {{ authStore.user?.displayName || authStore.user?.username || '' }}
            </div>

            <TouchAnimation :scale="0.8">
                <Button variant="ghost" size="icon" @click="handleSettings">
                    <Settings class="!h-7.5 !w-7.5 text-primary" />
                </Button>
            </TouchAnimation>
        </div>

        <div class="h-48 mx-6 my-4 p-6 rounded-lg border-1 border-primary">
            <div class="text-lg font-medium text-gray-900 mb-2">写点什么...</div>
            <div class="text-gray-500 text-sm">开始记录你的想法和灵感</div>
        </div>

        <div class="h-48 mx-6 my-4 p-6 rounded-lg border-1 border-primary">
            <div class="text-lg font-medium text-gray-900 mb-2">
                {{ authStore.user?.displayName || authStore.user?.username || '' }}
            </div>

            <div class="text-gray-500 text-sm">
                {{ authStore.user?.displayName || authStore.user?.username || '' }}
            </div>
        </div>

        <div class="flex flex-col items-center justify-center flex-1 py-12">
            <div class="text-center">
                <Button @click="handleLogout" variant="outline">
                    退出登录
                </Button>
            </div>
        </div>
    </div>
</template>