import { invoke } from '@tauri-apps/api/core'

export type TauriStoreKey =
    | 'isAuthenticated'
    | 'user'
    | 'serverUrl'
    | 'accessToken'
    | 'locale'
    | 'darkMode'
    | 'lastEditText'
    | 'lastEditVisibility'
    | 'enableAutoTitle'
    | 'enableAutoRefresh'
    | 'enableRandomHistory'

type NotString<T> = T extends string ? never : T

/**
 * Tauri storage utility functions
 */
export class TauriStore {
    /**
     * Store data
     * @param key Storage key
     * @param data Storage value
     */
    static async setItem(key: TauriStoreKey, data: string): Promise<void> {
        try {
            await invoke('store_data', { key, data })
        } catch (error) {
            console.error('Failed to store data:', error)
            throw error
        }
    }

    /**
     * Get data
     * @param key Storage key
     * @returns Storage value or null
     */
    static async getItem(key: TauriStoreKey): Promise<string | null> {
        try {
            const result = await invoke<string | null>('get_data', { key })
            return result
        } catch (error) {
            console.error('Failed to get data:', error)
            return null
        }
    }

    /**
     * Remove data
     * @param key Storage key
     */
    static async remove(keys: TauriStoreKey[]): Promise<void> {
        try {
            await invoke('remove_data', { keys })
        } catch (error) {
            console.error('Failed to remove data:', error)
            throw error
        }
    }

    /**
     * Set JSON object (not allow string type)
     * @param key Storage key
     * @param value Object to store
     */
    static async set<T>(
        key: TauriStoreKey,
        value: NotString<T>
    ): Promise<void> {
        const jsonString = JSON.stringify(value)
        await this.setItem(key, jsonString)
    }

    /**
     * Get JSON object (not allow string type)
     * @param key Storage key
     * @returns Parsed object or null
     */
    static async get<T extends object | boolean | number>(
        key: TauriStoreKey
    ): Promise<NotString<T> | null> {
        const jsonString = await this.getItem(key)
        if (!jsonString) {
            return null as NotString<T> | null
        }

        try {
            return JSON.parse(jsonString) as NotString<T> | null
        } catch (error) {
            console.error('Failed to parse JSON:', error)
            return null as NotString<T> | null
        }
    }
}
