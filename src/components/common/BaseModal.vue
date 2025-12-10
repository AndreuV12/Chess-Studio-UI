<template>
    <div
        v-if="modelValue"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        tabindex="0<"
        @keydown.esc="onEsc"
    >
        <!-- Overlay -->
        <div class="absolute inset-0 z-0" @click="close"></div>

        <!-- Modal interno -->
        <div
            class="relative z-40 bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 w-3/4 md:w-1/2"
            @click.stop
            :class="props.class"
        >
            <!-- HEADER -->
            <div class="flex justify-between items-center">
                <slot name="header"></slot>
                <button class="text-gray-500 hover:text-gray-700 font-bold text-lg" @click="close">
                    <X class="w-4 h-4" />
                </button>
            </div>

            <!-- BODY -->
            <div>
                <slot name="body"></slot>
            </div>

            <!-- FOOTER -->
            <div>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { X } from 'lucide-vue-next'
    import { ref, watch, nextTick } from 'vue'

    const props = defineProps({
        modelValue: { type: Boolean, default: false },
        class: { type: String, default: '' },
    })

    const emit = defineEmits(['update:modelValue', 'close'])
    const modalRef = ref(null)

    // Mantener foco para detectar tecla Escape
    watch(
        () => props.modelValue,
        async (open) => {
            if (open) {
                await nextTick()
                modalRef.value?.focus()
            }
        },
        { immediate: true },
    )

    function close() {
        emit('update:modelValue', false)
    }

    function onEsc() {
        close()
    }
</script>
