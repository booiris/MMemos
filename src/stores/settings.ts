import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // Auto title setting
    const enableAutoTitle = ref<boolean>(true)
    const enableAutoRefresh = ref<boolean>(false)
    const enableRandomHistory = ref<boolean>(true)

    // Initialize settings from localStorage
    const initSettings = () => {
        const savedAutoTitle = localStorage.getItem('enableAutoTitle')
        const savedAutoRefresh = localStorage.getItem('enableAutoRefresh')
        const savedRandomHistory = localStorage.getItem('enableRandomHistory')

        if (savedAutoTitle !== null) {
            enableAutoTitle.value = JSON.parse(savedAutoTitle)
        }
        if (savedAutoRefresh !== null) {
            enableAutoRefresh.value = JSON.parse(savedAutoRefresh)
        }
        if (savedRandomHistory !== null) {
            enableRandomHistory.value = JSON.parse(savedRandomHistory)
        }
    }

    // Save auto title setting
    const setAutoTitle = (value: boolean) => {
        enableAutoTitle.value = value
        localStorage.setItem('enableAutoTitle', JSON.stringify(value))
    }

    // Save auto refresh setting
    const setAutoRefresh = (value: boolean) => {
        enableAutoRefresh.value = value
        localStorage.setItem('enableAutoRefresh', JSON.stringify(value))
    }

    // Save random history setting
    const setRandomHistory = (value: boolean) => {
        enableRandomHistory.value = value
        localStorage.setItem('enableRandomHistory', JSON.stringify(value))
    }

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
