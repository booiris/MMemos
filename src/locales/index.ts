import { createI18n } from 'vue-i18n'

import enUS from './en-US'
import zhCN from './zh-CN'

export type Locale = 'en-US' | 'zh-CN'

const i18n = createI18n({
    legacy: false,
    locale: 'en-US' as Locale, // Default language, will be loaded from TauriStore after app initialization
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS,
    },
})

const locales = [
    {
        value: 'zh-CN' as Locale,
        label: '中文',
    },
    {
        value: 'en-US' as Locale,
        label: 'English',
    },
]

export { i18n, locales }
