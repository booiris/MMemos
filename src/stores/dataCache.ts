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
import { Memo } from '@/api/memos'

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
        maxSize: 100 * 1024 * 1024,
        sizeCalculation: (value: Uint8Array) => value.byteLength,
    })

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

    const setImageCache = async (imageUrl: string, data: Uint8Array) => {
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return
        }

        await createCacheDirectory()

        console.log('set image cache, url: ' + cacheFileUrl(imageUrl))
        imageCache.set(cacheFileUrl(imageUrl), new Uint8Array(data))
        await writeFile(cacheFileUrl(imageUrl), data, {
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

        if (imageCache.has(cacheFileUrl(imageUrl))) {
            console.log(
                'get image cache from cache, url: ' + cacheFileUrl(imageUrl)
            )
            return imageCache.get(cacheFileUrl(imageUrl))!
        }
        if (
            !(await exists(cacheFileUrl(imageUrl), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            console.log('no image cache, url: ' + cacheFileUrl(imageUrl))
            return null
        }
        console.log('get image cache from file, url: ' + cacheFileUrl(imageUrl))
        const imageData = await readFile(cacheFileUrl(imageUrl), {
            baseDir: BaseDirectory.AppCache,
        })
        imageCache.set(cacheFileUrl(imageUrl), imageData)
        return imageData
    }

    const cacheFileUrl = (imageResource: string) => {
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

    const memoCache = new LRUCache<string, Memo>({
        max: 400,
        maxSize: 100 * 1024 * 1024,
    })

    const getMemoCache = async (memoName: string): Promise<Memo | null> => {
        if (!authStore.serverUrl) {
            return null
        }

        await createCacheDirectory()

        if (imageCache.has(cacheFileUrl(memoName))) {
            console.log(
                'get memo cache from cache, url: ' + cacheFileUrl(memoName)
            )
            return memoCache.get(cacheFileUrl(memoName))!
        }
        if (
            !(await exists(cacheFileUrl(memoName), {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            return null
        }
        return JSON.parse(
            await readTextFile(cacheFileUrl(memoName), {
                baseDir: BaseDirectory.AppCache,
            })
        ) as Memo
    }

    const setMemoCache = async (memoName: string, memo: Memo) => {
        if (!authStore.serverUrl) {
            return
        }

        await createCacheDirectory()

        console.log('set memo cache, name: ' + cacheFileUrl(memoName))
        memoCache.set(cacheFileUrl(memoName), memo)
        await writeTextFile(cacheFileUrl(memoName), JSON.stringify(memo), {
            baseDir: BaseDirectory.AppCache,
        }).catch((e) => {
            console.error(e)
        })
    }

    return {
        // Actions
        setImageCache,
        getImageCache,
        cleanImageCache,
        getHomeDataCache,
        setHomeDataCache,
        getMemoCache,
        setMemoCache,
    }
})
