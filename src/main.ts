import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './locales'
import router from './router'
import './assets/index.css'
import './assets/global.css'
import { createPinia } from 'pinia'
import { useForwardConsoleLog } from './utils/forwardConsoleLog'
import '@fontsource/eb-garamond/500.css'
import authImage from './utils/authImageLoader'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import { useAuthStore } from './stores/auth'

useForwardConsoleLog()

const pinia = createPinia()
const app = createApp(App)


app.use(pinia)

const authStore = useAuthStore()
app.use(authImage, {
    getHeaders: () => {
        return {
            Authorization: `Bearer ${authStore.accessToken}`,
        }
    },
})

app.use(i18n)
app.use(VueViewer)
app.use(router)

app.mount('#app')

// prevent double tap to zoom
window.onload = () => {
    document.addEventListener(
        'touchstart',
        (event) => {
            if (event.touches.length > 1) {
                event.preventDefault()
            }
        },
        { passive: false }
    )

    let lastTouchEnd = 0
    document.addEventListener(
        'touchend',
        (event) => {
            const now = new Date().getTime()
            if (now - lastTouchEnd <= 100) {
                event.preventDefault()
            }
            lastTouchEnd = now
        },
        false
    )

    document.addEventListener('gesturestart', function (event) {
        event.preventDefault()
    })
}
