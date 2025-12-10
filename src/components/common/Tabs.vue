<template>
    <div role="tablist" class="flex bg-gray-200 rounded-2xl p-0.5">
        <a
            v-for="opt in options"
            :key="opt.value"
            role="tab"
            class="flex-1 flex items-center justify-center gap-1 h-[1.8rem] rounded-2xl font-bold text-xs text-black cursor-pointer p-2"
            :class="{ 'bg-white shadow-md': modelValue === opt.value }"
            @click="selectTab(opt.value)"
        >
            <component v-if="opt.icon" :is="opt.icon" v-bind="opt.iconProps" class="w-6 h-6" />
            <span>{{ opt.label }}</span>
        </a>
    </div>
</template>

<script setup>
    const props = defineProps({
        modelValue: { type: String, required: true },
        options: { type: Array, required: true },
    })

    const emit = defineEmits(['update:modelValue'])

    function selectTab(value) {
        emit('update:modelValue', value)
    }
</script>
