<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useSwipeBack } from '@/composables/useSwipeBack'
import {
    Bolt,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Share2,
    Pin,
    Plus,
    ArrowUp,
    Home,
} from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import { getMemos } from '@/api/memos'
import { V1MemoRelation, V1Reaction, V1Resource } from '@/api/schema/api'
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
import { Input } from '@/components/ui/input'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const handleHome = () => {
    router.push({ name: 'Home' })
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
const searchQuery = ref('')
const showScrollToTop = ref(false)

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
        console.error(error)
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

const handleAddMemo = () => {
    console.log('添加新备忘录')
    // TODO: 实现添加备忘录功能
}

const handleSearch = (query: string) => {
    searchQuery.value = query
    console.log('搜索备忘录:', query)
    // TODO: 实现搜索功能
}

const handleScrollToTop = () => {
    const container = document.getElementById('memo-list')
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
}

const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (target) {
        const scrollTop = target.scrollTop
        showScrollToTop.value = scrollTop > 200
    }
}

useSwipeBack({ onSwipe: handleHome }, '#main-view')
</script>

<template>
    <div
        class="flex flex-col px-6 -mt-1.5"
        style="height: calc(100vh - env(safe-area-inset-top))"
        id="main-view">
        <div class="flex justify-between items-center sticky top-0 z-10 mb-0.5">
            <div
                class="flex items-center gap-2 cursor-pointer"
                @click="handleHome">
                <TouchAnimation :scale="0.8"
                    ><Home class="!h-6 !w-6 text-primary"
                /></TouchAnimation>
                <TouchAnimation :scale="0.95">
                    <div class="text-3xl text-primary font-style -mt-1">
                        {{
                            authStore.user?.displayName ||
                            authStore.user?.username ||
                            ''
                        }}
                    </div>
                </TouchAnimation>
            </div>

            <div class="flex items-center gap-2">
                <TouchAnimation :scale="0.8">
                    <Button variant="ghost" size="icon" @click="handleSettings">
                        <Bolt class="!h-6 !w-6 text-primary" />
                    </Button>
                </TouchAnimation>
            </div>
        </div>

        <div
            class="flex-1 overflow-y-auto"
            id="memo-list"
            style="margin-bottom: calc(env(safe-area-inset-bottom) + 0.5rem)"
            @scroll="handleScroll">
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
                                class="w-58 border-1 border-primary !shadow-none px-1.1 bg-popover">
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
                                    @click="handlePinMemo(memo)"
                                    class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                    {{ t('main.pin') }}
                                    <Pin
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
                        margin-bottom: calc(env(safe-area-inset-bottom) + 2rem);
                    "></div>
            </div>

            <!-- TODO: update empty page -->
            <div v-else class="my-4 p-6 rounded-lg border-1 border-primary">
                <div class="text-gray-500 text-center">还没有任何备忘录</div>
            </div>
        </div>

        <div
            class="fixed left-4.5 right-4.5 z-40"
            style="bottom: calc(env(safe-area-inset-bottom))">
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <div class="w-full h-0.5 bg-background -mx-2"></div>
                    <Input
                        v-model="searchQuery"
                        @input="handleSearch($event.target.value)"
                        :placeholder="t('main.search')"
                        :class="[
                            'flex-1 h-11 rounded-base border-1 border-primary bg-background/80 backdrop-blur-sm shadow-lg transition-all ease-out',
                            showScrollToTop ? 'mr-16' : '',
                        ]" />
                </div>

                <Transition
                    enter-active-class="transition-all duration-100 ease-out"
                    enter-from-class="opacity-0 scale-75 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-20 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-75 translate-y-4">
                    <TouchAnimation
                        v-if="showScrollToTop"
                        :scale="0.8"
                        @click="handleScrollToTop">
                        <Button
                            class="w-12 h-11 rounded-lg bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-200"
                            size="icon">
                            <ArrowUp class="!h-6 !w-6" />
                        </Button>
                    </TouchAnimation>
                </Transition>

                <TouchAnimation :scale="0.9">
                    <Button
                        @click="handleAddMemo"
                        class="w-12 h-11 rounded-lg bg-primary text-white shadow-lg transition-colors duration-200"
                        size="icon">
                        <Plus class="!h-7 !w-7" />
                    </Button>
                </TouchAnimation>
            </div>
        </div>
    </div>
</template>
