<template>
    <div
        class="min-h-120 w-8 border-2 border-gray-800 rounded-4xl overflow-hidden flex flex-col"
        :class="{ 'justify-end': props.rotated }"
    >
        <!-- Barra de evaluación -->
        <div class="bg-black transition-all duration-300" :style="{ height: percentageBlack + '%' }"></div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        evaluation: {
            type: Object,
            default: null,
            // { type: 'cp' | 'mate', value: number }
        },
        rotated: {
            type: Boolean,
            default: false,
        },
    })

    /**
     * Normaliza la evaluación a un porcentaje 0–100
     */
    const percentageBlack = computed(() => {
        if (!props.evaluation) return 50

        const { type, value } = props.evaluation

        if (type === 'mate') {
            return value > 0 ? 0 : 100
        }

        if (!value) return 50

        const max = 600
        const min = -600
        const range = max - min
        const percent = ((-value - min) / range) * 100
        return percent
    })
</script>
