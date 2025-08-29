<script setup lang="ts">
import {
    computed,
    onActivated,
    ref,
    nextTick,
    onMounted,
    onUnmounted,
    Ref,
    watch,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDraftStore } from '@/stores/draft'
import { Button } from '@/components/ui/button'
import { useSwipeBack } from '@/composables/useSwipeBack'
import { useEditModal } from '@/composables/useEditModal'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import { useDebounceFn } from '@vueuse/core'
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
    Loader,
} from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import EditModal from '@/components/EditModal.vue'
import MemoContent from '@/components/MemoContent.vue'
import {
    deleteMemo,
    archiveMemo,
    restoreMemo,
    togglePinMemo,
    searchMemos,
    Memo,
    MemosState,
} from '@/api/memos'

import { useI18n } from 'vue-i18n'
import {
    getImageResources,
    getImageUrl,
    useImageViewer,
} from '@/utils/imageUtils'
import { formatLocalTime } from '@/utils/timeUtils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

import loading_image from '@/assets/loading_image.svg'
import { getError } from '@/api/error'
import { useDataCacheStore } from '@/stores/dataCache'
import { useSettingsStore } from '@/stores/settings'
import { mergeOnline } from '@/utils/mergeOnlineData'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const draftStore = useDraftStore()
const { t } = useI18n()
const { editModalState, openNewMemo, openEditMemo, saveAndCloseEdit } =
    useEditModal()
const { viewImageLoading, showImageViewer } = useImageViewer()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const handleHome = () => {
    if (editModalState.value.isVisible) {
        saveAndCloseEdit()
        return
    }
    router.push({ name: 'Home' })
}

const memos = ref<Memo[]>([])
const pinnedMemos = ref<Memo[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const showScrollToTop = ref(false)
const isSearching = ref(false)
const searchResults = ref<Memo[]>([])

type ConfirmAction = 'archive' | 'delete'
const confirmDialogOpen = ref(false)
const confirmAction = ref<ConfirmAction>('delete')
const memoToOperate = ref<Memo | null>(null)

const currentTag = (route.params.tag as string) || ''
const pageName = route.name as string

const displayMemos = computed(() => {
    const allMemos = isSearching.value ? searchResults.value : memos.value

    if (
        !isSearching.value &&
        pageName !== 'Archive' &&
        pinnedMemos.value.length > 0
    ) {
        const pinnedNames = new Set(pinnedMemos.value.map((memo) => memo.name))
        const unpinnedMemos = allMemos.filter(
            (memo) => !pinnedNames.has(memo.name)
        )
        return [...pinnedMemos.value, ...unpinnedMemos]
    }
    return allMemos
})

const handleEditMemo = (memo: Memo) => {
    openEditMemo(memo)
}

const handleDeleteMemo = (memo: Memo) => {
    memoToOperate.value = memo
    confirmAction.value = 'delete'
    confirmDialogOpen.value = true
}

const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (target) {
        const scrollTop = target.scrollTop

        showScrollToTop.value = scrollTop > 200
    }
}

const confirmOperation = async () => {
    if (!memoToOperate.value) {
        console.error('[confirmOperation] missing memo!')
        return
    }

    if (!memoToOperate.value?.name) {
        console.error('[confirmOperation] missing memo name!')
        return
    }

    try {
        if (confirmAction.value === 'archive') {
            await archiveMemo(memoToOperate.value.name)
            console.info('archive memo success: ' + memoToOperate.value.name)
        } else if (confirmAction.value === 'delete') {
            await deleteMemo(memoToOperate.value.name)
            console.info('delete memo success: ' + memoToOperate.value.name)
        }

        if (memoToOperate.value!.pinned) {
            pinnedMemos.value = pinnedMemos.value.filter(
                (m) => m.name !== memoToOperate.value!.name
            )
        } else {
            memos.value = memos.value.filter(
                (m) => m.name !== memoToOperate.value!.name
            )
        }

        confirmDialogOpen.value = false
        memoToOperate.value = null
    } catch (error) {
        console.error(`${confirmAction.value} memo failed: ` + getError(error))
    }
}

const handleCopyMemo = (memo: Memo) => {
    navigator.clipboard.writeText(memo.content)
}

const handleArchiveMemo = (memo: Memo) => {
    memoToOperate.value = memo
    confirmAction.value = 'archive'
    confirmDialogOpen.value = true
}

