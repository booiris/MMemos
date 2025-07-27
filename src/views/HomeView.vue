<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FileText, Archive, Bolt, Tag } from 'lucide-vue-next'
import SettingsList from '@/components/ui/list-item/settings-list.vue'
import { useI18n } from 'vue-i18n'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import { Button } from '@/components/ui/button'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getUserStats } from '@/api/stats'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

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

const tagValues = ref<string[]>([])

const tags = computed(() => {
    return tagValues.value.map((tag) => {
        return {
            icon: Tag,
            title: tag,
            type: 'arrow' as const,
            onClick: () =>
                router.push({
                    name: 'MainWithTag',
                    params: { tag },
                }),
        }
    })
})

const stats = ref<any>(null)
const memosCount = computed(() => stats.value?.totalMemoCount || 0)
const tagCount = computed(() => Object.keys(stats.value?.tagCount || {}).length)
const pinCount = computed(() => stats.value?.pinnedMemos.length || 0)

onMounted(async () => {
    try {
        const s = await getUserStats(authStore.user?.name || '')
        stats.value = s
        tagValues.value = Object.keys(s.tagCount || {})
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <div
        class="flex flex-col px-5 gap-3"
        style="height: calc(100vh - env(safe-area-inset-top) + 8px)">
        <div
            class="flex justify-between items-center sticky top-0 z-10 mb-0.5 bg-background">
            <div class="flex items-center gap-2">
                <div class="text-4xl text-primary font-style">
                    {{
                        authStore.user?.displayName ||
                        authStore.user?.username ||
                        ''
                    }}
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
                    margin-bottom: calc(env(safe-area-inset-bottom) + 2rem);
                " />
        </div>
    </div>
</template>
