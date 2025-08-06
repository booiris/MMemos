<script setup lang="ts">
import ListItem from './list-item.vue'
import type { Ref } from 'vue'

interface Props {
    title: string
    items: Array<{
        icon: any
        title: string
        type?: 'arrow' | 'switch'
        modelValue?: boolean | Ref<boolean>
        onClick?: () => void
        onChange?: (value: boolean) => void
    }>
}

defineProps<Props>()
</script>

<template>
    <div>
        <h2 class="text-xl text-primary font-style mb-1.5">
            {{ title }}
        </h2>

        <div class="px-3.5 py-3 border rounded-lg border-primary space-y-2">
            <ListItem
                v-for="(item, index) in items"
                :key="index"
                :icon="item.icon"
                :title="item.title"
                :type="item.type"
                :model-value="item.modelValue"
                :is-last="index === items.length - 1"
                @click="item.onClick"
                @update:model-value="item.onChange" />
        </div>
    </div>
</template>
