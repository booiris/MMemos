<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Bolt } from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import { getMemos } from '@/api/memos'
import { V1MemoRelation, V1Reaction, V1Resource } from '@/api/schema/api'
import { getError } from '@/api/error'

const router = useRouter()
const authStore = useAuthStore()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

type Memo = {
    createTime: string
    updateTime: string
    displayTime: string
    visibility: string
    content: string
    pinned: boolean
    resources: V1Resource[]
    relations: V1MemoRelation[]
    reactions: V1Reaction[]
}

const memos = ref<Memo[]>([])
const isLoading = ref(false)

onMounted(async () => {
    try {
        isLoading.value = true
        const response = await getMemos()
        memos.value =
            response.memos?.map((memo) => ({
                createTime: memo.createTime || '',
                updateTime: memo.updateTime || '',
                displayTime: memo.displayTime || '',
                visibility: memo.visibility || 'PRIVATE',
                content: memo.content || '',
                pinned: memo.pinned || false,
                resources: memo.resources || [],
                relations: memo.relations || [],
                reactions: memo.reactions || [],
            })) || []
    } catch (error) {
        console.error(getError(error))
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="flex flex-col px-6">
        <div class="flex justify-between items-center sticky top-0 z-10 mb-4">
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
            <!-- TODO: update loading page -->
            <div
                v-if="isLoading"
                class="my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-gray-500 text-center">加载中...</div>
            </div>

            <div v-else-if="memos.length > 0" class="space-y-4">
                <div
                    v-for="memo in memos"
                    :key="memo.createTime"
                    class="p-5 rounded-lg border-1 border-primary">
                    <div class="text-primary whitespace-pre-wrap break-words">
                        {{ memo.content }}
                    </div>
                    <div class="text-gray-500 text-sm mt-2">
                        {{ memo.displayTime }}
                    </div>
                </div>
            </div>

            <!-- TODO: update empty page -->
            <div v-else class="my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-gray-500 text-center">还没有任何备忘录</div>
            </div>
        </div>
    </div>
</template>
