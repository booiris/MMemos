import { invoke } from '@tauri-apps/api/core'
import { ref } from 'vue'
import type {
    LinkInfo,
    PasteHandlerOptions,
    PasteHandlerReturn,
} from '@/types/paste'

export type { LinkInfo }

export const detectUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s<>"'`]+/gi
    return text.match(urlRegex) || []
}

/**
 * Format link information to markdown
 */
export const formatLinkInfo = (linkInfo: LinkInfo): string => {
    return `[${linkInfo.title || linkInfo.url}](${linkInfo.url})`
}

export const fetchLinkInfo = async (url: string): Promise<LinkInfo> => {
    try {
        return await invoke<LinkInfo>('fetch_link_info', { url })
    } catch (error) {
        console.warn(`Failed to fetch link info for ${url}: ` + error)
        throw error
    }
}

/**
 * Process text with links, showing loading state and replacing with formatted links
 */
export const processTextWithLinks = async (
    text: string,
    t: (key: string) => string,
    onTextUpdate: (updatedText: string) => void
): Promise<string> => {
    const urls = detectUrls(text)
    if (urls.length === 0) {
        return text
    }

    let processedText = text

    // First, replace all URLs with loading state
    for (const url of urls) {
        const loadingText = `[${t('main.editPage.processingLink')}](${url})`
        processedText = processedText.replace(url, loadingText)
    }

    // Update text immediately to show loading state
    onTextUpdate(processedText)

    // Then process each URL
    for (const url of urls) {
        const loadingText = `[${t('main.editPage.processingLink')}](${url})`

        try {
            const linkInfo = await fetchLinkInfo(url)

            if (linkInfo.title) {
                const formattedLink = formatLinkInfo(linkInfo)
                processedText = processedText.replace(
                    loadingText,
                    formattedLink
                )
            } else {
                // If no title found, keep original URL
                processedText = processedText.replace(
                    loadingText,
                    `[${url}](${url})`
                )
            }
        } catch (error) {
            console.warn(`Failed to process link ${url}:`, error)
            // Replace loading with failed state
            const failedText = `[${url}](${url})`
            processedText = processedText.replace(loadingText, failedText)
        }

        // Update text after each URL processing
        onTextUpdate(processedText)
    }

    return processedText
}

/**
 * Create paste handler with link processing
 */
export const usePasteHandler = (
    options: PasteHandlerOptions
): PasteHandlerReturn => {
    const {
        textContent,
        textareaRef,
        onTextChange,
        isDisabled = () => false,
        onProcessingChange,
        t,
        isAutoTitleEnabled = () => true,
    } = options

    const isProcessing = ref(false)

    /**
     * Handle clipboard paste event
     */
    const handlePaste = async (event: ClipboardEvent) => {
        // Check if processing should be disabled
        if (isProcessing.value || isDisabled() || !isAutoTitleEnabled()) {
            return
        }

        const clipboardData = event.clipboardData
        if (!clipboardData) return

        const pastedText = clipboardData.getData('text')
        if (!pastedText) return

        const urls = detectUrls(pastedText)
        if (urls.length === 0) return

        // Prevent default paste behavior for link processing
        event.preventDefault()

        isProcessing.value = true
        onProcessingChange?.(true)

        try {
            const textarea = textareaRef.value
            if (textarea) {
                const startPos = textarea.selectionStart
                const endPos = textarea.selectionEnd
                const beforeText = textContent.value.substring(0, startPos)
                const afterText = textContent.value.substring(endPos)

                // Create text update function
                const updateText = (updatedContent: string) => {
                    const newText = beforeText + updatedContent + afterText
                    textContent.value = newText
                    onTextChange(newText)
                }

                // Process text with links and real-time updates
                await processTextWithLinks(pastedText, t, updateText)

                // Set cursor position to end of pasted content
                const finalText = textContent.value
                const newCursorPos =
                    startPos +
                    (finalText.length - beforeText.length - afterText.length)
                setTimeout(() => {
                    textarea.setSelectionRange(newCursorPos, newCursorPos)
                }, 0)
            }
        } catch (error) {
            console.error('Error processing paste with links: ' + error)

            // Fallback to normal paste if processing fails
            const textarea = textareaRef.value
            if (textarea) {
                const startPos = textarea.selectionStart
                const endPos = textarea.selectionEnd
                const beforeText = textContent.value.substring(0, startPos)
                const afterText = textContent.value.substring(endPos)
                const newText = beforeText + pastedText + afterText
                textContent.value = newText
                onTextChange(newText)
            }
        } finally {
            isProcessing.value = false
            onProcessingChange?.(false)
        }
    }

    return {
        handlePaste,
        isProcessing,
    }
}
