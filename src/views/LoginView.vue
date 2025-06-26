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
import { Moon, Sun, Languages, CircleQuestionMark, Loader2 } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

const router = useRouter()
const authStore = useAuthStore()
const { toggleDarkMode, isDark } = useDarkMode()
const { currentLocale, locales, setLocale } = useLocale()

const serverUrl = ref(import.meta.env.VITE_DEFAULT_DEBUG_SERVER_URL || '')
const accessToken = ref(import.meta.env.VITE_DEFAULT_DEBUG_ACCESS_TOKEN || '')
const loading = ref(false)

const showAlert = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning'>('error')

const showAlertDialog = (title: string, message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    alertTitle.value = title
    alertMessage.value = message
    alertType.value = type
    showAlert.value = true
}

const handleLogin = async () => {
    if (!serverUrl.value.trim() || !accessToken.value.trim()) {
        showAlertDialog('提示', '请填写完整的登录信息', 'warning')
        return
    }

    loading.value = true

    const loginData: LoginData = {
        serverUrl: serverUrl.value.trim(),
        accessToken: accessToken.value.trim()
    }

    try {
        const response = await authStore.login(loginData)

        if (response.success) {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('serverUrl', loginData.serverUrl)
            localStorage.setItem('accessToken', loginData.accessToken)

            showAlertDialog('登录成功', `欢迎 ${response.user?.name}！`, 'success')

            setTimeout(() => {
                router.push({ name: 'Dashboard' })
            }, 1500)
        } else {
            showAlertDialog('登录失败', response.message || '登录失败', 'error')
        }
    } catch (error) {
        showAlertDialog('登录失败', '请检查网络连接', 'error')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push({ name: 'Dashboard' })
    }
})

</script>

<template>
    <div class="flex flex-col items-center justify-center bg-background">
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
                                <PopoverContent side="top" class="h-auto w-auto p-4 pt-3 pb-3">
                                    <div>
                                        <a href="https://www.usememos.com/docs" target="_blank"
                                            class="underline text-primary font-bold">
                                            Help Doc
                                        </a>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input id="serverUrl" v-model="serverUrl" type="url" placeholder="http[s]://server.com[:port]"
                            required />
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
                                <PopoverContent side="top" class="h-auto w-auto p-4 pt-3 pb-3">
                                    <div>
                                        <a href="https://www.usememos.com/docs/security/access-tokens" target="_blank"
                                            class="underline text-primary font-bold">
                                            Help Doc
                                        </a>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input id="accessToken" v-model="accessToken" type="password" placeholder="Access Token"
                            required />
                    </div>
                </div>

            </form>

            <Button class="w-full h-11 font-bold text-base"
                style="transition: all 0.15s ease-in-out; transform-origin: center; -webkit-tap-highlight-color: transparent;"
                @click="handleLogin" @touchstart="(e) => e.target.style.transform = 'scale(0.96)'"
                @touchend="(e) => e.target.style.transform = 'scale(1)'"
                @touchcancel="(e) => e.target.style.transform = 'scale(1)'" :disabled="loading">
                <Loader2 v-if="loading" class="!h-6 !w-6 animate-spin" />
                <span v-else>
                    {{ $t('login.loginButton') }}
                </span>
            </Button>
        </div>

        <div class="fixed bottom-6 right-6 flex flex-col gap-4">
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

        <AlertDialog v-model:open="showAlert">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{{ alertTitle }}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    {{ alertMessage }}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction @click="showAlert = false">确定</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
