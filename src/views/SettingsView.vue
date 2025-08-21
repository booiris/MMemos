<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import {
    ChevronLeft,
    ExternalLink,
    Bug,
    Languages,
    Link,
    ThumbsUp,
    RefreshCw,
    // ClockArrowUp,
} from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import SettingsList from '@/components/ui/list-item/settings-list.vue'
import { openUrl } from '@tauri-apps/plugin-opener'
import { useLocale } from '@/composables/useLocale'
import { useSwipeBack } from '@/composables/useSwipeBack'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Locale } from '@/locales'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()
const { currentLocale, locales, setLocale } = useLocale()
var selectedLocale = ref(currentLocale.value)

onMounted(async () => {
    await settingsStore.initSettings()
})

const handleBack = () => {
    router.back()
}

const handleLogout = () => {
    router.push({ name: 'Login' })
    authStore.logout()
}

const languageSelectOpen = ref(false)
const acknowledgmentsDialogOpen = ref(false)

const handleLanguageSelect = (locale: Locale) => {
    selectedLocale.value = locale
}

const handleLanguageConfirm = () => {
    languageSelectOpen.value = false
    setTimeout(() => {
        setLocale(selectedLocale.value)
    }, 150)
}

const functionItems = computed(() => [
    {
        icon: Languages,
        title: t('settings.function.language'),
        type: 'arrow' as const,
        onClick: () => {
            languageSelectOpen.value = true
        },
    },
    {
        icon: Link,
        title: t('settings.function.autoTitle'),
        type: 'switch' as const,
        modelValue: settingsStore.enableAutoTitle,
        onChange: (value: boolean) => settingsStore.setAutoTitle(value),
    },
    {
        icon: RefreshCw,
        title: t('settings.function.refresh'),
        type: 'switch' as const,
        modelValue: settingsStore.enableAutoRefresh,
        onChange: (value: boolean) => settingsStore.setAutoRefresh(value),
    },
    // {
    //     icon: ClockArrowUp,
    //     title: t('settings.function.randomHistory'),
    //     type: 'switch' as const,
    //     modelValue: settingsStore.enableRandomHistory,
    //     onChange: (value: boolean) => settingsStore.setRandomHistory(value),
    // },
])

const aboutItems = computed(() => [
    {
        icon: ExternalLink,
        title: t('settings.about.privacy'),
        type: 'arrow' as const,
        onClick: () => {
            openUrl('https://privacy-page-memos.vercel.app/')
        },
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
        onClick: () => {
            acknowledgmentsDialogOpen.value = true
        },
    },
])

useSwipeBack({ onSwipe: handleBack }, '#settings-view')
</script>

<template>
    <div
        class="flex flex-col px-3 gap-2 -mt-1.5"
        style="height: calc(100vh - env(safe-area-inset-top) + 8px)"
        id="settings-view">
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
                {{ t('settings.title') }}
            </h1>

            <div class="space-y-4 mt-3">
                <SettingsList
                    :title="t('settings.function.title')"
                    :items="functionItems" />

                <SettingsList
                    :title="t('settings.about.title')"
                    :items="aboutItems" />
            </div>
        </div>

        <div
            class="mt-auto mx-3"
            style="margin-bottom: calc(env(safe-area-inset-bottom) + 0.5rem)">
            <TouchAnimation>
                <Button
                    @click="handleLogout"
                    class="w-full h-11 text-base font-bold !shadow-none">
                    {{ t('settings.logout') }}
                </Button>
            </TouchAnimation>
        </div>

        <AlertDialog
            :open="languageSelectOpen"
            @update:open="languageSelectOpen = $event">
            <AlertDialogContent class="px-8 gap-4 pt-4">
                <AlertDialogHeader>
                    <AlertDialogTitle class="text-2xl font-bold">
                        {{ t('settings.function.language') }}
                    </AlertDialogTitle>
                    <AlertDialogDescription class="sr-only">
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div class="space-y-2">
                    <div
                        v-for="locale in locales"
                        :key="locale.value"
                        @click="handleLanguageSelect(locale.value)">
                        <div
                            class="flex items-center justify-between p-3 rounded-lg border border-primary transition-colors pl-5"
                            :class="{
                                'bg-primary text-primary-foreground':
                                    selectedLocale === locale.value,
                                'bg-background border-border hover:bg-accent':
                                    selectedLocale !== locale.value,
                            }">
                            <span class="text-base font-medium">{{
                                locale.label
                            }}</span>
                            <div
                                v-if="selectedLocale === locale.value"
                                class="w-2 h-2 rounded-full bg-primary-foreground"></div>
                        </div>
                    </div>
                </div>

                <AlertDialogFooter class="mt-2">
                    <AlertDialogCancel
                        class="h-10 !shadow-none text-base border-primary !focus:outline-none"
                        @click="handleLanguageConfirm">
                        {{ t('settings.function.confirm') }}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog
            :open="acknowledgmentsDialogOpen"
            @update:open="acknowledgmentsDialogOpen = $event">
            <DialogContent class="px-3 gap-1 pt-4">
                <DialogHeader class="-mb-2">
                    <DialogTitle class="text-2xl">
                        {{ t('settings.about.acknowledgments') }}
                    </DialogTitle>
                    <DialogDescription class="sr-only"> </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4 overflow-y-auto px-6">
                    <div class="flex flex-col justify-between">
                        <p class="text-xl font-bold">Thanks To:</p>
                        <p class="text-lg">Rust, Tauri, Vue</p>
                        <p class="text-lg">Shadcn, Shadcn-vue</p>
                        <p class="text-lg">EB Garamond, LXGW-wenkai</p>
                        <p class="text-lg">Lucide-vue-next</p>
                        <p class="text-lg">Cursor, Moe Memos</p>
                    </div>
                </div>
                <DialogFooter class="px-6 !shadow-none">
                    <Button
                        @click="acknowledgmentsDialogOpen = false"
                        class="!shadow-none h-11 text-lg">
                        {{ t('settings.acknowledgments.ok') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
