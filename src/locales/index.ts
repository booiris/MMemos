import { createI18n } from 'vue-i18n'

import enUS from './en-US'
import zhCN from './zh-CN'

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('locale') || 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS,
    },
})

const locales = [
    {
        value: 'zh-CN',
        label: '中文',
    },
    {
        value: 'en-US',
        label: 'English',
    },
]

export { i18n, locales }
