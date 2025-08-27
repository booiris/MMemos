import { getError } from '@/api/error'
import { ref } from 'vue'
import { impactFeedback } from '@tauri-apps/plugin-haptics'

export interface PullToRefreshOptions {
    threshold?: number
    onRefresh?: () => Promise<void>
    containerId?: string
    targetId?: string
    loaderId?: string
}

export function usePullToRefresh(options: PullToRefreshOptions = {}) {
    const {
        threshold = 60,
        onRefresh,
        containerId = 'memo-list',
        targetId = 'pull-target',
        loaderId = 'pull-loader',
    } = options

    const startThreshold = 15
    const loadingTop = 40

    const isPullRefreshing = ref(false)
    const isPulling = ref(false)
    let startY: number | null = null
    let currentDistance = 0
    let rafId: number | null = null
    let targetElement: HTMLElement | null = null
    let loaderElement: HTMLElement | null = null

    // Get target element and set optimization styles
    const initTargetElement = () => {
        if (!targetElement) {
            targetElement = document.getElementById(targetId)
            if (targetElement) {
                // Enable hardware acceleration and optimize rendering
                targetElement.style.willChange = 'transform'
                targetElement.style.backfaceVisibility = 'hidden'
                targetElement.style.perspective = '1000px'
            }
        }
        return targetElement
    }

    // Get loader element for progress updates
    const initLoaderElement = (reset: boolean) => {
        if (reset || !loaderElement) {
            loaderElement = document.getElementById(loaderId)
        }

        return loaderElement
    }

    // Calculate progress without Vue reactivity
    const calculateProgress = (distance: number): number => {
        // During refresh, show full progress only if distance is at loading position
        if (isPullRefreshing.value && distance >= loadingTop) return 100
        // For normal pulling, calculate progressive reveal
        const progress = Math.min(
            ((distance - startThreshold) / threshold) * 100,
            100
        )
        return Math.max(progress, 0)
    }

    // Optimized update function using requestAnimationFrame
    const updateTransform = (distance: number) => {
        if (rafId) {
            cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => {
            const element = initTargetElement()

            if (element) {
                // Use transform3d to enable hardware acceleration
                element.style.transform =
                    distance > 0 ? `translate3d(0, ${distance}px, 0)` : ''
                // Dynamically control transition
                element.style.transition = isPulling.value
                    ? 'none'
                    : 'transform 0.3s ease-out'
            }

            // Update loader progress directly via CSS custom property
            const loader = initLoaderElement(false)
            if (loader) {
                const progress = calculateProgress(distance)
                loader.style.setProperty('--progress', progress.toString())
            }
        })
    }

    // Pull refresh handlers
    const handleTouchStart = (event: TouchEvent) => {
        if (isPullRefreshing.value || !event.touches[0]) return

        const container = document.getElementById(containerId)
        if (container && container.scrollTop < 3) {
            startY = event.touches[0].clientY
        }
        // Pre-initialize target element
        initTargetElement()
    }

    const handleTouchMove = (event: TouchEvent) => {
        if (isPullRefreshing.value || !event.touches[0]) return

        if (!startY) return

        const currentY = event.touches[0].clientY
        const distance = currentY - startY

        if (distance > 0) {
            // Add damping effect, stronger damping for greater distance
            currentDistance = distance * 0.3

            if (!isPulling.value && distance > startThreshold) {
                isPulling.value = true
                const loader = initLoaderElement(true)
                if (loader) {
                    loader.style.setProperty('--progress', '0')
                }
            }

            // Prevent default scrolling when pulling down
            event.preventDefault()

            // Use optimized update method
            updateTransform(currentDistance)
        }
    }

    const handleTouchEnd = () => {
        if (isPullRefreshing.value) return

        startY = null

        if (!isPulling.value) {
            return
        }

        isPulling.value = false

        if (currentDistance > threshold) {
            handlePullRefresh()
        } else {
            // Reset animation
            currentDistance = 0
            // Reset loader progress when pull is cancelled
            updateTransform(0)
        }
    }

    const handlePullRefresh = async () => {
        if (isPullRefreshing.value) return

        await impactFeedback('medium')
        currentDistance = loadingTop
        updateTransform(currentDistance)

        try {
            isPullRefreshing.value = true
            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('Pull refresh failed:' + getError(error))
        } finally {
            isPullRefreshing.value = false
            currentDistance = 0
            updateTransform(0)
        }
    }

    // Cleanup function
    const cleanup = () => {
        if (rafId) {
            cancelAnimationFrame(rafId)
        }
        if (targetElement) {
            targetElement.style.willChange = 'auto'
            targetElement.style.transform = ''
            targetElement.style.transition = ''
        }
        if (loaderElement) {
            loaderElement.style.removeProperty('--progress')
        }
    }

    return {
        // States
        isPullRefreshing,
        isPulling,

        // Event handlers
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,

        // Utils
        cleanup,

        // Config
        threshold,
    }
}
