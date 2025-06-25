import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales";
import router from "./router";
import "./assets/index.css";
import "./assets/global.css";
import { createPinia } from 'pinia';
import { useForwardConsoleLog } from './composables/useForwardConsoleLog';

useForwardConsoleLog()

const pinia = createPinia()
const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(pinia);

app.mount("#app");

window.onload = () => {
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 100) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}