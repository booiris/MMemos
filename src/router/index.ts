import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            noAuth: true,
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
    },
    {
        path: '/memos',
        name: 'Memos',
        component: () => import('@/views/MemosView.vue'),
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.name === 'Settings' && from.name === 'Dashboard') {
        to.meta.transition = 'slide-right'
    } else if (from.name === 'Settings' && to.name === 'Dashboard') {
        to.meta.transition = 'slide-left'
    }

    if (!to.meta.noAuth) {
        const { useAuthStore } = await import('@/stores/auth');
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) {
            authStore.checkAuth();
        }

        if (!authStore.isAuthenticated) {
            next({ name: 'Login' });
            return;
        }
    }

    next();
});

export default router; 