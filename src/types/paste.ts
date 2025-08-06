/**
 * Link information interface
 */
export interface LinkInfo {
    /** Web page title */
    title?: string
    /** Main content of the web page */
    content?: string
    /** Link URL */
    url: string
    /** Web page description (meta description) */
    description?: string
}

/**
 * Paste handler options
 */
export interface PasteHandlerOptions {
    /** Text content ref */
    textContent: {
        value: string
    }
    /** Textarea element ref */
    textareaRef: {
        value: HTMLTextAreaElement | undefined
    }
    /** Text change callback function */
    onTextChange: (text: string) => void
    /** Whether to disable processing */
    isDisabled?: () => boolean
    /** Processing state change callback */
    onProcessingChange?: (isProcessing: boolean) => void
    /** i18n translate function */
    t: (key: string) => string
    /** Whether auto title processing is enabled */
    isAutoTitleEnabled?: () => boolean
}

/**
 * Paste handler return value
 */
export interface PasteHandlerReturn {
    /** Paste event handler function */
    handlePaste: (event: ClipboardEvent) => Promise<void>
    /** Whether links are being processed */
    isProcessing: {
        readonly value: boolean
    }
}
