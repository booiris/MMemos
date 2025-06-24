import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLocale = () => {
    const { locale } = useI18n()
    const currentLocale = ref(locale.value)

    const locales = [
        { value: 'zh-CN', label: '中文' },
        { value: 'en-US', label: 'English' }
    ]

    const setLocale = (newLocale: string) => {
        locale.value = newLocale
        currentLocale.value = newLocale
        localStorage.setItem('locale', newLocale)
    }

    const initLocale = () => {
        const savedLocale = localStorage.getItem('locale')
        if (savedLocale) {
            setLocale(savedLocale)
        }
    }

    onMounted(() => {
        initLocale()
    })

    return {
        currentLocale,
        locales,
        setLocale
    }
}