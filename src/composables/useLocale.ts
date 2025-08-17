import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale, locales } from '@/locales'
import { useUiStore } from '@/stores/ui'

export const useLocale = () => {
    const { locale } = useI18n()
    const uiStore = useUiStore()

    // Sync i18n locale with ui store
    const currentLocale = computed({
        get: () => uiStore.locale,
        set: (newLocale: Locale) => {
            locale.value = newLocale
            uiStore.setLocale(newLocale)
        },
    })

    const setLocale = async (newLocale: Locale) => {
        locale.value = newLocale
        await uiStore.setLocale(newLocale)
    }

    return {
        currentLocale,
        locales,
        setLocale,
    }
}
