<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useEditModal } from '@/composables/useEditModal'
import EditView from '@/views/EditView.vue'
import { V1Resource, V1Visibility } from '@/api/schema/api'
import { createMemo, Memo, updateMemo } from '@/api/memos'
import { getError } from '@/api/error'

interface Emits {
    success: []
}

const emit = defineEmits<Emits>()

const { editModalState, closeEdit, setSaveCallback } = useEditModal()
const isLoading = ref<boolean>(false)
const currentEditText = ref<string>('')
const currentEditVisibility = ref<V1Visibility>(V1Visibility.PRIVATE)

const handleCloseEdit = (text: string, visibility: V1Visibility) => {
    closeEdit()
    if (!editModalState.value.isEditMode && text) {
        localStorage.setItem('lastEditText', text)
    }
    if (!editModalState.value.isEditMode && visibility) {
        localStorage.setItem('lastEditVisibility', visibility)
    }
}

const handleSendMemo = async (
    text: string,
    visibility: V1Visibility,
    resource: V1Resource[],
    memo?: Memo | null
) => {
    if (!text) {
        console.error('[handleSendMemo] memo content is empty!')
        return
    }

    isLoading.value = true

    try {
        if (editModalState.value.isEditMode && memo?.name) {
            await updateMemo(memo.name, {
                content: text,
                visibility: visibility,
                resources: resource,
            })
        } else {
            await createMemo(text, visibility, resource)
        }

        console.info('memo operation success')
        closeEdit()

        if (!editModalState.value.isEditMode) {
            localStorage.removeItem('lastEditText')
        } else {
            localStorage.removeItem('lastEditVisibility')
        }

        emit('success')
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
    return () => {
        if (!editModalState.value.isEditMode && currentEditText.value) {
            localStorage.setItem('lastEditText', currentEditText.value)
        }
        if (!editModalState.value.isEditMode && currentEditVisibility.value) {
            localStorage.setItem(
                'lastEditVisibility',
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
            const savedVisibility = localStorage.getItem('lastEditVisibility')
            if (savedVisibility) {
                currentEditVisibility.value = savedVisibility as V1Visibility
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
