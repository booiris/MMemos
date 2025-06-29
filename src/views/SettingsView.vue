<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ChevronLeft, ChevronRight, ExternalLink, Bug, Languages, Link } from 'lucide-vue-next'
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleBack = () => {
    router.back()
}

const handleLogout = () => {
    router.push({ name: 'Login' })
    authStore.logout()
}

const enableAutoTitle = ref(true)

// 处理设置项点击
const handleSettingClick = (type: string) => {
    switch (type) {
        case 'privacy':
            // 打开隐私政策
            window.open('/privacy', '_blank')
            break
        case 'feedback':
            // 打开反馈页面或邮件
            window.open('mailto:feedback@example.com?subject=Bug反馈', '_blank')
            break
        case 'language':
            // 切换语言设置
            console.log('切换语言设置')
            break
    }
}
</script>


<template>
    <div class="flex flex-col px-3 gap-3"
        style="height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top));">
        <div>
            <button @click="handleBack" class="flex items-center">
                <ChevronLeft class="!h-8 !w-8 text-primary" />
                <span class="font-primary text-xl">{{ authStore.user?.username || '' }}</span>
            </button>
        </div>

        <div class="mx-3">
            <h1 class="ml-2 text-4xl font-bold text-primary font-style mb-5">
                {{ $t('settings.title') }}
            </h1>

            <div class="space-y-4 mt-3">

                <div>
                    <h2 class="text-2xl text-primary font-style mb-1"> {{ $t('settings.function.title') }} </h2>

                    <div class="p-4 border rounded-lg border-primary space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <Languages class="!w-6 !h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-primary text-xl">
                                        {{ $t('settings.function.language') }}
                                    </h3>
                                </div>
                            </div>
                            <button @click="handleSettingClick('language')" class="text-primary">
                                <ChevronRight class="!w-6 !h-6" />
                            </button>
                        </div>

                        <div class="border-b border-primary my-3"></div>

                        <!-- 是否启用图片搜索 -->
                        <!-- <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center">
                                    <Languages class="!w-6 !h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-primary text-lg">
                                        {{ $t('settings.function.imageSearch') }}
                                    </h3>
                                </div>
                            </div>
                            <button @click="handleSettingClick('language')" class="text-primary">
                                <ChevronRight class="!w-6 !h-6" />
                            </button>
                        </div> -->

                        <!-- <div class="border-b border-primary my-3"></div> -->

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-10 h-10  flex items-center justify-center">
                                    <Link class="!w-6 !h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-primary text-xl">
                                        {{ $t('settings.function.autoTitle') }}
                                    </h3>
                                </div>
                            </div>
                            <Switch v-model="enableAutoTitle">
                            </Switch>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl text-primary font-style mb-1"> {{ $t('settings.about.title') }} </h2>

                    <div class="p-4 border rounded-lg border-primary space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <ExternalLink class="!w-6 !h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-primary text-xl">
                                        {{ $t('settings.about.privacy') }}
                                    </h3>
                                </div>
                            </div>
                            <button @click="handleSettingClick('privacy')" class="text-primary">
                                <ChevronRight class="!w-6 !h-6" />
                            </button>
                        </div>

                        <div class="border-b border-primary my-3"></div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-10 h-10  flex items-center justify-center">
                                    <Bug class="!w-6 !h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-primary text-xl">
                                        {{ $t('settings.about.feedback') }}
                                    </h3>
                                </div>
                            </div>
                            <button @click="handleSettingClick('feedback')" class="text-primary">
                                <ChevronRight class="!w-6 !h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-auto mb-8 mx-3">
            <TouchAnimation>
                <Button @click="handleLogout" class="w-full h-12 text-xl font-bold !shadow-none">
                    {{ $t('settings.logout') }}
                </Button>
            </TouchAnimation>
        </div>
    </div>
</template>