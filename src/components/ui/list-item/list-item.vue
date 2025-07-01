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
        <div
            v-if="type === 'arrow'"
            @click="handleClick"
            class="flex items-center justify-between rounded-md p-2 -m-2 transition-colors duration-150 active:bg-primary/10 touch-manipulation">
            <div class="flex items-center">
                <div class="w-8 h-8 flex items-center justify-center">
                    <component :is="icon" class="!w-5 !h-5 text-primary" />
                </div>
                <div>
                    <h3 class="text-primary text-lg">
                        {{ title }}
                    </h3>
                </div>
            </div>

            <div class="text-primary">
                <ChevronRight class="!w-5 !h-5" />
            </div>
        </div>

        <div
            v-else-if="type === 'switch'"
            class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-8 h-8 flex items-center justify-center">
                    <component :is="icon" class="!w-5 !h-5 text-primary" />
                </div>
                <div>
                    <h3 class="text-primary text-lg">
                        {{ title }}
                    </h3>
                </div>
            </div>

            <Switch
                :model-value="modelValue"
                @update:model-value="handleSwitchChange" />
        </div>

        <div v-if="!isLast" class="border-b border-primary my-3"></div>
    </div>
</template>
