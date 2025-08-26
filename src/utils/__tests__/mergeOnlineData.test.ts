import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, type Ref } from 'vue'
import { mergeOnlineData, mergeOnline } from '../mergeOnlineData'
import type { Memo, MemosState } from '@/api/memos'
import type { V1State } from '@/api/schema/api'

// Mock dependencies
vi.mock('@/api/memos', () => ({
    getMemos: vi.fn(),
    getPinnedContent: vi.fn(),
    MemosState: {
        NORMAL: 'NORMAL',
        ARCHIVED: 'ARCHIVED',
    },
}))

vi.mock('@/stores/dataCache', () => ({
    useDataCacheStore: vi.fn(() => ({
        setMemoCache: vi.fn(),
        deleteMemoCache: vi.fn(),
    })),
}))

// Helper function to create mock memo
const createMockMemo = (
    name: string,
    displayTime: string,
    content = 'test content'
): Memo => ({
    name,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
    displayTime,
    visibility: 'PRIVATE',
    content,
    pinned: false,
    resources: [],
    relations: [],
    reactions: [],
    tags: [],
    state: 'NORMAL' as V1State,
})

// Import the private findIndexByDisplayTime function for testing
// Since it's not exported, we'll access it through module internals or test it indirectly
// For now, we'll test it through the mergeOnlineData function behavior

