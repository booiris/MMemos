import { createI18n } from 'vue-i18n';

import enUS from './en-US';
import zhCN from './zh-CN';

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS
    }
});

export default i18n;