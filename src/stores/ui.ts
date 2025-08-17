import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TauriStore } from '@/utils/tauriStore'
import { Locale } from '@/locales'

export const useUiStore = defineStore('ui', () => {
    // State
    const locale = ref<Locale>('en-US')

    // Actions
    const initUiSettings = async () => {
        try {
            const savedLocale = await TauriStore.getItem('locale')

            if (
                savedLocale &&
                (savedLocale === 'en-US' || savedLocale === 'zh-CN')
            ) {
                locale.value = savedLocale as Locale
            }
        } catch (error) {
            console.error('Failed to initialize UI settings:', error)
        }
    }

    const setLocale = async (newLocale: Locale) => {
        locale.value = newLocale
        try {
            await TauriStore.setItem('locale', newLocale)
        } catch (error) {
            console.error('Failed to save locale setting:', error)
        }
    }

    // Initialize UI settings (async)
    initUiSettings()
        .catch((error) => {
            console.error('Initial UI settings load failed:', error)
        })

    return {
        // State
        locale,

        // Actions
        initUiSettings,
        setLocale,
    }
})
