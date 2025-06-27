<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    scale?: number
    duration?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    scale: 0.96,
    duration: '0.15s',
    disabled: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
    touchstart: [event: TouchEvent]
    touchend: [event: TouchEvent]
    touchcancel: [event: TouchEvent]
}>()

const touchStyle = computed(() => ({
    transition: `all ${props.duration} ease-in-out`,
    transformOrigin: 'center',
    WebkitTapHighlightColor: 'transparent'
}))

const handleTouchStart = (event: TouchEvent) => {
    if (props.disabled) return
    const target = event.target as HTMLElement
    target.style.transform = `scale(${props.scale})`
    emit('touchstart', event)
}

const handleTouchEnd = (event: TouchEvent) => {
    if (props.disabled) return
    const target = event.target as HTMLElement
    target.style.transform = 'scale(1)'
    emit('touchend', event)
}

const handleTouchCancel = (event: TouchEvent) => {
    if (props.disabled) return
    const target = event.target as HTMLElement
    target.style.transform = 'scale(1)'
    emit('touchcancel', event)
}

const handleClick = (event: MouseEvent) => {
    if (props.disabled) return
    emit('click', event)
}
</script>

<template>
    <div :style="touchStyle" @click="handleClick" @touchstart="handleTouchStart" @touchend="handleTouchEnd"
        @touchcancel="handleTouchCancel">
        <slot />
    </div>
</template>