<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const transitionName = computed(() => {
    return (route.meta.transition as string) || 'fade'
})
</script>

<template>
    <div class="main">
        <router-view v-slot="{ Component }" class="main-content">
            <transition :name="transitionName">
                <KeepAlive>
                    <component :is="Component" :key="route.path" />
                </KeepAlive>
            </transition>
        </router-view>
    </div>
</template>

<style scoped>
html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
}
.main {
    height: 100%;
}
.main-content {
    min-height: 0;
    overflow-y: auto;
    position: relative;
    margin-top: calc(env(safe-area-inset-top) - 8px);
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: all 0.29s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-right-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-right-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.slide-right-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.slide-right-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.slide-left-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.slide-left-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.18s ease;
}

.fade-enter-from {
    opacity: 0;
    filter: blur(2px);
}

.fade-enter-to {
    opacity: 1;
    filter: blur(0);
}

.fade-leave-from {
    opacity: 1;
    filter: blur(0);
}

.fade-leave-to {
    opacity: 0;
    filter: blur(2px);
}
</style>
