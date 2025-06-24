import { computed, onMounted } from 'vue'
import { useColorMode } from '@vueuse/core'

export const useDarkMode = () => {
    const mode = useColorMode()
    const isDark = computed(() => mode.value === 'dark')

    const toggleDarkMode = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('darkMode', mode.value)
    }

    const initDarkMode = () => {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode) {
            mode.value = savedMode === 'true' ? 'dark' : 'light'
        } else {
            mode.value = 'auto'
        }
    }

    onMounted(() => {
        initDarkMode()
    })

    return {
        toggleDarkMode,
        isDark
    }
}