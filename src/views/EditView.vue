<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { V1Resource, V1Visibility } from '@/api/schema/api'

const { t } = useI18n()

interface Props {
    initialText?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialText: '',
})

interface Emits {
    close: [text: string]
    send: [text: string, visibility: V1Visibility, resource: V1Resource[]]
    textChange: [text: string]
}

const emit = defineEmits<Emits>()

const textContent = ref<string>('')

onMounted(() => {
    textContent.value = props.initialText
})

watch(
    () => props.initialText,
    (newText) => {
        textContent.value = newText
    }
)
</script>

<template>
    <div class="flex flex-col h-screen bg-background">
        <div
            class="flex items-center justify-between border-b border-primary/20 shadow-xs pl-6 pr-5 pb-2"
            style="height: calc(env(safe-area-inset-top) + -10px)">
            <button
                @click="emit('close', textContent)"
                class="text-lg font-medium pt-0.5">
                {{ t('main.editPage.close') }}
            </button>

            <Button
                @click="emit('send', textContent, V1Visibility.PRIVATE, [])"
                :disabled="!textContent"
                class="text-sm h-8 font-medium">
                {{ t('main.editPage.send') }}
            </Button>
        </div>

        <div class="flex-1 overflow-hidden w-full overflow-y-auto">
            <textarea
                v-model="textContent"
                :placeholder="t('main.editPage.placeholder')"
                class="w-full h-full text-lg leading-relaxed text-primary placeholder-gray-400 px-6 pt-4"
                style="
                    padding-bottom: calc(
                        env(safe-area-inset-bottom) + env(safe-area-inset-top) +
                            7rem
                    );
                "
                @input="emit('textChange', textContent)">
            </textarea>
        </div>
    </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
    display: block !important;
}
</style>
