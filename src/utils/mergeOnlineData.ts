import { getMemos, getPinnedContent, Memo, MemosState } from '@/api/memos'
import { useDataCacheStore } from '@/stores/dataCache'
import { Ref } from 'vue'

export function mergeOnlineData(memos: Ref<Memo[]>, onlineData: Memo[]) {
    const dataCache = useDataCacheStore()

    const onlineDataMemoNames = new Set(onlineData.map((m) => m.name))

    for (let i = 0; i < memos.value.length; i++) {
        const memo = memos.value[i]!
        if (onlineDataMemoNames.has(memo.name)) {
            dataCache.setMemoCache(memo.name, memo)
        } else {
            dataCache.deleteMemoCache(memo.name)
        }
    }
    memos.value = onlineData
}

export async function mergeOnline(
    memos: Ref<Memo[]>,
    pinned: boolean,
    state?: MemosState,
    tag?: string,
    limit = 50
) {
    if (pinned) {
        const pinnedMemos = await getPinnedContent(tag)
        mergeOnlineData(memos, pinnedMemos)
        return undefined
    }

    let onlineData = []
    let pageToken: string | undefined = ''
    while (true) {
        try {
            const [res, nextPageToken] = await getMemos(
                tag,
                limit,
                pageToken,
                state
            )
            pageToken = nextPageToken
            onlineData.push(...res)
            if (!nextPageToken) {
                break
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    mergeOnlineData(memos, onlineData)
    return pageToken
}
