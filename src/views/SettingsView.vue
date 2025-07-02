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
import { useLocale } from '@/composables/useLocale'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { currentLocale, locales, setLocale } = useLocale()
var selectedLocale = ref(currentLocale)

const handleBack = () => {
    router.back()
}

const handleLogout = () => {
    router.push({ name: 'Login' })
    authStore.logout()
}

const enableAutoTitle = ref(true)
const languageSelectOpen = ref(false)

const handleLanguageSelect = (locale: string) => {
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
        modelValue: enableAutoTitle,
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
        style="height: calc(100vh - env(safe-area-inset-top))">
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
                    :items="functionItems" />

                <SettingsList
                    :title="$t('settings.about.title')"
                    :items="aboutItems" />
            </div>
        </div>

        <div
            class="mt-auto mx-3"
            style="margin-bottom: calc(env(safe-area-inset-bottom) + 1rem)">
            <TouchAnimation>
                <Button
                    @click="handleLogout"
                    class="w-full h-11 text-lg font-bold !shadow-none">
                    {{ $t('settings.logout') }}
                </Button>
            </TouchAnimation>
        </div>

        <AlertDialog
            :open="languageSelectOpen"
            @update:open="languageSelectOpen = $event">
            <AlertDialogContent class="px-8 gap-4">
                <AlertDialogHeader class="-my-1.5">
                    <AlertDialogTitle class="text-2xl font-bold">
                        {{ $t('settings.function.language') }}
                    </AlertDialogTitle>
                    <AlertDialogDescription> </AlertDialogDescription>
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
                        class="h-10 !shadow-none text-base border-primary"
                        @click="handleLanguageConfirm">
                        {{ $t('settings.function.confirm') }}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
