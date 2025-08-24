import { getError } from '@/api/error'
import { ref } from 'vue'
import { impactFeedback } from '@tauri-apps/plugin-haptics'

export interface PullToRefreshOptions {
    threshold?: number
    onRefresh?: () => Promise<void>
    containerId?: string
}

export function usePullToRefresh(options: PullToRefreshOptions = {}) {
    const { threshold = 65, onRefresh, containerId = 'memo-list' } = options

    const startThreshold = 20
    const loadingTop = 40

    const isPullRefreshing = ref(false)
    const isPulling = ref(false)
    let distance = 0
    let startY: number | null = null

    // const loaderProgress = computed(() => {
    //     if (isPullRefreshing.value) return 100
    //     const progress = Math.min(
    //         ((pullDistance.value - startThreshold) / threshold) * 100,
    //         100
    //     )
    //     return Math.max(progress, 0)
    // })

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
        distance = currentY - startY

        if (distance > 0) {
            if (!isPulling.value) {
                isPulling.value = true
            }
            // Prevent default scrolling when pulling down
            // event.preventDefault()
        }
    }

    const handleTouchEnd = () => {
        if (isPullRefreshing.value) return
        startY = null
        if (!isPulling.value) {
            return
        }

        isPulling.value = false
        if (distance - startThreshold > threshold) {
            handlePullRefresh()
        }
    }

    const handlePullRefresh = async () => {
        if (isPullRefreshing.value) return

        await impactFeedback('medium')
        try {
            isPullRefreshing.value = true
            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('Pull refresh failed:' + getError(error))
        } finally {
            isPullRefreshing.value = false
        }
    }

    return {
        // States
        isPullRefreshing,
        isPulling,
        loadingTop,
        // loaderProgress,

        // Event handlers
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,

        // Config
        threshold,
    }
}
