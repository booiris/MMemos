import { onActivated, onDeactivated } from 'vue'

interface SwipeOptions {
    threshold?: number
    edgeWidth?: number
    onSwipe?: () => void
}

export function useSwipeBack(
    options: SwipeOptions = {},
    targetSelector: string
) {
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

    onActivated(() => {
        const target = document.querySelector(targetSelector) as HTMLElement
        if (target) {
            target.addEventListener('touchstart', handleTouchStart, {
                passive: false,
            })
            target.addEventListener('touchend', handleTouchEnd, {
                passive: false,
            })
        }
    })

    onDeactivated(() => {
        const target = document.querySelector(targetSelector) as HTMLElement
        if (target) {
            target.removeEventListener('touchstart', handleTouchStart)
            target.removeEventListener('touchend', handleTouchEnd)
        }
    })
}
