import { getMemos, getPinnedContent, Memo, MemosState } from '@/api/memos'
import { useDataCacheStore } from '@/stores/dataCache'
import { Ref } from 'vue'

/**
 * High-performance binary search for descending sorted array by displayTimeUnix
 * Avoids creating temporary arrays for better performance
 */
function findIndexByDisplayTime(
    memos: Memo[],
    targetTime: string,
    operator: '<=' | '<'
): number {
    if (memos.length === 0) return -1

    let left = 0
    let right = memos.length

    // Binary search for descending array
    while (left < right) {
        const mid = Math.floor((left + right) / 2)
        const midTime = memos[mid]!.displayTime

        // For descending array: find first index where condition is true
        const condition =
            operator === '<=' ? midTime <= targetTime : midTime < targetTime

        if (condition) {
            right = mid
        } else {
            left = mid + 1
        }
    }

    return left < memos.length ? left : -1
}

export function mergeOnlineData(
    memos: Ref<Memo[]>,
    onlineData: Memo[]
): [affectedStartIndex: number, affectedEndIndex: number] {
    if (onlineData.length === 0) {
        return [0, 0]
    }

    const dataCache = useDataCacheStore()

    // Use binary search with displayTimeUnix for better performance
    const startIndex = findIndexByDisplayTime(
        memos.value,
        onlineData[0]!.displayTime,
        '<='
    )

    if (startIndex === -1) {
        for (const memo of onlineData) {
            dataCache.setMemoCache(memo.name, memo)
        }
        const memosPreLen = memos.value.length
        memos.value.push(...onlineData)
        return [memosPreLen, memos.value.length]
    }

    let endIndex = findIndexByDisplayTime(
        memos.value,
        onlineData[onlineData.length - 1]!.displayTime,
        '<'
    )

    if (endIndex === -1) {
        endIndex = memos.value.length
    }

    const onlineDataMemoNames = new Map(onlineData.map((m) => [m.name, m]))
    for (let i = startIndex; i < endIndex; i++) {
        const memo = memos.value[i]!
        if (onlineDataMemoNames.has(memo.name)) {
            dataCache.setMemoCache(
                memo.name,
                onlineDataMemoNames.get(memo.name)!
            )
        } else {
            dataCache.deleteMemoCache(memo.name)
        }
    }

    memos.value.splice(startIndex, endIndex - startIndex + 1, ...onlineData)
    return [startIndex, endIndex]
}

export async function mergeOnline(
    memos: Ref<Memo[]>,
    pinned: boolean,
    state?: MemosState,
    tag?: string,
    maxNum?: number,
    limit = 50
): Promise<string | undefined> {
    if (pinned) {
        const pinnedMemos = await getPinnedContent()
        mergeOnlineData(memos, pinnedMemos)
        return undefined
    }

    let now = 0
    let pageToken: string | undefined = ''
    let preAffectedStartIndex = 0
    let finalAffectedEndIndex = 1e9
    const dataCache = useDataCacheStore()
    while (true) {
        try {
            const [res, nextPageToken] = await getMemos(
                tag,
                limit,
                pageToken,
                state
            )
            const [affectedStartIndex, affectedEndIndex] = mergeOnlineData(
                memos,
                res
            )
            for (let i = preAffectedStartIndex; i < affectedStartIndex; i++) {
                dataCache.deleteMemoCache(memos.value[i]!.name)
            }
            const subLen = Math.max(affectedStartIndex - preAffectedStartIndex)
            if (subLen > 0) {
                memos.value = memos.value.splice(preAffectedStartIndex, subLen)
            }

            preAffectedStartIndex = affectedEndIndex - subLen
            finalAffectedEndIndex = preAffectedStartIndex
            now += res.length
            pageToken = nextPageToken
            if (!nextPageToken || (maxNum && now >= maxNum)) {
                break
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    for (let i = finalAffectedEndIndex; i < memos.value.length; i++) {
        dataCache.deleteMemoCache(memos.value[i]!.name)
    }
    if (finalAffectedEndIndex < memos.value.length) {
        memos.value = memos.value.slice(0, finalAffectedEndIndex)
    }
    return pageToken
}
