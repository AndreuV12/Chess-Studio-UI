<template>
    <div
        class="flex items-center rounded-md p-2 border border-gray-300 bg-gray-50 gap-2 min-w-[200px]"
        :class="disabled ? 'opacity-50 bg-gray-200' : 'focus-within:border-gray-400'"
    >
        <slot name="icon-start"></slot>

        <input v-model="internalValue" class="outline-none flex-1 w-0" :disabled="disabled" v-bind="$attrs" />
        <div class="ml-auto flex items-center gap-1">
            <X
                v-if="clearable && internalValue"
                @click="internalValue = null"
                class="w-6 h-6 opacity-50 hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            ></X>
            <slot name="icon-end"></slot>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import { X } from 'lucide-vue-next'

    const props = defineProps({
        modelValue: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
        clearable: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:modelValue'])

    const internalValue = ref(props.modelValue || '')

    watch(
        () => props.modelValue,
        (val) => {
            internalValue.value = val
        },
    )
    watch(internalValue, (val) => {
        emit('update:modelValue', val || null)
    })
</script>
