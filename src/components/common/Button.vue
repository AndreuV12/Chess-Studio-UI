<template>
    <button v-bind="$attrs" @click="$emit('click', $event)">
        <LucideLoader v-if="loading" class="w-4 h-4 animate-spin" />
        <slot v-else></slot>
    </button>
</template>

<script setup>
    import { LucideLoader } from 'lucide-vue-next'

    const props = defineProps({
        loading: { type: Boolean, default: false },
    })

    defineEmits(['click'])
</script>
