import client from './client'
import { getError } from './error'
import { Apiv1Memo, V1ListMemosResponse } from './schema/api'

export enum MemosState {
    NORMAL = 'NORMAL',
    ARCHIVED = 'ARCHIVED',
}

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

export async function loadAllMemos(
    pageToken?: string,
    state?: MemosState
): Promise<Apiv1Memo[]> {
    let memos: Apiv1Memo[] = []
    try {
        while (true) {
            const response = await getMemos(100, pageToken, state)
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
