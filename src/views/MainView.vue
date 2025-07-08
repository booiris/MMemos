<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
    Bolt,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Share2,
    Pin,
} from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import { getMemos } from '@/api/memos'
import { V1MemoRelation, V1Reaction, V1Resource } from '@/api/schema/api'
import { getError } from '@/api/error'
import { Marked, Tokens } from 'marked'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import { useI18n } from 'vue-i18n'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const formatLocalTime = computed(() => (utcTime: string): string => {
    if (!utcTime) return ''

    try {
        const localTime = dayjs.utc(utcTime).local()
        const now = dayjs()

        if (localTime.isSame(now, 'day')) {
            return localTime.format('HH:mm')
        }

        if (localTime.isSame(now.subtract(1, 'day'), 'day')) {
            return `${t('time.yesterday')} ${localTime.format('HH:mm')}`
        }

        if (localTime.isSame(now, 'year')) {
            return localTime.format(`${t('time.format.date')}`)
        }

        return localTime.format(`${t('time.format.fullDate')}`)
    } catch (error) {
        console.error('Time format error:', error)
        return utcTime
    }
})

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

const handleEditMemo = (memo: Memo) => {
    console.log('编辑备忘录:', memo)
    // TODO: 实现编辑功能
}

const handleDeleteMemo = (memo: Memo) => {
    console.log('删除备忘录:', memo)
    // TODO: 实现删除功能
}

const handleCopyMemo = (memo: Memo) => {
    navigator.clipboard.writeText(memo.content)
    // TODO: 显示复制成功提示
}

const handleShareMemo = (memo: Memo) => {
    console.log('分享备忘录:', memo)
    // TODO: 实现分享功能
}

const handlePinMemo = (memo: Memo) => {
    console.log('置顶备忘录:', memo)
    // TODO: 实现置顶功能
}
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
                    class="px-5 pt-3 pb-1 rounded-lg border-1 border-primary">
                    <div class="flex justify-between items-center -mr-1.5">
                        <div class="text-gray-500 text-sm">
                            {{ formatLocalTime(memo.displayTime) }}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="!h-5.5 !w-5.5 text-primary/77">
                                    <MoreHorizontal class="!h-5.5 !w-5.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                class="w-46 border-1 border-primary !shadow-none px-1.1 bg-popover">
                                <DropdownMenuItem
                                    @click="handlePinMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                    {{ t('main.pin') }}
                                    <Pin
                                        class="ml-auto text-primary !h-5 !w-5" />
                                </DropdownMenuItem>
                                <div
                                    class="border-b border-primary/76 my-0"></div>
                                <DropdownMenuItem
                                    @click="handleEditMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                    {{ t('main.edit') }}
                                    <Edit
                                        class="ml-auto text-primary !h-5 !w-5" />
                                </DropdownMenuItem>
                                <div
                                    class="border-b border-primary/76 my-0"></div>
                                <DropdownMenuItem
                                    @click="handleCopyMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                    {{ t('main.copy') }}
                                    <Copy
                                        class="ml-auto text-primary !h-5 !w-5" />
                                </DropdownMenuItem>
                                <div
                                    class="border-b border-primary/76 my-0"></div>
                                <DropdownMenuItem
                                    @click="handleShareMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5"
                                    variant="destructive">
                                    {{ t('main.archive') }}
                                    <Share2 class="ml-auto !h-5 !w-5" />
                                </DropdownMenuItem>
                                <div
                                    class="border-b border-primary/76 my-0"></div>
                                <DropdownMenuItem
                                    @click="handleDeleteMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5"
                                    variant="destructive">
                                    {{ t('main.delete') }}
                                    <Trash2 class="ml-auto !h-5 !w-5" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <article
                        v-html="markdownRender.parse(memo.content)"
                        class="whitespace-pre-wrap break-words prose prose-lg prose-zinc mt-2.5"
                        style="line-height: 1 !important"></article>
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
