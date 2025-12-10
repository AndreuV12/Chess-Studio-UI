<template>
    <BaseModal v-model="show" class="w-3/4 md:w-1/2">
        <!-- HEADER -->
        <template #header>
            <h3 class="text-2xl font-semibold text-center">Crear apertura</h3>
        </template>

        <!-- BODY -->
        <template #body>
            <div class="flex flex-col gap-4">
                <!-- Nombre de la apertura -->
                <label class="font-medium">Nombre de la apertura</label>
                <input
                    type="text"
                    v-model="openingName"
                    placeholder="Introduce el nombre"
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <!-- Campos adicionales -->
                <slot name="extraFields"></slot>
            </div>
        </template>

        <!-- FOOTER -->
        <template #footer>
            <div class="flex justify-end gap-3">
                <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300" @click="close">
                    Cancelar
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
                    :disabled="loading"
                    @click="onConfirm"
                >
                    <span
                        v-if="loading"
                        class="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"
                    ></span>
                    <span v-else>Crear</span>
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
    import { ref, watch, defineEmits, defineProps } from 'vue'
    import BaseModal from '@/components/common/BaseModal.vue'

    const props = defineProps({
        modelValue: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:modelValue', 'confirm'])

    const show = ref(props.modelValue)
    const openingName = ref('')

    // Sync con el v-model externo
    watch(
        () => props.modelValue,
        (val) => (show.value = val),
    )
    watch(show, (val) => emit('update:modelValue', val))

    function close() {
        show.value = false
    }

    function onConfirm() {
        emit('confirm', { name: openingName.value })
    }
</script>
