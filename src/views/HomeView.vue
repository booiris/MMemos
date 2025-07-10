<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import TouchAnimation from '@/components/ui/touch-animation/index.vue'

const router = useRouter()

const handleBack = () => {
    router.push({ name: 'Main' })
}
</script>

<template>
    <div class="flex flex-col px-6">
        <div class="flex justify-between items-center sticky top-0 z-10 mb-2.5">
            <TouchAnimation :scale="0.8">
                <Button variant="ghost" size="icon" @click="handleBack">
                    <ArrowLeft class="!h-7 !w-7 text-primary" />
                </Button>
            </TouchAnimation>

            <div class="text-4xl text-primary font-style -mt-1">Home</div>
        </div>

        <div
            class="flex-1 overflow-y-auto"
            style="margin-bottom: calc(env(safe-area-inset-bottom) + 0.5rem)">
            <div class="space-y-6">
                <div class="px-5 pt-3 pb-1 rounded-lg border-1 border-primary">
                    <h2 class="text-2xl font-bold text-primary mb-4">
                        Welcome to Memos
                    </h2>
                    <p class="text-gray-600 leading-relaxed">
                        This is your home page. Here you can find quick access
                        to your most important features and recent activities.
                    </p>
                </div>

                <div class="px-5 pt-3 pb-1 rounded-lg border-1 border-primary">
                    <h3 class="text-xl font-semibold text-primary mb-3">
                        Quick Actions
                    </h3>
                    <div class="space-y-3">
                        <div
                            class="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div class="font-medium text-primary">
                                Create New Memo
                            </div>
                            <div class="text-sm text-gray-500">
                                Start writing a new memo
                            </div>
                        </div>
                        <div
                            class="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div class="font-medium text-primary">
                                View All Memos
                            </div>
                            <div class="text-sm text-gray-500">
                                Browse your memo collection
                            </div>
                        </div>
                        <div
                            class="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div class="font-medium text-primary">Settings</div>
                            <div class="text-sm text-gray-500">
                                Configure your preferences
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style="
                        margin-bottom: calc(env(safe-area-inset-bottom) + 2rem);
                    "></div>
            </div>
        </div>
    </div>
</template>
