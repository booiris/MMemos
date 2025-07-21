import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            noAuth: true,
        },
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('@/views/MainView.vue'),
    },
    {
        path: '/main/tag/:tag',
        name: 'MainWithTag',
        component: () => import('@/views/MainView.vue'),
    },
    {
        path: '/archive',
        name: 'Archive',
        component: () => import('@/views/MainView.vue'),
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    if (to.name === 'Settings') {
        to.meta.transition = 'slide-right'
    } else if (from.name == 'Settings') {
        if (to.name !== 'Login') {
            to.meta.transition = 'slide-left'
        }
    } else if (
        to.name === 'Home' &&
        (from.name === 'Main' ||
            from.name === 'MainWithTag' ||
            from.name === 'Archive')
    ) {
        to.meta.transition = 'slide-left'
    } else if (
        from.name === 'Home' &&
        (to.name === 'Main' ||
            to.name === 'MainWithTag' ||
            to.name === 'Archive')
    ) {
        to.meta.transition = 'slide-right'
    }

    if (!to.meta.noAuth) {
        const { useAuthStore } = await import('@/stores/auth')
        const authStore = useAuthStore()

        if (!authStore.isAuthenticated) {
            authStore.checkAuth()
        }

        if (!authStore.isAuthenticated) {
            next({ name: 'Login' })
            return
        }
    }

    next()
})

export default router
