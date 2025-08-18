export const sanitizeFileName = (fileName: string): string => {
    return fileName
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\.\./g, '_')
        .replace(/^\.+/, '')
        .replace(/\.+$/, '')
        .replace(/\s+/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 255)
}
