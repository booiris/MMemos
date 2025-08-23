import { useDataCacheStore } from '@/stores/dataCache'
import client from './client'
import { getError } from './error'
import {
    Apiv1Memo,
    V1ListMemosResponse,
    V1MemoRelation,
    V1Reaction,
    V1Resource,
    V1State,
    V1Visibility,
} from './schema/api'

export enum MemosState {
    NORMAL = 'NORMAL',
    ARCHIVED = 'ARCHIVED',
}

export type Memo = {
    name?: string
    createTime: string
    updateTime: string
    displayTime: string
    visibility: string
    content: string
    pinned: boolean
    resources: V1Resource[]
    relations: V1MemoRelation[]
    reactions: V1Reaction[]
    tags: string[]
    state: V1State
}

export function memoToMemo(memo: Apiv1Memo): Memo {
    return {
        name: memo.name,
        createTime: memo.createTime || '',
        updateTime: memo.updateTime || '',
        displayTime: memo.displayTime || '',
        visibility: memo.visibility || 'PRIVATE',
        content: memo.content || '',
        pinned: memo.pinned || false,
        resources: memo.resources || [],
        relations: memo.relations || [],
        reactions: memo.reactions || [],
        tags: memo.tags || [],
        state: memo.state || V1State.NORMAL,
    }
}

// TODO: Add token expiration handling
export async function getMemos(
    pageSize?: number,
    pageToken?: string,
    state?: MemosState,
    filter?: string
): Promise<V1ListMemosResponse> {
    try {
        const params: any = {
            pageSize: pageSize || 15,
            pageToken: pageToken || '',
            state: state || MemosState.NORMAL,
        }

        if (filter) {
            params.filter = filter
        }

        const response = await client.api.memoServiceListMemos(params, {
            secure: true,
            signal: AbortSignal.timeout(10000),
        })
        const dataCache = useDataCacheStore()
        for (const memo of response.memos || []) {
            dataCache.setMemoCache(memo.name!, memoToMemo(memo))
        }
        return response
    } catch (error) {
        throw `[getMemos] ${getError(error)}`
    }
}

export async function getMemosByTag(
    tag: string,
    pageSize?: number,
    pageToken?: string,
    state?: MemosState
): Promise<V1ListMemosResponse> {
    try {
        return await getMemos(pageSize, pageToken, state, `tag in ["${tag}"]`)
    } catch (error) {
        throw `[getMemosByTag] ${getError(error)}`
    }
}

export async function getArchivedMemos(
    pageSize?: number,
    pageToken?: string
): Promise<V1ListMemosResponse> {
    return await getMemos(pageSize, pageToken, MemosState.ARCHIVED)
}

export async function createMemo(
    content: string,
    visibility: V1Visibility,
    resource?: V1Resource[]
): Promise<Apiv1Memo> {
    try {
        const memo: Apiv1Memo = {
            content: content,
            visibility: visibility,
            resources: resource,
        }
        const response = await client.api.memoServiceCreateMemo(memo, {
            secure: true,
            signal: AbortSignal.timeout(10000),
        })
        const dataCache = useDataCacheStore()
        dataCache.setMemoCache(response.name!, memoToMemo(response))
        return response
    } catch (error) {
        throw `[createMemo] ${getError(error)}`
    }
}

export async function updateMemo(
    name: string,
    updates: Partial<Apiv1Memo>
): Promise<Apiv1Memo> {
    try {
        const response = await client.api.memoServiceUpdateMemo(name, updates, {
            secure: true,
            signal: AbortSignal.timeout(10000),
        })
        const dataCache = useDataCacheStore()
        dataCache.setMemoCache(name, memoToMemo(response))
        return response
    } catch (error) {
        throw `[updateMemo] ${getError(error)}`
    }
}

export async function deleteMemo(name: string): Promise<void> {
    try {
        await client.api.memoServiceDeleteMemo(name, {
            secure: true,
            signal: AbortSignal.timeout(10000),
        })
        const dataCache = useDataCacheStore()
        dataCache.deleteMemoCache(name)
    } catch (error) {
        throw `[deleteMemo] ${getError(error)}`
    }
}

export async function archiveMemo(name: string): Promise<Apiv1Memo> {
    return updateMemo(name, { state: V1State.ARCHIVED })
}

export async function restoreMemo(name: string): Promise<Apiv1Memo> {
    return updateMemo(name, { state: V1State.NORMAL })
}

export async function togglePinMemo(
    name: string,
    pinned: boolean
): Promise<Apiv1Memo> {
    return updateMemo(name, { pinned })
}

export async function searchMemos(query: string): Promise<Memo[]> {
    try {
        let searchResults: Memo[] = []
        let token = ''
        while (true) {
            const response = await getMemos(
                30,
                token,
                MemosState.NORMAL,
                `content.contains("${query}")`
            )

            searchResults.push(
                ...(response.memos?.map((memo) => memoToMemo(memo)) || [])
            )

            if (!response.nextPageToken) {
                break
            }
            token = response.nextPageToken || ''
        }

        return searchResults
    } catch (error) {
        throw `[searchMemos] ${getError(error)}`
    }
}

export interface PaginationState {
    pageToken: string
    hasMore: boolean
    isLoading: boolean
}

export async function getPinnedContent(): Promise<Memo[]> {
    try {
        let pinnedMemos: Memo[] = []
        let token = ''
        while (true) {
            const response = await getMemos(
                30,
                token,
                MemosState.NORMAL,
                `pinned`
            )

            pinnedMemos.push(
                ...(response.memos?.map((memo) => memoToMemo(memo)) || [])
            )

            if (!response.nextPageToken) {
                break
            }
            token = response.nextPageToken || ''
        }

        return pinnedMemos
    } catch (error) {
        throw `[getPinnedContent] ${getError(error)}`
    }
}
