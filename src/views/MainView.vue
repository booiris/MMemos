<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useSwipeBack } from '@/composables/useSwipeBack'
import {
    Bolt,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Archive,
    ArchiveRestore,
    Pin,
    Plus,
    ArrowUp,
    Home,
} from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import EditView from '@/views/EditView.vue'
import {
    getMemos,
    getMemosByTag,
    getArchivedMemos,
    createMemo,
    deleteMemo,
    archiveMemo,
    restoreMemo,
    togglePinMemo,
    searchMemos,
} from '@/api/memos'
import {
    V1MemoRelation,
    V1Reaction,
    V1Resource,
    V1Visibility,
} from '@/api/schema/api'
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
import { getAuthToken, getHost } from '@/api/client'
import { api as viewerApi } from 'v-viewer'
import loading_image from '@/assets/loading_image.svg'
import { getError } from '@/api/error'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const viewImageLoading = ref(false)

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const handleHome = () => {
    if (showEditView.value) {
        return
    }
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

const getImageResources = (resources: V1Resource[]): V1Resource[] => {
    return resources.filter(
        (resource) =>
            resource.type?.startsWith('image/') ||
            (resource.filename &&
                /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(resource.filename))
    )
}

const getImageUrl = (
    resource: V1Resource,
    isNeedThumbnail: boolean
): string => {
    if (resource.externalLink) {
        return resource.externalLink
    }

    if (resource.name) {
        return `${getHost()}/file/${resource.name}/${resource.filename}${
            isNeedThumbnail ? '?thumbnail=true' : ''
        }`
    }

    return ''
}

type Memo = {
    name?: string
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
const showEditView = ref(false)
const editInitialText = ref('')
const isSearching = ref(false)
const searchResults = ref<Memo[]>([])
let isNewMemo = false

const currentTag = route.params.tag as string
const pageName = route.name as string

const displayMemos = computed(() => {
    return isSearching.value ? searchResults.value : memos.value
})

const loadMemos = async () => {
    try {
        isLoading.value = true

        let response
        if (currentTag) {
            response = await getMemosByTag(currentTag)
        } else if (pageName == 'Archive') {
            response = await getArchivedMemos()
        } else {
            response = await getMemos()
        }

        memos.value =
            response.memos?.map((memo) => ({
                name: memo.name,
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
}

const handleEditMemo = (memo: Memo) => {
    editInitialText.value = memo.content
    isNewMemo = false
    showEditView.value = true
}

const handleDeleteMemo = async (memo: Memo) => {
    if (!memo.name) {
        console.error('[handleDeleteMemo] missing memo name!')
        return
    }

    try {
        await deleteMemo(memo.name)
        console.info('delete memo success: ' + memo.name)
        await loadMemos()
    } catch (error) {
        console.error('delete memo failed: ' + getError(error))
    }
}

const handleCopyMemo = (memo: Memo) => {
    navigator.clipboard.writeText(memo.content)
}

const handleArchiveMemo = async (memo: Memo) => {
    if (!memo.name) {
        console.error('[handleArchiveMemo] missing memo name!')
        return
    }

    try {
        await archiveMemo(memo.name)
        console.info('archive memo success: ' + memo.name)
        await loadMemos()
    } catch (error) {
        console.error('archive memo failed: ' + getError(error))
    }
}

const handleRecoverMemo = async (memo: Memo) => {
    if (!memo.name) {
        console.error('[handleRecoverMemo] missing memo name!')
        return
    }

    try {
        await restoreMemo(memo.name)
        console.info('restore memo success: ' + memo.name)
        await loadMemos()
    } catch (error) {
        console.error('restore memo failed: ' + getError(error))
    }
}

const handlePinMemo = async (memo: Memo) => {
    if (!memo.name) {
        console.error('[handlePinMemo] missing memo name!')
        return
    }

    try {
        await togglePinMemo(memo.name, !memo.pinned)
        console.info('toggle pin memo success: ' + memo.name)
        await loadMemos()
    } catch (error) {
        console.error('toggle pin memo failed: ' + getError(error))
    }
}

const handleAddMemo = () => {
    editInitialText.value = localStorage.getItem('lastEditText') || ''
    isNewMemo = true
    showEditView.value = true
}

const handleCloseEdit = (text: string) => {
    showEditView.value = false
    if (isNewMemo) {
        localStorage.setItem('lastEditText', text)
    }
}

const handleSendMemo = async (
    text: string,
    visibility: V1Visibility,
    resource?: V1Resource[]
) => {
    if (!text) {
        console.error('[handleSendMemo] memo content is empty!')
        return
    }

    try {
        await createMemo(text, visibility, resource)
        console.info('create memo success')
        showEditView.value = false
        localStorage.removeItem('lastEditText')
        await loadMemos()
    } catch (error) {
        console.error('create memo failed: ' + getError(error))
    }
}

const handleTextChange = (text: string) => {
    console.log(text.length)
}

const handleSearch = async (query: string) => {
    searchQuery.value = query

    if (!query.trim()) {
        isSearching.value = false
        searchResults.value = []
        return
    }

    try {
        isLoading.value = true
        isSearching.value = true
        const response = await searchMemos(query.trim())
        searchResults.value =
            response.memos?.map((memo) => ({
                name: memo.name,
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
        console.info('search memo success: ' + searchResults.value.length)
    } catch (error) {
        console.error('search memo failed: ' + getError(error))
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
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

onMounted(() => {
    loadMemos()
})
useSwipeBack({ onSwipe: handleHome }, '#main-view')

const showImageViewer = async (resource: V1Resource) => {
    if (viewImageLoading.value) {
        return
    }
    viewImageLoading.value = true
    const url = getImageUrl(resource, false)
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    })
    const blob = await response.blob()
    const base64 = URL.createObjectURL(blob)
    await new Promise((resolve) => setTimeout(resolve, 200))
    viewImageLoading.value = false
    viewerApi({
        options: {
            button: false,
            keyboard: false,
            toolbar: false,
            title: false,
            navbar: false,
        },
        images: [base64],
    })
}
</script>

<template>
    <div
        class="flex flex-col w-full"
        style="height: calc(100vh - env(safe-area-inset-top) + 8px)"
        id="main-view">
        <div
            v-if="viewImageLoading"
            class="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-background/70 z-50">
            <img :src="loading_image" alt="loading" class="w-12 h-12" />
        </div>

        <div
            class="flex justify-between items-center sticky top-0 z-10 mb-0.5 px-5">
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
            <div class="px-5">
                <div
                    v-if="isLoading"
                    class="my-4 p-6 rounded-lg border-1 border-primary">
                    <div class="text-gray-500 text-center">
                        {{ isSearching ? '搜索中...' : '加载中...' }}
                    </div>
                </div>

                <div v-else-if="displayMemos.length > 0">
                    <div
                        v-if="pageName == 'MainWithTag'"
                        class="text-2xl text-primary mb-2 mt-2">
                        # {{ currentTag }}
                    </div>
                    <div
                        v-else-if="isSearching"
                        class="text-lg text-primary mb-2 mt-2">
                        搜索结果 ({{ displayMemos.length }} 条)
                    </div>
                    <div v-else style="margin-top: 12px"></div>

                    <div class="space-y-6">
                        <div
                            v-for="memo in displayMemos"
                            :key="memo.createTime"
                            class="px-5 pt-3 pb-1 rounded-lg border-1 border-primary">
                            <div
                                class="flex justify-between items-center -mr-1.5">
                                <div class="text-gray-500 text-sm">
                                    {{ formatLocalTime(memo.displayTime) }}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="!h-5.5 !w-5.5 text-primary/77">
                                            <MoreHorizontal
                                                class="!h-5.5 !w-5.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        class="w-58 border-1 border-primary !shadow-none px-1.1 bg-popover">
                                        <DropdownMenuItem
                                            v-if="pageName != 'Archive'"
                                            @click="handleEditMemo(memo)"
                                            class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                            {{ t('main.edit') }}
                                            <Edit
                                                class="ml-auto text-primary !h-5 !w-5" />
                                        </DropdownMenuItem>
                                        <div
                                            v-if="pageName != 'Archive'"
                                            class="border-b border-primary/76 my-0"></div>
                                        <DropdownMenuItem
                                            @click="handleCopyMemo(memo)"
                                            class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                            {{ t('main.copy') }}
                                            <Copy
                                                class="ml-auto text-primary !h-5 !w-5" />
                                        </DropdownMenuItem>
                                        <div
                                            v-if="pageName != 'Archive'"
                                            class="border-b border-primary/76 my-0"></div>
                                        <DropdownMenuItem
                                            v-if="pageName != 'Archive'"
                                            @click="handlePinMemo(memo)"
                                            class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                            {{
                                                memo.pinned
                                                    ? t('main.cancelPin')
                                                    : t('main.pin')
                                            }}
                                            <Pin
                                                class="ml-auto text-primary !h-5 !w-5" />
                                        </DropdownMenuItem>
                                        <div
                                            class="border-b border-primary/76 my-0"></div>
                                        <DropdownMenuItem
                                            v-if="pageName != 'Archive'"
                                            @click="handleArchiveMemo(memo)"
                                            class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5"
                                            variant="destructive">
                                            {{ t('main.archive') }}
                                            <Archive
                                                class="ml-auto !h-5 !w-5" />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            v-if="pageName == 'Archive'"
                                            @click="handleRecoverMemo(memo)"
                                            class="text-lg my-0.5 transition-colors duration-150 active:bg-primary/10 pl-2.5">
                                            {{ t('main.recover') }}
                                            <ArchiveRestore
                                                class="ml-auto !h-5 !w-5" />
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

                            <div
                                v-if="
                                    getImageResources(memo.resources).length > 0
                                "
                                class="mt-0.5 mb-4 -mx-2.5">
                                <div class="flex overflow-x-auto gap-2">
                                    <div
                                        v-for="(
                                            resource, index
                                        ) in getImageResources(memo.resources)"
                                        :key="resource.name || index"
                                        class="flex-shrink-0 px-0.5">
                                        <img
                                            v-auth-image="
                                                getImageUrl(resource, true)
                                            "
                                            class="rounded-lg h-40 object-fit w-auto"
                                            loading="lazy"
                                            @click="
                                                showImageViewer(resource)
                                            " />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            style="
                                margin-bottom: calc(
                                    env(safe-area-inset-bottom) + 1.5rem
                                );
                            "></div>
                    </div>
                </div>

                <div v-else class="my-4 p-6 rounded-lg border-1 border-primary">
                    <div class="text-gray-500 text-center">
                        {{
                            isSearching
                                ? '没有找到匹配的备忘录'
                                : '还没有任何备忘录'
                        }}
                    </div>
                </div>
            </div>
        </div>

        <div
            class="fixed left-4.5 right-4.5 z-40"
            style="bottom: calc(env(safe-area-inset-bottom) - 0.5rem)">
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <div class="w-full h-0.5 bg-background -mx-2"></div>
                    <Input
                        v-model="searchQuery"
                        @input="handleSearch($event.target.value)"
                        :placeholder="t('main.search')"
                        :class="[
                            'flex-1 h-11 rounded-base border-1 border-primary bg-background/80 backdrop-blur-sm shadow-lg',
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

                <TouchAnimation :scale="0.9" v-if="pageName == 'Main'">
                    <Button
                        @click="handleAddMemo"
                        class="w-12 h-11 rounded-lg bg-primary text-white shadow-lg transition-colors duration-200"
                        size="icon">
                        <Plus class="!h-7 !w-7" />
                    </Button>
                </TouchAnimation>
            </div>
        </div>

        <Transition
            enter-active-class="transition-transform duration-250 ease-out"
            enter-from-class="transform translate-y-full"
            enter-to-class="transform translate-y-0"
            leave-active-class="transition-transform duration-150 ease-in"
            leave-from-class="transform translate-y-0"
            leave-to-class="transform translate-y-full">
            <div
                v-if="showEditView"
                class="fixed inset-0 z-50"
                style="top: calc(env(safe-area-inset-top) - 8px)">
                <EditView
                    :initial-text="editInitialText"
                    @close="handleCloseEdit"
                    @send="handleSendMemo"
                    @text-change="handleTextChange" />
            </div>
        </Transition>
    </div>
</template>

<style>
.viewer-container {
    background-color: rgba(0, 0, 0, 0.55) !important;
}

#memo-list::-webkit-scrollbar {
    display: block !important;
}
</style>
