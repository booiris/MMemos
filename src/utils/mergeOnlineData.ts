import { getMemos, getPinnedContent, Memo, MemosState } from '@/api/memos'
import { useDataCacheStore } from '@/stores/dataCache'
import { Ref } from 'vue'

export function mergeOnlineData(memos: Ref<Memo[]>, onlineData: Memo[]) {
    if (onlineData.length === 0) {
        return
    }

    const dataCache = useDataCacheStore()
    const startIndex = memos.value.findIndex(
        (m) => m.displayTime <= onlineData[0]!.displayTime
    )
    if (startIndex === -1) {
        for (const memo of onlineData) {
            dataCache.setMemoCache(memo.name, memo)
        }
        memos.value.push(...onlineData)
        return
    }

    let endIndex = memos.value.findIndex(
        (m) => m.displayTime < onlineData[onlineData.length - 1]!.displayTime
    )
    if (endIndex === -1) {
        endIndex = memos.value.length - 1
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
}

export async function mergeOnline(
    memos: Ref<Memo[]>,
    pinned: boolean,
    state?: MemosState,
    tag?: string,
    pageToken?: string,
    maxNum?: number
): Promise<string | undefined> {
    if (pinned) {
        const pinnedMemos = await getPinnedContent()
        mergeOnlineData(memos, pinnedMemos)
        return undefined
    }

    const limit = 30
    let now = 0
    while (true) {
        try {
            const [res, nextPageToken] = await getMemos(
                tag,
                limit,
                pageToken,
                state
            )
            mergeOnlineData(memos, res)
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
    return pageToken
}
