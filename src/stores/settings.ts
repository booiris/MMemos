import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TauriStore } from '@/utils/tauriStore'

export const useSettingsStore = defineStore('settings', () => {
    // Auto title setting
    const enableAutoTitle = ref<boolean>(true)
    const enableAutoRefresh = ref<boolean>(false)
    const enableRandomHistory = ref<boolean>(true)

    // Initialize settings from TauriStore
    const initSettings = async () => {
        try {
            const [savedAutoTitle, savedAutoRefresh, savedRandomHistory] =
                await Promise.all([
                    TauriStore.get<boolean>('enableAutoTitle'),
                    TauriStore.get<boolean>('enableAutoRefresh'),
                    TauriStore.get<boolean>('enableRandomHistory'),
                ])

            if (savedAutoTitle !== null) {
                enableAutoTitle.value = savedAutoTitle
            }
            if (savedAutoRefresh !== null) {
                enableAutoRefresh.value = savedAutoRefresh
            }
            if (savedRandomHistory !== null) {
                enableRandomHistory.value = savedRandomHistory
            }
        } catch (error) {
            console.error('Failed to initialize settings:', error)
        }
    }

    // Save auto title setting
    const setAutoTitle = async (value: boolean) => {
        enableAutoTitle.value = value
        try {
            await TauriStore.set('enableAutoTitle', value)
        } catch (error) {
            console.error('Failed to save enableAutoTitle setting:', error)
        }
    }

    // Save auto refresh setting
    const setAutoRefresh = async (value: boolean) => {
        enableAutoRefresh.value = value
        try {
            await TauriStore.set('enableAutoRefresh', value)
        } catch (error) {
            console.error('Failed to save enableAutoRefresh setting:', error)
        }
    }

    // Save random history setting
    const setRandomHistory = async (value: boolean) => {
        enableRandomHistory.value = value
        try {
            await TauriStore.set('enableRandomHistory', value)
        } catch (error) {
            console.error('Failed to save enableRandomHistory setting:', error)
        }
    }

    // Initialize settings (async)
    initSettings().catch((error) => {
        console.error('Initial settings load failed:', error)
    })

    return {
        // State
        enableAutoTitle,
        enableAutoRefresh,
        enableRandomHistory,

        // Actions
        initSettings,
        setAutoTitle,
        setAutoRefresh,
        setRandomHistory,
    }
})
