import { ref } from 'vue'
import { Memo } from '@/api/memos'

interface EditModalState {
    isVisible: boolean
    isEditMode: boolean
    initialText: string
    memo: Memo | null
    key: string
}

const editModalState = ref<EditModalState>({
    isVisible: false,
    isEditMode: false,
    initialText: '',
    memo: null,
    key: '',
})

let saveAndCloseCallback: (() => void) | null = null

export const useEditModal = () => {
    const openEdit = (options: {
        isEditMode: boolean
        initialText: string
        memo?: Memo | null
    }) => {
        editModalState.value = {
            isVisible: true,
            isEditMode: options.isEditMode,
            initialText: options.initialText,
            memo: options.memo || null,
            key: `edit-${Date.now()}-${Math.random().toString(36)}`,
        }
    }

    const closeEdit = () => {
        editModalState.value.isVisible = false
    }

    const openNewMemo = (initialText = '') => {
        openEdit({
            isEditMode: false,
            initialText,
            memo: null,
        })
    }

    const openEditMemo = (memo: Memo) => {
        openEdit({
            isEditMode: true,
            initialText: memo.content,
            memo,
        })
    }

    const saveAndCloseEdit = () => {
        if (saveAndCloseCallback) {
            saveAndCloseCallback()
        }
        closeEdit()
    }

    const setSaveCallback = (callback: (() => void) | null) => {
        saveAndCloseCallback = callback
    }

    return {
        editModalState: editModalState,
        openEdit,
        closeEdit,
        openNewMemo,
        openEditMemo,
        saveAndCloseEdit,
        setSaveCallback,
    }
}
