<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FileText, Archive, Bolt, Tag } from 'lucide-vue-next'
import SettingsList from '@/components/ui/list-item/settings-list.vue'
import { useI18n } from 'vue-i18n'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import { Button } from '@/components/ui/button'
import { computed, onActivated, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataCacheStore } from '@/stores/dataCache'
import { getUserStats } from '@/api/stats'
import { V1UserStats } from '@/api/schema/api'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const dataCacheStore = useDataCacheStore()

const handleSettings = () => {
    router.push({ name: 'Settings' })
}

const mainMenus = computed(() => [
    {
        icon: FileText,
        title: t('home.memos'),
        type: 'arrow' as const,
        onClick: () => router.push({ name: 'Main' }),
    },
    {
        icon: Archive,
        title: t('home.archive'),
        type: 'arrow' as const,
        onClick: () => router.push({ name: 'Archive' }),
    },
])

const tagValues = ref<Record<string, number>>({})

const truncateText = (text: string, maxLength: number = 20): string => {
    if (text.length <= maxLength) {
        return text
    }
    return text.slice(0, maxLength) + '...'
}

const tags = computed(() => {
    return Object.entries(tagValues.value)
        .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
        .map(([tag, count]) => {
            const displayTitle = `${truncateText(tag)} (${count})`
            return {
                icon: Tag,
                title: displayTitle,
                type: 'arrow' as const,
                onClick: () =>
                    router.push({
                        name: 'MainWithTag',
                        params: { tag },
                    }),
            }
        })
})

const memosCount = ref(0)
const tagCount = ref(0)
const pinCount = ref(0)

const convertUserStats = (statsData: V1UserStats) => {
    memosCount.value = statsData?.totalMemoCount || 0
    tagCount.value = Object.keys(statsData?.tagCount || {}).length
    pinCount.value = statsData?.pinnedMemos?.length || 0
    tagValues.value = statsData?.tagCount || {}
}

const loadCachedData = async () => {
    try {
        const cachedData = await dataCacheStore.getHomeDataCache()
        if (cachedData) {
            tagValues.value = cachedData.tags || []
            memosCount.value = cachedData.memosCount || 0
            tagCount.value = cachedData.tagsCount || 0
            pinCount.value = cachedData.pinnedMemosCount || 0
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(async () => {
    await loadCachedData()
})

onActivated(async () => {
    await loadCachedData()
    try {
        const s = await getUserStats(authStore.user?.name || '')
        convertUserStats(s)

        await dataCacheStore.setHomeDataCache({
            tags: tagValues.value,
            memosCount: memosCount.value,
            tagsCount: tagCount.value,
            pinnedMemosCount: pinCount.value,
        })
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <div
        class="flex flex-col px-5 gap-3"
        style="height: calc(100vh - var(--safe-area-top) + 8px)">
        <div
            class="flex justify-between items-center sticky top-0 z-10 mb-0.5 bg-background">
            <div class="flex items-center gap-2">
                <div class="text-4xl text-primary font-style">
                    {{ authStore.user?.username || '' }}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <TouchAnimation :scale="0.8">
                    <Button variant="ghost" size="icon" @click="handleSettings">
                        <Bolt class="!h-7 !w-7 text-primary" />
                    </Button>
                </TouchAnimation>
            </div>
        </div>

        <div class="overflow-y-auto space-y-6">
            <div class="-mt-2"></div>

            <div class="flex justify-between items-end">
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-2xl font-bold">{{ memosCount }}</div>
                    <div class="text-xs text-gray-500">MEMO</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-2xl font-bold">{{ tagCount }}</div>
                    <div class="text-xs text-gray-500">TAG</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-2xl font-bold">{{ pinCount }}</div>
                    <div class="text-xs text-gray-500">PIN</div>
                </div>
            </div>

            <SettingsList title="MEMOS" :items="mainMenus" />

            <SettingsList v-if="tags.length > 0" title="TAGS" :items="tags" />

            <div
                style="
                    margin-bottom: calc(var(--safe-area-bottom) + 2rem);
                " />
        </div>
    </div>
</template>
