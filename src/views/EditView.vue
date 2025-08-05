<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import {
    Loader2,
    View,
    SquareDashed,
    Lock,
    Shield,
    Globe,
    ChevronDown,
    X,
} from 'lucide-vue-next'
import { V1Resource, V1Visibility } from '@/api/schema/api'
import { Memo } from '@/api/memos'
import { Marked, Tokens } from 'marked'
import { getAuthToken, getHost } from '@/api/client'
import { api as viewerApi } from 'v-viewer'
import loading_image from '@/assets/loading_image.svg'

const { t } = useI18n()

const markdownRender = new Marked({
    breaks: true,
    pedantic: false,
    gfm: true,
    renderer: {
        link(token: Tokens.Link) {
            return `<a href="${
                token.href
            }" target="_blank" rel="noopener noreferrer"${
                token.title ? ` title="${token.title}"` : ''
            }>${token.text}</a>`
        },
    },
})

interface Props {
    initialText?: string
    initialVisibility?: V1Visibility
    isEditMode?: boolean
    memo?: Memo | null
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialText: '',
    initialVisibility: V1Visibility.PRIVATE,
    isEditMode: false,
    memo: null,
    isLoading: false,
})

interface Emits {
    close: [text: string, visibility: V1Visibility]
    send: [
        text: string,
        visibility: V1Visibility,
        resource: V1Resource[],
        memo?: Memo | null
    ]
    textChange: [text: string]
    visibilityChange: [visibility: V1Visibility]
}

const emit = defineEmits<Emits>()

const textContent = ref<string>('')
const textareaRef = ref<HTMLTextAreaElement>()
const isKeyboardVisible = ref<boolean>(false)
const isPreviewMode = ref<boolean>(false)
const isVisibilityDropdownOpen = ref<boolean>(false)
const selectedVisibility = ref<V1Visibility>(V1Visibility.PRIVATE)
const viewImageLoading = ref(false)

watchEffect(() => {
    textContent.value = props.initialText || ''
})

watchEffect(() => {
    selectedVisibility.value = props.initialVisibility
})

const isDisabled = computed(() => !textContent.value || props.isLoading)

const currentVisibility = computed(() => {
    const visibility = selectedVisibility.value
    return visibility === V1Visibility.VISIBILITY_UNSPECIFIED
        ? V1Visibility.PRIVATE
        : visibility
})

