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

router.beforeEach(async (to, _from, next) => {
    if (!to.meta.noAuth) {
        const { useAuthStore } = await import('@/stores/auth');
        const authStore = useAuthStore();

        let isAuthenticated = authStore.isAuthenticated;

        if (!isAuthenticated) {
            isAuthenticated = authStore.checkAuth();
        }

        if (!isAuthenticated) {
            next({ name: 'Login' });
            return;
        }
    }

    next();
});

export default router; 