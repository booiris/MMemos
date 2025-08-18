import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TauriStore } from '@/utils/tauriStore'

export interface EditDraft {
    text: string
    visibility: string
    timestamp: number
}

export const useDraftStore = defineStore('draft', () => {
    // State
    const lastEditText = ref<string>('')
    const lastEditVisibility = ref<string>('PRIVATE')

    // Actions
    const initDraft = async () => {
        try {
            const [savedText, savedVisibility] = await Promise.all([
                TauriStore.getItem('lastEditText'),
                TauriStore.getItem('lastEditVisibility'),
            ])

            if (savedText) {
                lastEditText.value = savedText
            }

            if (savedVisibility) {
                lastEditVisibility.value = savedVisibility
            }
        } catch (error) {
            console.error('Failed to initialize draft:', error)
        }
    }

    const saveDraftText = async (text: string) => {
        lastEditText.value = text
        try {
            await TauriStore.setItem('lastEditText', text)
        } catch (error) {
            console.error('Failed to save draft text:', error)
        }
    }

    const saveDraftVisibility = async (visibility: string) => {
        lastEditVisibility.value = visibility
        try {
            await TauriStore.setItem('lastEditVisibility', visibility)
        } catch (error) {
            console.error('Failed to save draft visibility:', error)
        }
    }

    const saveDraft = async (text: string, visibility: string) => {
        await Promise.all([
            saveDraftText(text),
            saveDraftVisibility(visibility),
        ])
    }

    const clearDraft = async () => {
        lastEditText.value = ''
        lastEditVisibility.value = 'PRIVATE'

        try {
            await Promise.all([
                TauriStore.remove(['lastEditText', 'lastEditVisibility']),
            ])
        } catch (error) {
            console.error('Failed to clear draft:', error)
        }
    }

    const getDraft = (): EditDraft => {
        return {
            text: lastEditText.value,
            visibility: lastEditVisibility.value,
            timestamp: Date.now(),
        }
    }

    const hasDraft = (): boolean => {
        return lastEditText.value.trim().length > 0
    }

    // Initialize draft (async)
    initDraft().catch((error) => {
        console.error('Initial draft load failed:', error)
    })

    return {
        // State
        lastEditText,
        lastEditVisibility,

        // Actions
        initDraft,
        saveDraftText,
        saveDraftVisibility,
        saveDraft,
        clearDraft,
        getDraft,
        hasDraft,
    }
})
