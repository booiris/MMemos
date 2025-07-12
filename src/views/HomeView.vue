<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ChevronLeft } from 'lucide-vue-next'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const handleBack = () => {
    router.push({ name: 'Main' })
}
</script>

<template>
    <div
        class="flex flex-col px-3 gap-3 -mt-1.5"
        style="height: calc(100vh - env(safe-area-inset-top))">
        <div>
            <button @click="handleBack" class="flex items-center">
                <ChevronLeft class="!h-8 !w-8 text-primary" />
                <span class="font-primary text-xl">{{
                    authStore.user?.username || ''
                }}</span>
            </button>
        </div>
    </div>
</template>
