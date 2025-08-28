<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginData } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocale } from '@/composables/useLocale'
import { Languages, CircleQuestionMark, Loader2 } from 'lucide-vue-next'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'
import logo from '@/assets/logo.png'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { currentLocale, locales, setLocale } = useLocale()

const serverUrl = ref(
    import.meta.env.DEV
        ? import.meta.env.VITE_DEFAULT_DEBUG_SERVER_URL || ''
        : ''
)
const accessToken = ref(
    import.meta.env.DEV
        ? import.meta.env.VITE_DEFAULT_DEBUG_ACCESS_TOKEN || ''
        : ''
)
const loading = ref(false)
const { t } = useI18n()

const showAlert = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning'>('error')

const showAlertDialog = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' = 'error'
) => {
    alertTitle.value = title
    alertMessage.value = message
    alertType.value = type
    showAlert.value = true
}

const handleLogin = async () => {
    if (!serverUrl.value.trim() || !accessToken.value.trim()) {
        showAlertDialog(
            t('login.alert.title'),
            t('login.alert.message'),
            'warning'
        )
        return
    }

    loading.value = true

    const loginData: LoginData = {
        serverUrl: serverUrl.value.trim(),
        accessToken: accessToken.value.trim(),
    }

    try {
        const response = await authStore.login(loginData)

        if (response.success) {
            router.push({ name: 'Main' })
        } else {
            showAlertDialog(
                t('login.alert.loginFailed'),
                response.message || t('login.alert.loginFailed'),
                'error'
            )
        }
    } catch (error) {
        showAlertDialog(
            t('login.alert.loginFailed'),
            t('login.alert.loginFailed'),
            'error'
        )
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="flex flex-col items-center justify-center bg-background"
        style="height: calc(100vh - var(--safe-area-top) + 8px)">
        <img
            :src="logo"
            alt="logo"
            class="w-40 h-40 mb-8 -mt-40 select-none pointer-events-none"
            style="
                user-select: none;
                -webkit-user-select: none;
                -webkit-touch-callout: none;
            "
            @contextmenu.prevent
            @dragstart.prevent />

        <h1 class="text-3xl dark:text-primary font-bold mb-8 font-style">
            {{ t('login.title') }}
        </h1>

        <div class="w-full max-w-sm px-5">
            <form class="mb-8">
                <div class="grid items-center w-full gap-4">
                    <div class="flex flex-col space-y-2">
                        <div class="flex items-center gap-0.5">
                            <Label
                                for="serverUrl"
                                class="text-base dark:text-primary">
                                {{ t('login.loginServerUrlHeader') }}
                            </Label>
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button
                                        variant="ghost"
                                        class="!h-6 !w-6 !p-0 dark:text-primary">
                                        <CircleQuestionMark class="!h-5 !w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    side="top"
                                    class="h-auto w-auto p-4 pt-3 pb-3">
                                    <div>
                                        <a
                                            href="https://www.usememos.com/docs"
                                            target="_blank"
                                            class="underline text-primary font-bold">
                                            Help Doc
                                        </a>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input
                            id="serverUrl"
                            v-model="serverUrl"
                            type="url"
                            placeholder="http[s]://server.com[:port]"
                            required />
                    </div>

                    <div class="flex flex-col space-y-1.5">
                        <div class="flex items-center gap-0.5">
                            <Label
                                for="accessToken"
                                class="text-base dark:text-primary">
                                {{ t('login.loginAccessTokenHeader') }}
                            </Label>
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button
                                        variant="ghost"
                                        class="!h-6 !w-6 !p-0 dark:text-primary">
                                        <CircleQuestionMark class="!h-5 !w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    side="top"
                                    class="h-auto w-auto p-4 pt-3 pb-3">
                                    <div>
                                        <a
                                            href="https://www.usememos.com/docs/security/access-tokens"
                                            target="_blank"
                                            class="underline text-primary font-bold">
                                            Help Doc
                                        </a>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input
                            id="accessToken"
                            v-model="accessToken"
                            type="password"
                            placeholder="Access Token"
                            required />
                    </div>
                </div>
            </form>

            <TouchAnimation :disabled="loading">
                <Button
                    class="w-full h-11 font-bold text-base"
                    @click="handleLogin"
                    :disabled="loading">
                    <Loader2 v-if="loading" class="!h-6 !w-6 animate-spin" />
                    <span v-else class="text-base">
                        {{ t('login.loginButton') }}
                    </span>
                </Button>
            </TouchAnimation>
        </div>

        <div
            class="fixed right-6 flex flex-col gap-4"
            style="bottom: calc(0.5rem + var(--safe-area-bottom))">
            <!-- <TouchAnimation>
                <Button variant="outline" size="icon" @click="toggleDarkMode"
                    class="shadow-none border-primary !bg-transparent h-10 w-10">
                    <Sun v-if="isDark" class="!h-5 !w-5 !text-primary" />
                    <Moon v-else class="!h-5 !w-5 !text-primary" />
                </Button>
            </TouchAnimation> -->

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <TouchAnimation>
                        <Button
                            variant="outline"
                            size="icon"
                            class="shadow-none border-primary !bg-transparent h-10 w-10">
                            <Languages class="!h-5 !w-5 !text-primary" />
                        </Button>
                    </TouchAnimation>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        v-for="locale in locales"
                        :key="locale.value"
                        @click="setLocale(locale.value)"
                        class="cursor-pointer"
                        :class="{
                            'bg-accent': currentLocale === locale.value,
                        }">
                        {{ locale.label }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <AlertDialog v-model:open="showAlert">
            <AlertDialogContent class="pl-8 pr-8 gap-4">
                <AlertDialogHeader>
                    <AlertDialogTitle class="text-xl font-bold">
                        {{ alertTitle }}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription class="text-base">
                    {{ alertMessage }}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction
                        class="h-10 text-base"
                        @click="showAlert = false">
                        {{ t('login.alert.confirm') }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
