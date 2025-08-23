<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useEditModal } from '@/composables/useEditModal'
import EditView from '@/views/EditView.vue'
import { V1Resource, V1Visibility } from '@/api/schema/api'
import { createMemo, Memo, updateMemo } from '@/api/memos'
import { getError } from '@/api/error'
import { useDraftStore } from '@/stores/draft'

interface Emits {
    success: [Memo, boolean]
}

const emit = defineEmits<Emits>()

const { editModalState, closeEdit, setSaveCallback } = useEditModal()
const draftStore = useDraftStore()
const isLoading = ref<boolean>(false)
const currentEditText = ref<string>('')
const currentEditVisibility = ref<V1Visibility>(V1Visibility.PRIVATE)

const handleCloseEdit = async (text: string, visibility: V1Visibility) => {
    closeEdit()
    if (!editModalState.value.isEditMode) {
        await draftStore.saveDraft(text, visibility)
    }
}

const handleSendMemo = async (
    text: string,
    visibility: V1Visibility,
    resource: V1Resource[],
    memo?: Memo | null
) => {
    isLoading.value = true

    try {
        if (editModalState.value.isEditMode && memo?.name) {
            memo = await updateMemo(memo.name, {
                content: text,
                visibility: visibility,
                resources: resource,
            })
        } else {
            memo = await createMemo(text, visibility, resource)
        }

        console.info('memo operation success')
        closeEdit()

        if (!editModalState.value.isEditMode) {
            await draftStore.clearDraft()
        }

        emit('success', memo, editModalState.value.isEditMode)
    } catch (error) {
        console.error('memo operation failed: ' + getError(error))
    } finally {
        isLoading.value = false
    }
}

const handleTextChange = (text: string) => {
    currentEditText.value = text
    console.log(text.length)
}

const handleVisibilityChange = (visibility: V1Visibility) => {
    currentEditVisibility.value = visibility
}

const createSaveCallback = () => {
    return async () => {
        if (!editModalState.value.isEditMode) {
            await draftStore.saveDraft(
                currentEditText.value,
                currentEditVisibility.value
            )
        }
    }
}

setSaveCallback(createSaveCallback())

watchEffect(() => {
    if (editModalState.value.isVisible) {
        currentEditText.value = editModalState.value.initialText
        if (editModalState.value.isEditMode) {
            currentEditVisibility.value =
                (editModalState.value.memo?.visibility as V1Visibility) ||
                V1Visibility.PRIVATE
        } else {
            if (draftStore.lastEditVisibility) {
                currentEditVisibility.value =
                    draftStore.lastEditVisibility as V1Visibility
            }
        }
    }
})
</script>

<template>
    <Transition
        enter-active-class="transition-transform duration-250 ease-out"
        enter-from-class="transform translate-y-full"
        enter-to-class="transform translate-y-0"
        leave-active-class="transition-transform duration-150 ease-in"
        leave-from-class="transform translate-y-0"
        leave-to-class="transform translate-y-full">
        <div
            v-if="editModalState.isVisible"
            class="fixed inset-0 z-50"
            style="top: calc(env(safe-area-inset-top) - 8px)">
            <EditView
                :key="editModalState.key"
                :initial-text="editModalState.initialText"
                :initial-visibility="currentEditVisibility"
                :is-edit-mode="editModalState.isEditMode"
                :memo="editModalState.memo"
                :is-loading="isLoading"
                @close="handleCloseEdit"
                @send="handleSendMemo"
                @text-change="handleTextChange"
                @visibility-change="handleVisibilityChange" />
        </div>
    </Transition>
</template>
