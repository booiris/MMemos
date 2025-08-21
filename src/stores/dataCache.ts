import {
    BaseDirectory,
    exists,
    mkdir,
    readFile,
    readTextFile,
    writeTextFile,
    writeFile,
} from '@tauri-apps/plugin-fs'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { LRUCache } from 'lru-cache'
import { sanitizeFileName } from '@/utils/fileUtils'

export interface HomeDataCache {
    tags: string[]
    memosCount: number
    tagsCount: number
    pinnedMemosCount: number
}

export const useDataCacheStore = defineStore('dataCache', () => {
    const authStore = useAuthStore()

    const imageCache = new LRUCache<string, Uint8Array>({
        max: 50,
        maxSize: 20 * 1024 * 1024,
        sizeCalculation: (value: Uint8Array) => value.byteLength,
    })

    const setImageCache = async (imageUrl: string, data: Uint8Array) => {
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return
        }

        await createCacheDirectory()

        console.log('set image cache, url: ' + imageCacheFileUrl(imageUrl))
        imageCache.set(imageCacheFileUrl(imageUrl), new Uint8Array(data))
        await writeFile(imageCacheFileUrl(imageUrl), data, {
            baseDir: BaseDirectory.AppCache,
        }).catch((e) => {
            console.error(e)
        })
    }

    const getImageCache = async (
        imageUrl: string
    ): Promise<Uint8Array | null> => {
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return null
        }

        await createCacheDirectory()

        if (imageCache.has(imageCacheFileUrl(imageUrl))) {
            console.log(
                'get image cache from cache, url: ' +
                    imageCacheFileUrl(imageUrl)
            )
            return imageCache.get(imageCacheFileUrl(imageUrl))!
        }
        if (
            !(await exists(imageCacheFileUrl(imageUrl), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            console.log('no image cache, url: ' + imageCacheFileUrl(imageUrl))
            return null
        }
        console.log(
            'get image cache from file, url: ' + imageCacheFileUrl(imageUrl)
        )
        const imageData = await readFile(imageCacheFileUrl(imageUrl), {
            baseDir: BaseDirectory.AppCache,
        })
        imageCache.set(imageCacheFileUrl(imageUrl), imageData)
        return imageData
    }

    const imageCacheFileUrl = (imageResource: string) => {
        const sanitizedResource = sanitizeFileName(imageResource)
        return authStore.getUniqueId() + '/' + sanitizedResource
    }

    const cleanImageCache = async () => {
        imageCache.clear()
    }

    const getHomeDataCache = async (): Promise<HomeDataCache | null> => {
        if (!authStore.serverUrl) {
            return null
        }

        await createCacheDirectory()

        if (
            !(await exists(authStore.getUniqueId() + '/homeDataCache.json', {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            return null
        }

        const cache = await readTextFile(
            authStore.getUniqueId() + '/homeDataCache.json',
            {
                baseDir: BaseDirectory.AppCache,
            }
        )
        return JSON.parse(cache) as HomeDataCache
    }

    const setHomeDataCache = async (data: HomeDataCache) => {
        if (!authStore.serverUrl) {
            return null
        }

        await createCacheDirectory()

        await writeTextFile(
            authStore.getUniqueId() + '/homeDataCache.json',
            JSON.stringify(data),
            {
                baseDir: BaseDirectory.AppCache,
            }
        )
    }

    const createCacheDirectory = async () => {
        if (
            authStore.serverUrl &&
            !(await exists(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            await mkdir(authStore.getUniqueId(), {
                baseDir: BaseDirectory.AppCache,
            })
        }
    }

    return {
        // Actions
        setImageCache,
        getImageCache,
        cleanImageCache,
        getHomeDataCache,
        setHomeDataCache,
    }
})
