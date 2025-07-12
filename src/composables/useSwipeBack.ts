import { onMounted, onUnmounted } from 'vue'

interface SwipeOptions {
    threshold?: number
    edgeWidth?: number
    onSwipe?: () => void
}

export function useSwipeBack(options: SwipeOptions = {}) {
    const { threshold = 50, edgeWidth = 35, onSwipe } = options

    let touchStartX = 0
    let startFromLeft = false

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            touchStartX = e.touches[0]!.clientX
            startFromLeft = touchStartX < edgeWidth
        }
    }

    const handleTouchEnd = (e: TouchEvent) => {
        if (!startFromLeft || e.changedTouches.length === 0) {
            return
        }

        const touchEndX = e.changedTouches[0]!.clientX
        const deltaX = touchEndX - touchStartX

        if (deltaX > threshold) {
            onSwipe?.()
        }
    }

    onMounted(() => {
        document.addEventListener('touchstart', handleTouchStart, {
            passive: false,
        })
        document.addEventListener('touchend', handleTouchEnd, {
            passive: false,
        })
    })

    onUnmounted(() => {
        document.removeEventListener('touchstart', handleTouchStart)
        document.removeEventListener('touchend', handleTouchEnd)
    })
}