const handleRecoverMemo = async (memo: Memo) => {
    if (!memo.name) {
        console.error('[handleRecoverMemo] missing memo name!')
        return
    }

    try {
        await restoreMemo(memo.name)
        memos.value = memos.value.filter((m) => m.name !== memo.name)
    } catch (error) {
        console.error('restore memo failed: ' + getError(error))
    }
}

const handlePinMemo = async (oldMemo: Memo) => {
    if (!oldMemo.name) {
        console.error('[handlePinMemo] missing memo name!')
        return
    }

    const insertMemo = (memo: Memo, memos: Memo[]) => {
        const index = memos.findIndex((m) => m.displayTime < memo.displayTime)

        if (index === -1) {
            memos.push(memo)
        } else {
            memos.splice(index, 0, memo)
        }
        return memos
    }

    try {
        const memo = await togglePinMemo(oldMemo.name, !oldMemo.pinned)

        if (memo.pinned) {
            pinnedMemos.value = insertMemo(memo, pinnedMemos.value)
            memos.value = memos.value.filter((m) => m.name !== memo.name)
        } else {
            pinnedMemos.value = pinnedMemos.value.filter(
                (m) => m.name !== memo.name
            )
            memos.value = insertMemo(memo, memos.value)
        }
        await scrollToMemo(memo)
    } catch (error) {
        console.error('toggle pin memo failed: ' + getError(error))
    }
}

const handleAddMemo = () => {
    const lastEditText = draftStore.lastEditText || ''
    openNewMemo(lastEditText)
}

const handleEditSendOrUpdateSuccess = async (memo: Memo, isEdit: boolean) => {
    if (isEdit) {
        const updateMemo = (memo: Memo, memos: Ref<Memo[]>) => {
            const index = memos.value.findIndex((m) => m.name === memo.name)
            if (index !== -1) {
                memos.value[index] = memo
            }
        }

        if (memo.pinned) {
            updateMemo(memo, pinnedMemos)
        } else {
            updateMemo(memo, memos)
        }
    } else {
        memos.value.unshift(memo)
        await scrollToMemo(memo)
    }
}

const scrollToMemo = async (memo: Memo) => {
    await nextTick()
    const container = document.getElementById('memo-list')
    if (!container) return

    const memoElement = container.querySelector(
        `[data-memo-name="${memo.name}"]`
    )
    if (!memoElement) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
        return
    }

    const containerRect = container.getBoundingClientRect()
    const elementRect = memoElement.getBoundingClientRect()

    const scrollTop =
        container.scrollTop + (elementRect.top - containerRect.top)

    container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
    })
}

