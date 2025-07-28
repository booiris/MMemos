import { ref } from 'vue'
import { Memo } from '@/api/memos'

interface EditModalState {
    isVisible: boolean
    isEditMode: boolean
    initialText: string
    memo: Memo | null
}

const editModalState = ref<EditModalState>({
    isVisible: false,
    isEditMode: false,
    initialText: '',
    memo: null,
})

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

    return {
        editModalState: editModalState,
        openEdit,
        closeEdit,
        openNewMemo,
        openEditMemo,
    }
}
