import client from './client'
import { getError } from './error'
import {
    Apiv1Memo,
    V1ListMemosResponse,
    V1Resource,
    V1State,
    V1Visibility,
} from './schema/api'

export enum MemosState {
    NORMAL = 'NORMAL',
    ARCHIVED = 'ARCHIVED',
}

// TODO: 添加 token 失效处理
export async function getMemos(
    pageSize?: number,
    pageToken?: string,
    state?: MemosState
): Promise<V1ListMemosResponse> {
    try {
        const response = await client.api.memoServiceListMemos(
            {
                pageSize: pageSize || 15,
                pageToken: pageToken || '',
                state: state || MemosState.NORMAL,
            },
            { secure: true, signal: AbortSignal.timeout(10000) }
        )
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
        const response = await client.api.memoServiceListMemos(
            {
                pageSize: pageSize || 15,
                pageToken: pageToken || '',
                state: state || MemosState.NORMAL,
                filter: `tag in ["${tag}"]`,
            },
            { secure: true, signal: AbortSignal.timeout(10000) }
        )
        return response
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

export async function loadAllMemos(
    pageToken?: string,
    state?: MemosState
): Promise<Apiv1Memo[]> {
    let memos: Apiv1Memo[] = []
    try {
        while (true) {
            const response = await getMemos(15, pageToken, state)
            memos.push(...(response.memos || []))
            if (response.nextPageToken) {
                pageToken = response.nextPageToken
            } else {
                break
            }
        }
        return memos
    } catch (error) {
        throw `[loadAllMemos] ${getError(error)}`
    }
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

export async function searchMemos(
    query: string,
    pageSize?: number,
    pageToken?: string
): Promise<V1ListMemosResponse> {
    try {
        const response = await client.api.memoServiceListMemos(
            {
                pageSize: pageSize || 15,
                pageToken: pageToken || '',
                filter: `content contains "${query}"`,
                state: MemosState.NORMAL,
            },
            { secure: true, signal: AbortSignal.timeout(10000) }
        )
        return response
    } catch (error) {
        throw `[searchMemos] ${getError(error)}`
    }
}
