import {
    BaseDirectory,
    exists,
    mkdir,
    readFile,
    writeFile,
} from '@tauri-apps/plugin-fs'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { LRUCache } from 'lru-cache'
import { sanitizeFileName } from '@/utils/fileUtils'

export const useDataCacheStore = defineStore('dataCache', () => {
    const imageCache = new LRUCache<string, Uint8Array>({
        max: 50,
        maxSize: 20 * 1024 * 1024,
        sizeCalculation: (value: Uint8Array) => value.byteLength,
    })

    const setImageCache = async (imageUrl: string, data: Uint8Array) => {
        const authStore = useAuthStore()
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return
        }
        if (
            !(await exists(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            await mkdir(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            })
        }
        console.log('set image cache, url: ' + fileUrl(imageUrl))
        imageCache.set(fileUrl(imageUrl), new Uint8Array(data))
        await writeFile(fileUrl(imageUrl), data, {
            baseDir: BaseDirectory.AppCache,
        }).catch((e) => {
            console.error(e)
        })
    }

    const getImageCache = async (
        imageUrl: string
    ): Promise<Uint8Array | null> => {
        const authStore = useAuthStore()
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return null
        }
        if (
            !(await exists(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            await mkdir(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            })
        }

        if (imageCache.has(fileUrl(imageUrl))) {
            console.log('get image cache from cache, url: ' + fileUrl(imageUrl))
            return imageCache.get(fileUrl(imageUrl))!
        }
        if (
            !(await exists(fileUrl(imageUrl), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            console.log('no image cache, url: ' + fileUrl(imageUrl))
            return null
        }
        console.log('get image cache from file, url: ' + fileUrl(imageUrl))
        const imageData = await readFile(fileUrl(imageUrl), {
            baseDir: BaseDirectory.AppCache,
        })
        imageCache.set(fileUrl(imageUrl), imageData)
        return imageData
    }

    const fileUrl = (imageResource: string) => {
        const authStore = useAuthStore()
        const sanitizedResource = sanitizeFileName(imageResource)
        return authStore.getUniqueId() + '/' + sanitizedResource
    }

    const cleanImageCache = async () => {
        imageCache.clear()
    }

    return {
        // Actions
        setImageCache,
        getImageCache,
        cleanImageCache,
    }
})
