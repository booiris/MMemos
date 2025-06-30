<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { Switch } from '@/components/ui/switch'

interface Props {
    icon: any
    title: string
    type?: 'arrow' | 'switch'
    modelValue?: boolean
    isLast?: boolean
}

interface Emits {
    (e: 'click'): void
    (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
    type: 'arrow',
    isLast: false,
})

const emit = defineEmits<Emits>()

const handleClick = () => {
    if (props.type === 'arrow') {
        emit('click')
    }
}

const handleSwitchChange = (value: boolean) => {
    emit('update:modelValue', value)
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-8 h-8 flex items-center justify-center">
                    <component :is="icon" class="!w-5 !h-5 text-primary" />
                </div>
                <div>
                    <h3 class="font-medium text-primary text-lg">
                        {{ title }}
                    </h3>
                </div>
            </div>

            <button
                v-if="type === 'arrow'"
                @click="handleClick"
                class="text-primary">
                <ChevronRight class="!w-5 !h-5" />
            </button>

            <Switch
                v-else-if="type === 'switch'"
                :model-value="modelValue"
                @update:model-value="handleSwitchChange" />
        </div>

        <div v-if="!isLast" class="border-b border-primary my-3"></div>
    </div>
</template>
