<template>
    <button
        v-bind="$attrs"
        v-on="$attrs"
        :class="[
            // Estilos base
            'px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2',
            // Variante de color
            variantClass,
            // Clases adicionales que quieras pasar
            props.class,
            // Estado loading
            loading ? 'opacity-80' : '',
        ]"
    >
        <LoaderCircle v-if="loading" class="w-6 h-6 animate-spin" />
        <slot v-else></slot>
    </button>
</template>

<script setup>
    import { LoaderCircle } from 'lucide-vue-next'
    import { computed } from 'vue'

    // Props
    const props = defineProps({
        loading: { type: Boolean, default: false },
        variant: { type: String, default: 'default' }, // nuevo prop
        class: { type: String, default: '' }, // clases adicionales
    })

    // Computada para la variante
    const variantClass = computed(() => {
        const variants = {
            create: 'bg-green-600 text-white hover:bg-green-700',
            edit: 'bg-blue-600 text-white hover:bg-blue-700',
            action: 'bg-black text-white hover:bg-gray-700',
            default: 'bg-gray-200 text-black hover:bg-gray-300',
        }

        return variants[props.variant] || variants['default']
    })
</script>
