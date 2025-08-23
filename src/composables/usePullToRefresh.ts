import { getError } from '@/api/error'
import { ref, computed } from 'vue'

export interface PullToRefreshOptions {
    threshold?: number
    onRefresh?: () => Promise<void>
    containerId?: string
}

export function usePullToRefresh(options: PullToRefreshOptions = {}) {
    const { threshold = 40, onRefresh, containerId = 'memo-list' } = options

    const startThreshold = 30
    const loadingTop = 40

    const isPullRefreshing = ref(false)
    const pullDistance = ref(0)
    const isPulling = ref(false)
    let startY: number | null = null
    let isPullingInner = false

    const loaderProgress = computed(() => {
        if (isPullRefreshing.value) return 100
        const progress = Math.min(
            ((pullDistance.value - startThreshold) / threshold) * 100,
            100
        )
        return Math.max(progress, 0)
    })

    // Pull refresh handlers
    const handleTouchStart = (event: TouchEvent) => {
        if (isPullRefreshing.value || !event.touches[0]) return

        const container = document.getElementById(containerId)
        if (container && container.scrollTop < 3) {
            startY = event.touches[0].clientY
        }
    }

    const handleTouchMove = (event: TouchEvent) => {
        if (isPullRefreshing.value || !event.touches[0]) return

        if (!startY) return

        const currentY = event.touches[0].clientY
        const distance = currentY - startY

        if (distance > 0) {
            if (!isPullingInner && pullDistance.value > startThreshold) {
                isPullingInner = true
                isPulling.value = true
            }
            // Prevent default scrolling when pulling down
            event.preventDefault()

            // Apply resistance effect (slower pull as distance increases)
            pullDistance.value = distance * 0.35
        }
    }

    const handleTouchEnd = () => {
        if (isPullRefreshing.value) return
        if (!isPulling.value) {
            pullDistance.value = 0
            return
        }

        isPulling.value = false
        isPullingInner = false
        startY = null

        if (pullDistance.value - startThreshold >= threshold) {
            // Trigger refresh
            handlePullRefresh()
        } else {
            // Reset pull distance
            pullDistance.value = 0
        }
    }

    const handlePullRefresh = async () => {
        if (isPullRefreshing.value) return

        pullDistance.value = loadingTop
        try {
            isPullRefreshing.value = true
            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('Pull refresh failed:' + getError(error))
        } finally {
            isPullRefreshing.value = false
            pullDistance.value = 0
        }
    }

    return {
        // States
        isPullRefreshing,
        pullDistance,
        isPulling,
        loaderProgress,

        // Event handlers
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,

        // Config
        threshold,
    }
}
