<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginData } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDarkMode } from '@/composables/useDarkMode'
import { useLocale } from '@/composables/useLocale'
import { Moon, Sun, Languages, CircleQuestionMark } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

const router = useRouter()
const authStore = useAuthStore()
const { toggleDarkMode, isDark } = useDarkMode()
const { currentLocale, locales, setLocale } = useLocale()

// 响应式数据
const serverUrl = ref('')
const accessToken = ref('')

const handleLogin = async () => {
    if (!serverUrl.value.trim() || !accessToken.value.trim()) {
        alert('请填写完整的登录信息')
        return
    }

    const loginData: LoginData = {
        serverUrl: serverUrl.value.trim(),
        accessToken: accessToken.value.trim()
    }

    try {
        const response = await authStore.login(loginData)

        if (response.success) {
            // 保存认证状态到 localStorage
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('serverUrl', loginData.serverUrl)
            localStorage.setItem('accessToken', loginData.accessToken)

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
    <div class=" min-h-screen flex flex-col items-center justify-center bg-background">
        <img :src="isDark ? logoDark : logo" alt="logo" class="w-40 h-40 mb-8 -mt-40" />

        <h1 class="text-2xl dark:text-primary font-bold mb-8">{{ $t('login.title') }}</h1>

        <div class="w-full max-w-sm px-5">
            <form class="mb-7">
                <div class="grid items-center w-full gap-4">
                    <div class="flex flex-col space-y-2">
                        <div class="flex items-center gap-0.5">
                            <Label for="serverUrl" class="text-base dark:text-primary">
                                {{ $t('login.loginServerUrlHeader') }}
                            </Label>
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button variant="ghost" class="!h-6 !w-6 !p-0 dark:text-primary">
                                        <CircleQuestionMark class="!h-5 !w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="top">
                                    <div>
                                        <!-- TODO: fix layout -->
                                        https://www.usememos.com/docs
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input id="serverUrl" v-model="serverUrl" type="url"
                            placeholder="http[s]://server.com[:port]" />
                    </div>

                    <div class="flex flex-col space-y-1.5">
                        <div class="flex items-center gap-0.5">
                            <Label for="accessToken" class="text-base dark:text-primary">
                                {{ $t('login.loginAccessTokenHeader') }}
                            </Label>
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button variant="ghost" class="!h-6 !w-6 !p-0 dark:text-primary">
                                        <CircleQuestionMark class="!h-5 !w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="top">
                                    <div>
                                        <!-- TODO: fix layout -->
                                        https://www.usememos.com/docs/security/access-tokens
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input id="accessToken" v-model="accessToken" type="password" placeholder="Access Token" />
                    </div>
                </div>

            </form>

            <Button class="w-full h-11 font-bold text-base" @click="handleLogin">
                {{ $t('login.loginButton') }}
            </Button>
        </div>

        <div class="fixed bottom-12 right-6 flex flex-col gap-5">
            <Button variant="outline" size="icon" @click="toggleDarkMode"
                class="shadow-none border-primary !bg-transparent h-10 w-10">
                <Sun v-if="isDark" class="!h-5 !w-5 !text-primary" />
                <Moon v-else class="!h-5 !w-5 !text-primary" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="icon" class="shadow-none border-primary !bg-transparent h-10 w-10">
                        <Languages class="!h-5 !w-5 !text-primary" />
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
