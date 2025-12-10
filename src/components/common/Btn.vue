<template>
    <button
        v-bind="$attrs"
        :type="type"
        :class="[
            'flex items-center justify-center gap-2 font-semibold',
            // padding y borde redondo por defecto
            props.iconOnly ? 'p-2 w-10 h-10 rounded-full' : 'px-4 py-2 rounded-xl',
            // variante de color
            variantClass,
            // clases adicionales
            props.class,
            // estado loading
            loading ? 'opacity-80' : '',
        ]"
    >
        <slot v-if="!loading"></slot>
        <LoaderCircle v-else class="w-6 h-6 animate-spin" />
    </button>
</template>

<script setup>
    import { LoaderCircle } from 'lucide-vue-next'
    import { computed } from 'vue'

    const props = defineProps({
        type: { type: String, default: 'button' },
        loading: { type: Boolean, default: false },
        variant: { type: String, default: 'default' },
        class: { type: String, default: '' },
        iconOnly: { type: Boolean, default: false }, // para botones redondos de solo icono
    })

    const variantClass = computed(() => {
        const variants = {
            create: 'bg-green-600 text-white hover:bg-green-700',
            edit: 'bg-blue-600 text-white hover:bg-blue-700',
            action: 'bg-black text-white hover:bg-gray-700',
            default: 'bg-gray-200 text-black hover:bg-gray-300',
        }
        return variants[props.variant] || variants.default
    })
</script>
