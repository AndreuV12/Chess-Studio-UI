<template>
    <BaseModal v-model="show" class="w-3/4 md:w-1/2">
        <!-- HEADER -->
        <template #header>
            <h3 class="text-2xl font-semibold text-center">Crear apertura</h3>
        </template>

        <!-- BODY -->
        <template #body>
            <div class="flex flex-col gap-2">
                <div>
                    <!-- Nombre de la apertura -->
                    <label class="font-medium">Nombre de la apertura</label>
                    <div class="flex">
                        <Input
                            v-model="form.name"
                            class="flex flex-1"
                            placeholder="Introduce el nombre de la apertura"
                        ></Input>
                    </div>
                </div>
                <div>
                    <!-- Nombre de la apertura -->
                    <label class="font-medium">Descripción</label>
                    <div class="flex">
                        <Input
                            v-model="form.name"
                            class="flex flex-1"
                            placeholder="Introduce una breve descripción de la apertura"
                        ></Input>
                    </div>
                </div>
                <div class="flex flex-col">
                    <!-- Nombre de la apertura -->
                    <label class="font-medium">Posición de referencia</label>
                    <span class="mb-2 text-sm text-gray-700/80 italic text-justify">
                        Posición de que se mostrara en el listado de aperturas. Efectue movimientos para cambiar la
                        posición.</span
                    >
                    <div class="flex justify-center">
                        <ChessBoard class="w-1/2" v-model="form.fen" />
                    </div>
                </div>
                {{ form }}
            </div>
        </template>

        <!-- FOOTER -->
        <template #footer>
            <div class="flex justify-end gap-3">
                <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300" @click="show = false">
                    Cancelar
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
                    :disabled="loading"
                    @click="emit('confirm', form)"
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
    import { ref, watch, defineEmits, defineProps, reactive } from 'vue'
    import BaseModal from '@/components/common/BaseModal.vue'
    import Input from '@/components/common/Input.vue'

    import ChessBoard from '@/components/shared/ChessBoardRenderer.vue'
    import { INITIAL_FEN } from '@/utils/chess'

    const props = defineProps({
        modelValue: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:modelValue', 'confirm'])

    const show = ref(props.modelValue)
    const form = reactive({
        name: '',
        fen: INITIAL_FEN,
    })

    // Sync con el v-model externo
    watch(
        () => props.modelValue,
        (val) => (show.value = val),
    )
    watch(show, (val) => emit('update:modelValue', val))
</script>
