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
import { invoke } from '@tauri-apps/api/core'

export interface HomeDataCache {
    tags: Record<string, number>
    memosCount: number
    tagsCount: number
    pinnedMemosCount: number
}

export interface MemoDataCache {
    memos: Map<string, Memo>
    memosUpdated: Map<string, boolean>
    memoNameList: string[] | null
    memoNameListUpdated: boolean
}

export const useDataCacheStore = defineStore('dataCache', () => {
    const authStore = useAuthStore()

    const imageCache = new LRUCache<string, Uint8Array>({
        max: 50,
        maxSize: 100 * 1024 * 1024,
        sizeCalculation: (value: Uint8Array) => value.byteLength,
    })

    const createCacheDirectory = async (prePath?: string) => {
        const path = authStore.getUniqueId() + (prePath ? '/' + prePath : '')
        if (
            authStore.serverUrl &&
            !(await exists(path, {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            await mkdir(path, {
                baseDir: BaseDirectory.AppCache,
            })
        }
    }

    const setImageCache = async (imageUrl: string, data: Uint8Array) => {
        if (!authStore.serverUrl || !imageUrl.startsWith(authStore.serverUrl)) {
            return
        }

        await createCacheDirectory('image')

        const filePath = cacheFileUrl(imageUrl, 'image')

        console.log('set image cache, url: ' + filePath)
        imageCache.set(filePath, new Uint8Array(data))
        await writeFile(filePath, data, {
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

        const filePath = cacheFileUrl(imageUrl, 'image')

        if (imageCache.has(filePath)) {
            console.log('get image cache from cache, url: ' + filePath)
            return imageCache.get(filePath)!
        }
        await createCacheDirectory('image')
        if (
            !(await exists(filePath, {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            console.log('no image cache, url: ' + filePath)
            return null
        }
        console.log('get image cache from file, url: ' + filePath)
        const imageData = await readFile(filePath, {
            baseDir: BaseDirectory.AppCache,
        })
        imageCache.set(filePath, imageData)
        return imageData
    }

    const cacheFileUrl = (file: string, prePath?: string) => {
        const sanitizedResource = sanitizeFileName(file)
        return (
            authStore.getUniqueId() +
            '/' +
            (prePath ? prePath + '/' : '') +
            sanitizedResource
        )
    }

    const cleanCache = async () => {
        imageCache.clear()
        isHomeCacheUpdated = false
        homeDataCache = null
    }

    const getData = async <T>(
        filePath: string,
        prePath?: string
    ): Promise<T | null> => {
        const path = cacheFileUrl(filePath, prePath)
        await createCacheDirectory(prePath)
        if (
            !(await exists(path, {
                baseDir: BaseDirectory.AppCache,
            }))
        ) {
            return null
        }
        const cache = await readTextFile(path, {
            baseDir: BaseDirectory.AppCache,
        })
        return JSON.parse(cache) as T
    }

    let homeDataCache: HomeDataCache | null = null
    let isHomeCacheUpdated = false

    const getHomeDataCache = async (): Promise<HomeDataCache | null> => {
        if (!authStore.serverUrl) {
            return null
        }

        if (!homeDataCache) {
            homeDataCache = await getData<HomeDataCache>(
                'homeDataCache.json',
                'memos'
            )
        }

        return homeDataCache
    }

    const setHomeDataCache = async (data: HomeDataCache) => {
        if (!authStore.serverUrl) {
            return null
        }

        isHomeCacheUpdated = true
        homeDataCache = data
    }

    const getMemoCache = async (memoName: string): Promise<Memo | null> => {
        return invoke('get_memo', {
            memoName,
        })
    }

    const setMemoCache = async (memoName: string, memo: Memo) => {
        await invoke('store_memo', {
            memoName,
            memo,
        })
    }

    const deleteMemoCache = async (memoName: string) => {
        await invoke('delete_memo', {
            memoName,
        })
    }

    const persistDataCache = async () => {
        setInterval(async () => {
            if (isHomeCacheUpdated) {
                isHomeCacheUpdated = false
                if (homeDataCache) {
                    const path = cacheFileUrl('homeDataCache.json', 'memos')
                    await writeTextFile(path, JSON.stringify(homeDataCache), {
                        baseDir: BaseDirectory.AppCache,
                    })
                }
            }
        }, 5000)
    }

    const getMemoList = async (
        offset: number,
        limit: number,
        tag: string,
        pinned: boolean,
        archived: boolean
    ): Promise<Memo[] | null> => {
        return invoke('get_memo_list', {
            offset,
            limit,
            tag,
            pinned,
            archived,
        })
    }

    persistDataCache()

    return {
        // Actions
        setImageCache,
        getImageCache,
        cleanImageCache: cleanCache,
        getHomeDataCache,
        setHomeDataCache,
        getMemoCache,
        setMemoCache,
        getMemoList,
        deleteMemoCache,
    }
})
