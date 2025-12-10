<script setup>
    const props = defineProps({
        modelValue: {
            type: String,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
    })

    const emit = defineEmits(['update:modelValue'])

    function selectTab(value) {
        emit('update:modelValue', value)
    }
</script>

<template>
    <div role="tablist" class="tabs tabs-bordered bg-gray-200 rounded-2xl p-0.5">
        <a
            v-for="opt in options"
            :key="opt.value"
            role="tab"
            class="tab flex-1 rounded-2xl h-[1.8rem] font-bold text-xs text-black flex items-center justify-center"
            :class="{ 'tab-active bg-white': modelValue === opt.value }"
            @click="selectTab(opt.value)"
        >
            <div class="flex gap-1 text-nowrap items-center">
                <component v-if="opt.icon" :is="opt.icon" class="w-4 h-4" />
                {{ opt.label }}
            </div>
        </a>
    </div>
</template>
