<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
    ChevronLeft,
    ExternalLink,
    Bug,
    Languages,
    Link,
    ThumbsUp,
} from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import SettingsList from '@/components/ui/list-item/settings-list.vue'
import { openUrl } from '@tauri-apps/plugin-opener'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const handleBack = () => {
    router.back()
}

const handleLogout = () => {
    router.push({ name: 'Login' })
    authStore.logout()
}

const enableAutoTitle = ref(true)

// 处理设置项值更新
const handleItemUpdate = (index: number, value: boolean) => {
    if (index === 1) {
        // autoTitle 是第二个项目
        enableAutoTitle.value = value
    }
}

const functionItems = computed(() => [
    {
        icon: Languages,
        title: t('settings.function.language'),
        type: 'arrow' as const,
        onClick: () => console.log('language'),
    },
    {
        icon: Link,
        title: t('settings.function.autoTitle'),
        type: 'switch' as const,
        modelValue: enableAutoTitle.value,
    },
])

const aboutItems = computed(() => [
    {
        icon: ExternalLink,
        title: t('settings.about.privacy'),
        type: 'arrow' as const,
        onClick: () => console.log('privacy'),
    },
    {
        icon: Bug,
        title: t('settings.about.bugReport'),
        type: 'arrow' as const,
        onClick: () => {
            openUrl('https://github.com/booiris/mmm-memos/issues')
        },
    },
    {
        icon: ThumbsUp,
        title: t('settings.about.acknowledgments'),
        type: 'arrow' as const,
        onClick: () => console.log('acknowledgments'),
    },
])
</script>

<template>
    <div
        class="flex flex-col px-3 gap-3"
        style="
            height: calc(
                100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top)
            );
        ">
        <div>
            <button @click="handleBack" class="flex items-center">
                <ChevronLeft class="!h-8 !w-8 text-primary" />
                <span class="font-primary text-xl">{{
                    authStore.user?.username || ''
                }}</span>
            </button>
        </div>

        <div class="mx-3">
            <h1 class="ml-2 text-4xl font-bold text-primary font-style mb-5">
                {{ $t('settings.title') }}
            </h1>

            <div class="space-y-4 mt-3">
                <SettingsList
                    :title="$t('settings.function.title')"
                    :items="functionItems"
                    @update:item="handleItemUpdate" />

                <SettingsList
                    :title="$t('settings.about.title')"
                    :items="aboutItems"
                    @update:item="handleItemUpdate" />
            </div>
        </div>

        <div class="mt-auto mb-8 mx-3">
            <TouchAnimation>
                <Button
                    @click="handleLogout"
                    class="w-full h-11 text-lg font-bold !shadow-none">
                    {{ $t('settings.logout') }}
                </Button>
            </TouchAnimation>
        </div>
    </div>
</template>