describe('mergeOnlineData', () => {
    let mockDataCacheStore: any

    beforeEach(async () => {
        vi.clearAllMocks()

        // Setup mock data cache store
        mockDataCacheStore = {
            setMemoCache: vi.fn(),
            deleteMemoCache: vi.fn(),
        }

        const { useDataCacheStore } = await import('@/stores/dataCache')
        vi.mocked(useDataCacheStore).mockReturnValue(mockDataCacheStore)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('mergeOnlineData function', () => {
        it('should return [0, 0] when online data is empty', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
            ])
            const onlineData: Memo[] = []

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([0, 0])
            expect(memos.value).toHaveLength(2)
        })

        it('should append new data when all online data is newer than local data', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-02T00:00:00Z'),
                createMockMemo('memo2', '2024-01-01T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo3', '2024-01-04T00:00:00Z'),
                createMockMemo('memo4', '2024-01-03T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([2, 4])
            expect(memos.value).toHaveLength(4)
            expect(memos.value[2]?.name).toBe('memo3')
            expect(memos.value[3]?.name).toBe('memo4')
            expect(mockDataCacheStore.setMemoCache).toHaveBeenCalledTimes(2)
        })

        it('should merge data in the middle of existing array', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-05T00:00:00Z'),
                createMockMemo('memo2', '2024-01-03T00:00:00Z'),
                createMockMemo('memo3', '2024-01-01T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo4', '2024-01-04T00:00:00Z'),
                createMockMemo('memo5', '2024-01-02T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([1, 2])
            expect(memos.value).toHaveLength(4)
            expect(memos.value[0]?.name).toBe('memo1') // unchanged
            expect(memos.value[1]?.name).toBe('memo4') // new
            expect(memos.value[2]?.name).toBe('memo5') // new
            expect(memos.value[3]?.name).toBe('memo3') // unchanged
        })

        it('should replace existing data with same displayTime', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
                createMockMemo('memo3', '2024-01-01T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo1_updated', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2_updated', '2024-01-02T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([0, 1])
            expect(memos.value).toHaveLength(3)
            expect(memos.value[0]?.name).toBe('memo1_updated')
            expect(memos.value[1]?.name).toBe('memo2_updated')
            expect(memos.value[2]?.name).toBe('memo3')
        })

        it('should handle cache operations correctly', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo1', '2024-01-03T00:00:00Z'), // exists in local
                createMockMemo('memo3', '2024-01-02T00:00:00Z'), // new
            ]

            mergeOnlineData(memos, onlineData)

            // Should set cache for new data
            expect(mockDataCacheStore.setMemoCache).toHaveBeenCalledWith(
                'memo1',
                expect.any(Object)
            )
            expect(mockDataCacheStore.setMemoCache).toHaveBeenCalledWith(
                'memo3',
                expect.any(Object)
            )

            // Should delete cache for removed data
            expect(mockDataCacheStore.deleteMemoCache).toHaveBeenCalledWith(
                'memo2'
            )
        })

        it('should handle edge case when online data covers entire local array', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-02T00:00:00Z'),
                createMockMemo('memo2', '2024-01-01T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo3', '2024-01-03T00:00:00Z'),
                createMockMemo('memo4', '2024-01-00T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([0, 1])
            expect(memos.value).toHaveLength(2)
            expect(memos.value[0]?.name).toBe('memo3')
            expect(memos.value[1]?.name).toBe('memo4')
        })
    })

    describe('mergeOnline function', () => {
        let mockGetMemos: any
        let mockGetPinnedContent: any

        beforeEach(async () => {
            const memosApi = await import('@/api/memos')
            mockGetMemos = vi.mocked(memosApi.getMemos)
            mockGetPinnedContent = vi.mocked(memosApi.getPinnedContent)
        })

        it('should handle pinned content correctly', async () => {
            const memos: Ref<Memo[]> = ref([])
            const pinnedMemos = [
                createMockMemo('pinned1', '2024-01-02T00:00:00Z'),
                createMockMemo('pinned2', '2024-01-01T00:00:00Z'),
            ]

            mockGetPinnedContent.mockResolvedValue(pinnedMemos)

            const result = await mergeOnline(memos, true)

            expect(result).toBeUndefined()
            expect(memos.value).toHaveLength(2)
            expect(mockGetPinnedContent).toHaveBeenCalledTimes(1)
            expect(mockGetMemos).not.toHaveBeenCalled()
        })

        it('should handle paginated data correctly', async () => {
            const memos: Ref<Memo[]> = ref([])
            const firstPageMemos = [
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
            ]
            const secondPageMemos = [
                createMockMemo('memo3', '2024-01-01T00:00:00Z'),
            ]

            mockGetMemos
                .mockResolvedValueOnce([firstPageMemos, 'token123'])
                .mockResolvedValueOnce([secondPageMemos, undefined])

            const result = await mergeOnline(
                memos,
                false,
                undefined,
                undefined,
                undefined,
                2
            )

            expect(result).toBe('token123')
            expect(mockGetMemos).toHaveBeenCalledTimes(2)
            expect(mockGetMemos).toHaveBeenCalledWith(
                undefined,
                2,
                '',
                undefined
            )
            expect(mockGetMemos).toHaveBeenCalledWith(
                undefined,
                2,
                'token123',
                undefined
            )
        })

        it('should stop when maxNum is reached', async () => {
            const memos: Ref<Memo[]> = ref([])
            const firstPageMemos = [
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
            ]

            mockGetMemos.mockResolvedValue([firstPageMemos, 'token123'])

            const result = await mergeOnline(
                memos,
                false,
                undefined,
                undefined,
                2,
                50
            )

            expect(result).toBe('token123')
            expect(mockGetMemos).toHaveBeenCalledTimes(1)
        })

        it('should handle errors properly', async () => {
            const memos: Ref<Memo[]> = ref([])
            const error = new Error('Network error')

            mockGetMemos.mockRejectedValue(error)

            await expect(mergeOnline(memos, false)).rejects.toThrow(
                'Network error'
            )
            expect(mockGetMemos).toHaveBeenCalledTimes(1)
        })

        it('should handle filtering by tag and state', async () => {
            const memos: Ref<Memo[]> = ref([])
            const memosWithTag = [
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
            ]

            mockGetMemos.mockResolvedValue([memosWithTag, undefined])

            await mergeOnline(memos, false, 'NORMAL' as MemosState, 'work')

            expect(mockGetMemos).toHaveBeenCalledWith('work', 50, '', 'NORMAL')
        })

        it('should clean up cache for removed memos', async () => {
            // Setup initial memos
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
                createMockMemo('memo3', '2024-01-01T00:00:00Z'),
            ])

            // Online data only contains first memo
            const onlineMemos = [
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
            ]

            mockGetMemos.mockResolvedValue([onlineMemos, undefined])

            await mergeOnline(memos, false)

            // Should delete cache for removed memos
            expect(mockDataCacheStore.deleteMemoCache).toHaveBeenCalledWith(
                'memo2'
            )
            expect(mockDataCacheStore.deleteMemoCache).toHaveBeenCalledWith(
                'memo3'
            )
        })
    })

    describe('Binary search behavior (tested through mergeOnlineData)', () => {
        it('should correctly find insertion points in descending array', () => {
            // Test descending order behavior through mergeOnlineData
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-05T00:00:00Z'), // newest
                createMockMemo('memo2', '2024-01-03T00:00:00Z'),
                createMockMemo('memo3', '2024-01-01T00:00:00Z'), // oldest
            ])

            // Insert data that should go in the middle
            const onlineData: Memo[] = [
                createMockMemo('memo4', '2024-01-04T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([1, 1])
            expect(memos.value[0]?.displayTime).toBe('2024-01-05T00:00:00Z')
            expect(memos.value[1]?.displayTime).toBe('2024-01-04T00:00:00Z')
            expect(memos.value[2]?.displayTime).toBe('2024-01-03T00:00:00Z')
            expect(memos.value[3]?.displayTime).toBe('2024-01-01T00:00:00Z')
        })

        it('should handle empty array edge case', () => {
            const memos: Ref<Memo[]> = ref([])
            const onlineData: Memo[] = [
                createMockMemo('memo1', '2024-01-01T00:00:00Z'),
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([0, 1])
            expect(memos.value).toHaveLength(1)
        })

        it('should handle single element array', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-02T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memo2', '2024-01-03T00:00:00Z'), // newer
                createMockMemo('memo3', '2024-01-01T00:00:00Z'), // older
            ]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([0, 1])
            expect(memos.value).toHaveLength(2)
            expect(memos.value[0]?.displayTime).toBe('2024-01-03T00:00:00Z')
            expect(memos.value[1]?.displayTime).toBe('2024-01-01T00:00:00Z')
        })

        it('should maintain descending order with complex merging', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-10T00:00:00Z'),
                createMockMemo('memo2', '2024-01-08T00:00:00Z'),
                createMockMemo('memo3', '2024-01-06T00:00:00Z'),
                createMockMemo('memo4', '2024-01-04T00:00:00Z'),
                createMockMemo('memo5', '2024-01-02T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo('memoA', '2024-01-09T00:00:00Z'),
                createMockMemo('memoB', '2024-01-07T00:00:00Z'),
                createMockMemo('memoC', '2024-01-05T00:00:00Z'),
                createMockMemo('memoD', '2024-01-03T00:00:00Z'),
            ]

            mergeOnlineData(memos, onlineData)

            // Verify descending order is maintained
            for (let i = 0; i < memos.value.length - 1; i++) {
                expect(
                    memos.value[i]!.displayTime >=
                        memos.value[i + 1]!.displayTime
                ).toBe(true)
            }

            // Verify all data is present
            expect(memos.value).toHaveLength(6) // 1 original + 4 new + 1 original
            expect(memos.value[0]?.name).toBe('memo1')
            expect(memos.value[1]?.name).toBe('memoA')
            expect(memos.value[5]?.name).toBe('memo5')
        })

        it('should handle identical timestamps correctly', () => {
            const sameTime = '2024-01-01T00:00:00Z'
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-02T00:00:00Z'),
                createMockMemo('memo2', sameTime),
                createMockMemo('memo3', '2023-12-31T00:00:00Z'),
            ])
            const onlineData: Memo[] = [createMockMemo('memoNew', sameTime)]

            const result = mergeOnlineData(memos, onlineData)

            expect(result).toEqual([1, 1])
            expect(memos.value).toHaveLength(3)
            expect(memos.value[1]?.name).toBe('memoNew')
        })
    })

    describe('Performance and Edge Cases', () => {
        it('should handle large datasets efficiently', () => {
            // Create large dataset
            const memos: Ref<Memo[]> = ref([])
            for (let i = 1000; i >= 1; i--) {
                memos.value.push(
                    createMockMemo(
                        `memo${i}`,
                        `2024-${String(i).padStart(2, '0')}-01T00:00:00Z`
                    )
                )
            }

            const onlineData: Memo[] = []
            for (let i = 1500; i >= 1001; i--) {
                onlineData.push(
                    createMockMemo(
                        `newMemo${i}`,
                        `2024-${String(i).padStart(2, '0')}-01T00:00:00Z`
                    )
                )
            }

            const startTime = performance.now()
            const result = mergeOnlineData(memos, onlineData)
            const endTime = performance.now()

            expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
            expect(result).toEqual([1000, 1500])
            expect(memos.value).toHaveLength(1500)
        })

        it('should handle arrays with duplicate memo names', () => {
            const memos: Ref<Memo[]> = ref([
                createMockMemo('memo1', '2024-01-03T00:00:00Z'),
                createMockMemo('memo2', '2024-01-02T00:00:00Z'),
            ])
            const onlineData: Memo[] = [
                createMockMemo(
                    'memo1',
                    '2024-01-03T00:00:00Z',
                    'updated content'
                ), // Same name, updated content
                createMockMemo('memo3', '2024-01-01T00:00:00Z'),
            ]

            mergeOnlineData(memos, onlineData)

            expect(memos.value).toHaveLength(2)
            expect(memos.value[0]?.content).toBe('updated content')
            expect(mockDataCacheStore.setMemoCache).toHaveBeenCalledWith(
                'memo1',
                expect.objectContaining({
                    content: 'updated content',
                })
            )
        })
    })
})