// Debounced search function - calls after user stops typing for 500ms
const performSearch = async () => {
    // Use current searchQuery value instead of parameter to avoid race condition
    const currentQuery = searchQuery.value.trim()

    if (!currentQuery) {
        isSearching.value = false
        searchResults.value = []
        return
    }

    try {
        isLoading.value = true
        isSearching.value = true
        searchResults.value = await searchMemos(currentQuery, currentTag)
    } catch (error) {
        console.error('search memo failed: ' + getError(error))
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
}

const debouncedSearch = useDebounceFn(performSearch, 500)

// Watch searchQuery changes and trigger debounced search
watch(searchQuery, (newQuery) => {
    if (!newQuery.trim()) {
        // Immediately clear results when query is empty
        isSearching.value = false
        searchResults.value = []
        return
    }
    debouncedSearch()
})

// Handle input focus - move cursor to end of text
const handleInputFocus = (event: Event) => {
    const input = event.target as HTMLInputElement
    nextTick(() => {
        const length = input.value.length
        input.setSelectionRange(length, length)
    })
}

const handleScrollToTop = async () => {
    await nextTick()
    const container = document.getElementById('memo-list')
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
}

let onlineRefreshing = false
// Pull to refresh
const pullToRefreshCallback = async () => {
    let cnt = 0
    while (onlineRefreshing) {
        cnt++
        console.log('waiting for init refreshing: ' + cnt)
        await new Promise((resolve) => setTimeout(resolve, 200))
    }

    try {
        onlineRefreshing = true
        let state = MemosState.NORMAL
        if (pageName === 'Archive') {
            state = MemosState.ARCHIVED
        }
        let runner = [mergeOnline(memos, false, state, currentTag)]
        if (pageName === 'Main') {
            runner.push(mergeOnline(pinnedMemos, true, MemosState.NORMAL))
        }
        await Promise.all(runner)
    } catch (error) {
        console.error('pull to refresh error: ' + getError(error))
    } finally {
        onlineRefreshing = false
    }
}

const {
    isPullRefreshing,
    isPulling,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cleanup: cleanupPullToRefresh,
} = usePullToRefresh({
    onRefresh: pullToRefreshCallback,
    targetId: 'memo-content',
    loaderId: 'pull-loader',
})

const refreshPage = async () => {
    pinnedMemos.value = []
    memos.value = []

    const pinnedLimit = 50
    const memoLimit = 6
    const archive = pageName === 'Archive'
    await Promise.all([
        (async () => {
            let offset = 0
            while (true) {
                const res = await dataCache.getMemoList(
                    offset,
                    pinnedLimit,
                    currentTag,
                    true,
                    false
                )
                if (res) {
                    pinnedMemos.value.push(...res)
                } else {
                    break
                }
                offset += pinnedLimit
            }
        })(),
        (async () => {
            const res = await dataCache.getMemoList(
                0,
                memoLimit,
                currentTag,
                false,
                archive
            )
            if (res) {
                memos.value.push(...res)
            }
        })(),
    ])
    ;(async () => {
        let offset = memoLimit
        const limit = 80
        while (true) {
            const res = await dataCache.getMemoList(
                offset,
                limit,
                currentTag,
                false,
                archive
            )
            if (res && res.length > 0) {
                memos.value.push(...res)
            } else {
                break
            }
            offset += limit
        }
    })()
}

const dataCache = useDataCacheStore()
const settings = useSettingsStore()
let firstMount = false

onMounted(async () => {
    firstMount = true
    await refreshPage()
    if (settings.enableAutoRefresh || displayMemos.value.length === 0) {
        onlineRefreshing = true
        ;(async () => {
            let state = MemosState.NORMAL
            if (pageName === 'Archive') {
                state = MemosState.ARCHIVED
            }
            try {
                let runner = [
                    mergeOnline(memos, false, state, currentTag),
                    mergeOnline(pinnedMemos, true, MemosState.NORMAL),
                ]
                await Promise.all(runner)
            } catch (error) {
                console.error(
                    'init refresh online data error: ' + getError(error)
                )
            } finally {
                onlineRefreshing = false
            }
        })()
    }
})

onUnmounted(() => {
    cleanupPullToRefresh()
})

onActivated(async () => {
    if (firstMount) {
        firstMount = false
        return
    }
    refreshPage()
    if (displayMemos.value.length === 0) {
        onlineRefreshing = true
        ;(async () => {
            let state = MemosState.NORMAL
            if (pageName === 'Archive') {
                state = MemosState.ARCHIVED
            }
            try {
                let runner = [
                    mergeOnline(memos, false, state, currentTag),
                    mergeOnline(pinnedMemos, true, MemosState.NORMAL),
                ]
                await Promise.all(runner)
            } catch (error) {
                console.error('fetch data error: ' + getError(error))
            } finally {
                onlineRefreshing = false
            }
        })()
    }
})
useSwipeBack({ onSwipe: handleHome }, '#main-view')
</script>

<template>
    <div
        class="flex flex-col w-full"
        style="height: calc(100vh - var(--safe-area-top) + 8px)"
        id="main-view">
        <div
            v-if="viewImageLoading"
            class="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-background/70 z-50">
            <img :src="loading_image" alt="loading" class="w-12 h-12" />
        </div>

        <div
            v-if="isPullRefreshing"
            class="absolute top-0 left-0 right-0 bottom-0 z-40 bg-transparent pointer-events-auto"
            @touchstart.prevent
            @touchmove.prevent
            @touchend.prevent
            @click.prevent></div>

        <div
            class="flex justify-between items-center sticky top-0 z-10 mb-0.5 pr-4 pl-5.5">
            <div
                class="flex items-center gap-2 cursor-pointer"
                @click="handleHome">
                <TouchAnimation :scale="0.8"
                    ><Home class="!h-6 !w-6 text-primary"
                /></TouchAnimation>
                <TouchAnimation :scale="0.95">
                    <div class="text-3xl text-primary font-style -mt-1">
                        {{ authStore.user?.username || '' }}
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
            style="margin-bottom: calc(var(--safe-area-bottom) + 0.5rem)"
            @scroll="handleScroll"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd">
            <!-- Pull refresh indicator - Fixed position -->
            <div
                v-if="isPulling || isPullRefreshing"
                class="fixed left-1/2 -translate-x-1/2 z-20"
                style="top: calc(var(--safe-area-bottom) + 3.5rem)">
                <Loader
                    id="pull-loader"
                    class="w-6.5 h-6.5 text-primary pull-refresh-loader"
                    :class="{
                        'animate-spin': isPullRefreshing,
                    }" />
            </div>

            <div id="memo-content" class="px-5">
                <div
                    v-if="
                        isLoading &&
                        !isPullRefreshing &&
                        displayMemos.length == 0
                    "
                    class="my-4 p-6 rounded-lg border-1 border-primary">
                    <div class="text-gray-500 text-center">
                        {{
                            isSearching
                                ? t('main.loading.searching')
                                : t('main.loading.loading')
                        }}
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
                        {{ t('main.searchResult.title') }}
                        ( {{ displayMemos.length }}
                        {{ t('main.searchResult.count') }} )
                    </div>
                    <div v-else style="margin-top: 12px"></div>

                    <div class="space-y-6">
                        <div
                            v-for="memo in displayMemos"
                            :key="memo.createTime"
                            :data-memo-name="memo.name"
                            class="px-5 pt-3 pb-1 rounded-lg border-1 border-primary">
                            <div
                                class="flex justify-between items-center -mr-1.5">
                                <div
                                    class="text-gray-500 text-sm flex items-center gap-1.5">
                                    {{ formatLocalTime(memo.displayTime, t) }}
                                    <Pin
                                        v-if="memo.pinned"
                                        class="!h-4.5 !w-4.5 text-gray-800" />
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

                            <MemoContent
                                :content="memo.content"
                                :compact="!memo.pinned"
                                class="mt-2.5" />

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
                                    var(--safe-area-bottom) + 1.5rem
                                );
                            "></div>
                    </div>
                </div>

                <div v-else class="my-4 p-6 rounded-lg border-1 border-primary">
                    <div class="text-gray-500 text-center">
                        {{
                            isSearching
                                ? t('main.noMemos.noMemosSearching')
                                : t('main.noMemos.noMemos')
                        }}
                    </div>
                </div>
            </div>
        </div>

        <div
            class="fixed left-4 right-4 z-40"
            style="bottom: calc(var(--safe-area-bottom) - 0.5rem)">
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <div class="w-full h-0.5 bg-background -mx-2"></div>
                    <Input
                        v-model="searchQuery"
                        @click="handleInputFocus"
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

        <EditModal @success="handleEditSendOrUpdateSuccess" />

        <AlertDialog v-model:open="confirmDialogOpen">
            <AlertDialogContent class="px-8 gap-4 pt-4">
                <AlertDialogHeader>
                    <AlertDialogTitle class="text-2xl font-bold">
                        {{
                            confirmAction === 'archive'
                                ? t('main.archive')
                                : t('main.delete')
                        }}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {{
                            (confirmAction === 'archive'
                                ? t('main.archiveConfirm')
                                : t('main.deleteConfirm')) +
                            ': ' +
                            (memoToOperate?.content?.slice(0, 40) || '') +
                            '...?'
                        }}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        class="h-10 !shadow-none text-base border-primary !focus:outline-none"
                        >{{ t('main.cancel') }}</AlertDialogCancel
                    >
                    <AlertDialogAction
                        @click="confirmOperation"
                        variant="destructive"
                        class="h-10 !shadow-none text-base border-primary !focus:outline-none">
                        {{
                            confirmAction === 'archive'
                                ? t('main.archive')
                                : t('main.delete')
                        }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<style>
.viewer-container {
    background-color: rgba(0, 0, 0, 0.55) !important;
}

#memo-list::-webkit-scrollbar {
    display: block !important;
}

/* Pull refresh loader progressive reveal - clockwise */
.pull-refresh-loader {
    transition: all 0.1s ease-out;
}

.pull-refresh-loader:not(.animate-spin) {
    mask: conic-gradient(
        from 0deg,
        black 0deg,
        black calc(360deg * var(--progress) / 100),
        transparent calc(360deg * var(--progress) / 100)
    );
    -webkit-mask: conic-gradient(
        from 0deg,
        black 0deg,
        black calc(360deg * var(--progress) / 100),
        transparent calc(360deg * var(--progress) / 100)
    );
}

.pull-refresh-loader.animate-spin {
    mask: none;
    -webkit-mask: none;
}
</style>
