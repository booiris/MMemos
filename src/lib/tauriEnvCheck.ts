export default function isTauriEnvironment(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return !!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__;
}