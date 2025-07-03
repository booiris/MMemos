<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Bolt } from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

onMounted(() => {})
</script>

<template>
    <div class="flex flex-col px-6">
        <div class="flex justify-between items-center sticky top-0 z-10">
            <div class="text-4xl text-primary font-style -mt-1">
                {{
                    authStore.user?.displayName ||
                    authStore.user?.username ||
                    ''
                }}
            </div>

            <TouchAnimation :scale="0.8">
                <Button variant="ghost" size="icon" @click="handleSettings">
                    <Bolt class="!h-7 !w-7 text-primary" />
                </Button>
            </TouchAnimation>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div class="h-48 my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-lg font-medium text-gray-900 mb-2">
                    写点什么...
                </div>
                <div class="text-gray-500 text-sm">开始记录你的想法和灵感</div>
            </div>

            <div class="h-48 mx-6 my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-lg font-medium text-gray-900 mb-2">
                    {{
                        authStore.user?.displayName ||
                        authStore.user?.username ||
                        ''
                    }}
                </div>

                <div class="text-gray-500 text-sm">
                    {{
                        authStore.user?.displayName ||
                        authStore.user?.username ||
                        ''
                    }}
                </div>
            </div>
        </div>
    </div>
</template>
