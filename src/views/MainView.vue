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
import { Marked, Tokens } from 'marked'

const router = useRouter()
const authStore = useAuthStore()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const markdownRender = new Marked({
    breaks: true,
    pedantic: false,
    gfm: true,
    renderer: {
        link(token: Tokens.Link) {
            return `<a href="${
                token.href
            }" target="_blank" rel="noopener noreferrer"${
                token.title ? ` title="${token.title}"` : ''
            }>${token.text}</a>`
        },
    },
})

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
        <div class="flex justify-between items-center sticky top-0 z-10 mb-2.5">
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

            <div v-else-if="memos.length > 0" class="space-y-6">
                <div style="margin-top: -1rem"></div>

                <div
                    v-for="memo in memos"
                    :key="memo.createTime"
                    class="p-5 rounded-lg border-1 border-primary">
                    <article
                        v-html="markdownRender.parse(memo.content)"
                        class="whitespace-pre-wrap break-words prose prose-lg prose-zinc"
                        style="line-height: 1 !important"></article>

                    <div class="text-gray-500 text-sm">
                        {{ memo.displayTime }}
                    </div>
                </div>

                <div
                    style="
                        margin-bottom: calc(env(safe-area-inset-bottom) + 1rem);
                    "></div>
            </div>

            <!-- TODO: update empty page -->
            <div v-else class="my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-gray-500 text-center">还没有任何备忘录</div>
            </div>
        </div>
    </div>
</template>
