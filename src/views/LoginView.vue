<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginData } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDarkMode } from '@/composables/useDarkMode'
import { useLocale } from '@/composables/useLocale'
import { Moon, Sun, Languages } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { toggleDarkMode, isDark } = useDarkMode()
const { currentLocale, locales, setLocale } = useLocale()

const handleLogin = async (data: LoginData) => {
    try {
        const response = await authStore.login(data)

        if (response.success) {
            // 保存认证状态到 localStorage
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('serverUrl', data.serverUrl)
            localStorage.setItem('accessToken', data.accessToken)

            alert(`登录成功！欢迎 ${response.user?.name}`)

            // 跳转到仪表板
            router.push({ name: 'Dashboard' })
        } else {
            alert(`登录失败：${response.message}`)
        }
    } catch (error) {
        alert('登录失败，请检查网络连接')
    }
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push({ name: 'Dashboard' })
    }
})
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center bg-background">
        <Card class="w-full max-w-md">
            <CardHeader>
                <CardTitle>{{ $t('login.title') }}</CardTitle>
                <CardDescription>{{ $t('login.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
                <Button class="w-full" @click="handleLogin">
                    {{ $t('login.loginButton') }}
                </Button>
            </CardFooter>
        </Card>

        <div class="fixed bottom-6 right-6 flex flex-col gap-3">
            <Button variant="outline" size="icon" @click="toggleDarkMode" class="shadow-lg">
                <Sun v-if="isDark" class="h-4 w-4" />
                <Moon v-else class="h-4 w-4" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="icon" class="shadow-lg">
                        <Languages class="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="locale in locales" :key="locale.value" @click="setLocale(locale.value)"
                        class="cursor-pointer" :class="{ 'bg-accent': currentLocale === locale.value }">
                        {{ locale.label }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>