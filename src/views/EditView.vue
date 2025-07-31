<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { V1Resource, V1Visibility } from '@/api/schema/api'
import { Memo } from '@/api/memos'

const { t } = useI18n()

interface Props {
    initialText?: string
    isEditMode?: boolean
    memo?: Memo | null
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialText: '',
    isEditMode: false,
    memo: null,
    isLoading: false,
})

interface Emits {
    close: [text: string]
    send: [
        text: string,
        visibility: V1Visibility,
        resource: V1Resource[],
        memo?: Memo | null
    ]
    textChange: [text: string]
}

const emit = defineEmits<Emits>()

const textContent = ref<string>('')

watchEffect(() => {
    textContent.value = props.initialText || ''
})

const isDisabled = computed(() => !textContent.value || props.isLoading)

const debouncedTextChange = useDebounceFn((text: string) => {
    emit('textChange', text)
}, 300)

const handleSend = () => {
    if (props.isLoading) return

    emit('send', textContent.value, V1Visibility.PRIVATE, [], props.memo)
}
</script>

<template>
    <div class="flex flex-col h-screen bg-background">
        <div
            class="flex items-center justify-between border-b border-primary/15 pl-6 pr-5 pb-2"
            style="height: calc(env(safe-area-inset-top) + -10px)">
            <button
                @click="emit('close', textContent)"
                class="text-lg font-medium pt-0.5">
                {{ t('main.editPage.close') }}
            </button>

            <Button
                @click="handleSend"
                :disabled="isDisabled"
                class="text-sm h-8 font-medium flex items-center">
                <Loader2 v-if="props.isLoading" class="h-4 w-4 animate-spin" />
                <span v-if="!props.isLoading" v-memo="[props.isEditMode]">
                    {{
                        props.isEditMode
                            ? t('main.editPage.update')
                            : t('main.editPage.send')
                    }}
                </span>
            </Button>
        </div>

        <div class="flex-1 overflow-hidden w-full overflow-y-auto">
            <textarea
                v-model="textContent"
                :disabled="props.isLoading"
                :placeholder="t('main.editPage.placeholder')"
                class="w-full h-full text-lg leading-relaxed text-primary placeholder-gray-400 px-6 pt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style="
                    padding-bottom: calc(
                        env(safe-area-inset-bottom) + env(safe-area-inset-top) +
                            7rem
                    );
                "
                @input="debouncedTextChange(textContent)">
            </textarea>
        </div>
    </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
    display: block !important;
}
</style>
