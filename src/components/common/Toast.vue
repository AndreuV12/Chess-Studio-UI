<template>
    <div
        v-if="props.modelValue"
        :class="[
            'fixed top-5 right-44 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white fade-enter-active',
            bgClass,
        ]"
        :style="{ '--duration': props.duration + 'ms' }"
    >
        <!-- Icono -->
        <component :is="icon" class="w-5 h-5" />

        <!-- Mensaje -->
        <span class="text-sm font-medium">{{ message }}</span>

        <!-- Botón cerrar -->
        <button @click="close" class="ml-3 text-white/80 hover:text-white"><X class="w-4 h-4"></X></button>
    </div>
</template>

<script setup>
    import { computed, watch } from 'vue'
    import { CheckCircle, AlertTriangle, Info, Trash2, X } from 'lucide-vue-next'

    const props = defineProps({
        modelValue: { type: Boolean, default: false },
        message: { type: String, required: true },
        type: { type: String, default: 'updated' },
        duration: { type: Number, default: 3000 }, // autoclose en ms y animación
    })

    const emit = defineEmits(['update:modelValue', 'close'])

    const bgClass = computed(() => {
        switch (props.type) {
            case 'created':
                return 'bg-green-600'

            case 'updated':
                return 'bg-blue-600'

            case 'deleted':
                return 'bg-amber-300'

            default:
                return 'bg-blue-400'
        }
    })

    const icon = computed(() => {
        switch (props.type) {
            case 'success':
                return CheckCircle
            case 'error':
                return Trash2
            case 'warning':
                return AlertTriangle
            default:
                return Info
        }
    })

    function close() {
        emit('update:modelValue', false)
        emit('close')
    }

    watch(
        () => props.modelValue,
        (val) => {
            if (val && props.duration > 0) {
                setTimeout(() => close(), props.duration)
            }
        },
    )
</script>

<style scoped>
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .fade-enter-active {
        animation: fadeOut var(--duration) forwards;
    }
</style>
