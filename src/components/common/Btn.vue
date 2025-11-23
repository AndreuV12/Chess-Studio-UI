<template>
    <button v-bind="$attrs" @click="$emit('click', $event)">
        <LoaderCircle v-if="loading" class="w-6 h-6 animate-spin" />
        <slot v-else></slot>
    </button>
</template>

<script setup>
    import { LoaderCircle } from 'lucide-vue-next'

    const props = defineProps({
        loading: { type: Boolean, default: false },
    })

    defineEmits(['click'])
</script>
