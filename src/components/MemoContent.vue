<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { markdownRenderer } from '@/utils/markdownUtils'
import { useI18n } from 'vue-i18n'

interface Props {
    content: string
    compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    compact: true,
})

// Maximum display height for compact mode
const MAX_DISPLAY_HEIGHT = 350

const { t } = useI18n()
const contentRef = ref<HTMLElement>()
const showCompactMode = ref<'ALL' | 'SNIPPET' | undefined>(undefined)

const renderedContent = computed(() => {
    return markdownRenderer.parse(props.content)
})

const checkIfNeedsCollapse = async () => {
    if (!props.compact || !props.content || !contentRef.value) {
        showCompactMode.value = undefined
        return
    }

    await nextTick()

    // Use getBoundingClientRect to get actual rendered height
    const rect = contentRef.value.getBoundingClientRect()
    if (rect.height > MAX_DISPLAY_HEIGHT) {
        showCompactMode.value = 'ALL'
    } else {
        showCompactMode.value = undefined
    }
}

const toggleCompactMode = () => {
    if (showCompactMode.value === 'ALL') {
        showCompactMode.value = 'SNIPPET'
    } else {
        showCompactMode.value = 'ALL'
    }
}

// Watch content changes and recheck if collapse is needed
watch(
    () => props.content,
    () => {
        checkIfNeedsCollapse()
    },
    { immediate: false }
)

onMounted(() => {
    checkIfNeedsCollapse()
})
</script>

<template>
    <div class="w-full flex flex-col justify-start items-start">
        <div class="relative w-full">
            <article
                ref="contentRef"
                v-html="renderedContent"
                class="relative w-full max-w-full break-words whitespace-pre-wrap prose prose-lg prose-zinc"
                style="line-height: 1 !important"
                :class="{
                    'line-clamp-7 max-h-64 overflow-hidden':
                        showCompactMode === 'ALL',
                }" />

            <!-- Fade mask for collapsed content -->
            <div
                v-if="showCompactMode === 'ALL'"
                class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

        <!-- Expand/Collapse button -->
        <div v-if="showCompactMode !== undefined" class="w-full mt-0 mb-3">
            <button
                @click="toggleCompactMode"
                class="w-auto flex flex-row justify-start items-center cursor-pointer text-base text-primary font-medium underline">
                {{
                    showCompactMode === 'ALL'
                        ? t('memo.expand')
                        : t('memo.collapse')
                }}
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-7 {
    display: -webkit-box;
    -webkit-line-clamp: 7;
    line-clamp: 7;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
