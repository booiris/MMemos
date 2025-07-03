import client from './client'
import { getError } from './error'
import { V1ListMemosResponse } from './schema/api'

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
        console.error('[getMemos] ' + getError(error))
        throw new Error(getError(error))
    }
}