const visibilityConfig = computed(() => {
    const config: Record<
        V1Visibility,
        { icon: any; label: string; color: string; bgColor: string }
    > = {
        [V1Visibility.PRIVATE]: {
            icon: Lock,
            label: t('main.editPage.visibility.private'),
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        [V1Visibility.PROTECTED]: {
            icon: Shield,
            label: t('main.editPage.visibility.protected'),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        [V1Visibility.PUBLIC]: {
            icon: Globe,
            label: t('main.editPage.visibility.public'),
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        [V1Visibility.VISIBILITY_UNSPECIFIED]: {
            icon: Lock,
            label: t('main.editPage.visibility.private'),
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
    }
    return (
        config[currentVisibility.value as V1Visibility] ||
        config[V1Visibility.PRIVATE]
    )
})

const debouncedTextChange = useDebounceFn((text: string) => {
    emit('textChange', text)
}, 300)

const debouncedVisibilityChange = useDebounceFn((visibility: V1Visibility) => {
    emit('visibilityChange', visibility)
}, 300)

const handleSend = () => {
    if (props.isLoading) return

    emit(
        'send',
        textContent.value,
        currentVisibility.value as V1Visibility,
        localResources.value,
        props.memo
    )
}

const handleSelectAll = () => {
    if (textareaRef.value) {
        textareaRef.value.focus()

        try {
            textareaRef.value.setSelectionRange(
                0,
                textareaRef.value.value.length
            )
        } catch {
            try {
                if (document.execCommand) {
                    document.execCommand('selectAll', false)
                }
            } catch {
                const start = 0
                const end = textareaRef.value.value.length
                textareaRef.value.setSelectionRange(start, end)
            }
        }
    }
}

const handleKeyboardShow = () => {
    isKeyboardVisible.value = true
}

const handleKeyboardHide = () => {
    isKeyboardVisible.value = false
}

const handlePreview = () => {
    isPreviewMode.value = !isPreviewMode.value
    if (isPreviewMode.value && textareaRef.value) {
        textareaRef.value.blur()
    }
}

const toggleVisibilityDropdown = () => {
    isVisibilityDropdownOpen.value = !isVisibilityDropdownOpen.value
}

const selectVisibility = (visibility: V1Visibility) => {
    isVisibilityDropdownOpen.value = false
    selectedVisibility.value = visibility
    debouncedVisibilityChange(visibility)
}

const handleClose = () => {
    emit('close', textContent.value, currentVisibility.value as V1Visibility)
}

const getImageResources = (resources: V1Resource[]): V1Resource[] => {
    return resources.filter(
        (resource) =>
            resource.type?.startsWith('image/') ||
            (resource.filename &&
                /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(resource.filename))
    )
}

const getImageUrl = (
    resource: V1Resource,
    isNeedThumbnail: boolean
): string => {
    if (resource.externalLink) {
        return resource.externalLink
    }

    if (resource.name) {
        return `${getHost()}/file/${resource.name}/${resource.filename}${
            isNeedThumbnail ? '?thumbnail=true' : ''
        }`
    }

    return ''
}

const showImageViewer = async (resource: V1Resource) => {
    if (viewImageLoading.value) {
        return
    }
    viewImageLoading.value = true
    const url = getImageUrl(resource, false)
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    })
    const blob = await response.blob()
    const base64 = URL.createObjectURL(blob)
    await new Promise((resolve) => setTimeout(resolve, 200))
    viewImageLoading.value = false
    viewerApi({
        options: {
            button: false,
            keyboard: false,
            toolbar: false,
            title: false,
            navbar: false,
        },
        images: [base64],
    })
}

const localResources = ref<V1Resource[]>([])

watchEffect(() => {
    if (props.memo?.resources) {
        localResources.value = [...props.memo.resources]
    }
})

const deleteImageResource = (resourceToDelete: V1Resource) => {
    localResources.value = localResources.value.filter(
        (resource) => resource.name !== resourceToDelete.name
    )
}
</script>

<template>
    <div class="flex flex-col h-screen bg-background">
        <div
            class="flex items-center justify-between pl-6 pr-5 -mb-1"
            style="height: calc(env(safe-area-inset-top))">
            <button @click="handleClose" class="text-lg font-medium pt-0.5">
                {{ t('main.editPage.close') }}
            </button>

            <div class="flex items-center gap-3">
                <Button
                    @click="handlePreview"
                    :disabled="
                        props.isLoading || isKeyboardVisible || !textContent
                    "
                    variant="outline"
                    :class="[
                        'text-sm h-8 font-medium border-primary disabled:opacity-40 disabled:cursor-not-allowed',
                        isPreviewMode ? 'bg-primary/10' : '',
                    ]">
                    <View class="!h-5 !w-5" />
                </Button>

                <Button
                    @click="handleSelectAll"
                    :disabled="props.isLoading || isPreviewMode || !textContent"
                    variant="outline"
                    class="text-sm h-8 font-medium border-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    <SquareDashed class="!h-5 !w-5" />
                </Button>

                <Button
                    @click="handleSend"
                    :disabled="isDisabled"
                    class="text-sm h-8 font-medium flex items-center">
                    <Loader2
                        v-if="props.isLoading"
                        class="h-4 w-4 animate-spin" />
                    <span v-if="!props.isLoading" v-memo="[props.isEditMode]">
                        {{
                            props.isEditMode
                                ? t('main.editPage.update')
                                : t('main.editPage.send')
                        }}
                    </span>
                </Button>
            </div>
        </div>

        <div class="pl-4.5 pt-0 py-2 relative">
            <div class="flex items-center gap-2">
                <button
                    @click="toggleVisibilityDropdown"
                    :class="[
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80',
                        visibilityConfig.color,
                        visibilityConfig.bgColor,
                    ]">
                    <component
                        :is="visibilityConfig.icon"
                        class="h-3.5 w-3.5" />
                    <span>{{ visibilityConfig.label }}</span>
                    <ChevronDown
                        :class="[
                            'h-3.5 w-3.5 transition-transform duration-200 -ml-1',
                            isVisibilityDropdownOpen ? 'rotate-180' : '',
                        ]" />
                </button>
            </div>

            <div
                v-if="isVisibilityDropdownOpen"
                class="absolute top-full left-3 mt-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-36">
                <button
                    v-for="visibility in Object.values(V1Visibility).filter(
                        (v) => v !== V1Visibility.VISIBILITY_UNSPECIFIED
                    )"
                    :key="visibility"
                    @click="selectVisibility(visibility)"
                    :class="[
                        'w-full px-3 py-2 text-left text-sm  flex items-center gap-2 transition-colors',
                        currentVisibility === visibility
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700',
                    ]">
                    <Lock
                        v-if="visibility === V1Visibility.PRIVATE"
                        class="h-4 w-4" />
                    <Shield
                        v-else-if="visibility === V1Visibility.PROTECTED"
                        class="h-4 w-4" />
                    <Globe
                        v-else-if="visibility === V1Visibility.PUBLIC"
                        class="h-4 w-4" />
                    <span>{{
                        visibility === V1Visibility.PRIVATE
                            ? t('main.editPage.visibility.private')
                            : visibility === V1Visibility.PROTECTED
                            ? t('main.editPage.visibility.protected')
                            : t('main.editPage.visibility.public')
                    }}</span>
                </button>
            </div>

            <div
                v-if="isVisibilityDropdownOpen"
                @click="isVisibilityDropdownOpen = false"
                class="fixed inset-0 z-40"></div>
        </div>

        <div class="flex-1 overflow-hidden w-full overflow-y-auto">
            <textarea
                v-if="!isPreviewMode"
                ref="textareaRef"
                v-model="textContent"
                :disabled="props.isLoading"
                :placeholder="t('main.editPage.placeholder')"
                class="w-full h-full text-lg leading-relaxed text-primary placeholder-gray-400 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                style="
                    padding-bottom: calc(
                        env(safe-area-inset-bottom) + env(safe-area-inset-top) +
                            7rem
                    );
                "
                @input="debouncedTextChange(textContent)"
                @focus="handleKeyboardShow"
                @blur="handleKeyboardHide">
            </textarea>

            <div
                v-else
                class="w-full h-full px-6 pt-4 overflow-y-auto"
                style="
                    padding-bottom: calc(
                        env(safe-area-inset-bottom) + env(safe-area-inset-top) +
                            7rem
                    );
                ">
                <article
                    v-if="textContent.trim()"
                    v-html="markdownRender.parse(textContent)"
                    class="whitespace-pre-wrap break-words prose prose-lg prose-zinc"
                    style="line-height: 1 !important"></article>
                <div v-else class="text-gray-400 text-lg leading-relaxed">
                    {{ t('main.editPage.placeholder') }}
                </div>
            </div>
        </div>

        <div
            v-if="
                getImageResources(localResources).length > 0 &&
                !isKeyboardVisible
            "
            class="fixed left-0 right-0 z-40"
            style="
                height: calc(
                    env(safe-area-inset-bottom) + env(safe-area-inset-top) +
                        2.5rem
                );
                bottom: 0;
            ">
            <div class="flex overflow-x-auto gap-2 px-6">
                <div
                    v-for="(resource, index) in getImageResources(
                        localResources
                    )"
                    :key="resource.name || index"
                    class="flex-shrink-0 relative group">
                    <img
                        v-auth-image="getImageUrl(resource, true)"
                        class="rounded-lg h-24 object-cover transition-opacity cursor-pointer"
                        loading="lazy"
                        @click="showImageViewer(resource)" />

                    <button
                        @click.stop="deleteImageResource(resource)"
                        class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200">
                        <X class="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="viewImageLoading"
            class="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-background/70 z-50">
            <img :src="loading_image" alt="loading" class="w-12 h-12" />
        </div>
    </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
    display: block !important;
}
</style>

<style>
.viewer-container {
    background-color: rgba(0, 0, 0, 0.55) !important;
}
</style>
