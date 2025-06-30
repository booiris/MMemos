<script setup lang="ts">
import ListItem from './list-item.vue'

interface Props {
    title: string
    items: Array<{
        icon: any
        title: string
        type?: 'arrow' | 'switch'
        modelValue?: boolean
        onClick?: () => void
    }>
}

defineProps<Props>()

const emit = defineEmits<{
    'update:item': [index: number, value: boolean]
}>()

const handleModelValueUpdate = (index: number, value: boolean) => {
    emit('update:item', index, value)
}
</script>

<template>
    <div>
        <h2 class="text-xl text-primary font-style mb-1.5">
            {{ title }}
        </h2>

        <div class="p-4 border rounded-lg border-primary space-y-2">
            <ListItem
                v-for="(item, index) in items"
                :key="index"
                :icon="item.icon"
                :title="item.title"
                :type="item.type"
                :model-value="item.modelValue"
                :is-last="index === items.length - 1"
                @click="item.onClick"
                @update:model-value="
                    (value) => handleModelValueUpdate(index, value)
                " />
        </div>
    </div>
</template>
