import client from './client'
import { getError } from './error'
import { Apiv1Memo, V1ListMemosResponse } from './schema/api'

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
