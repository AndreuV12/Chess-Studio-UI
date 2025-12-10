<template>
    <form @submit.prevent="handleSubmit">
        <BaseModal v-model="show" class="w-3/4 md:w-1/2">
            <!-- HEADER -->
            <template #header>
                <h3 class="text-2xl font-semibold text-center">Crear apertura</h3>
            </template>

            <!-- BODY -->
            <template #body>
                <div class="flex flex-col gap-4">
                    <div>
                        <!-- Nombre de la apertura -->
                        <label class="font-medium required">Nombre de la apertura</label>
                        <div class="flex">
                            <Input
                                v-model="form.name"
                                class="flex flex-1"
                                placeholder="Introduce el nombre de la apertura"
                                clearable
                                required
                            ></Input>
                        </div>
                    </div>
                    <div>
                        <!-- Nombre de la apertura -->
                        <label class="font-medium">Descripción</label>
                        <div class="flex">
                            <Input
                                v-model="form.description"
                                class="flex flex-1"
                                placeholder="Introduce una breve descripción de la apertura"
                                clearable
                            ></Input>
                        </div>
                    </div>
                    <div>
                        <label class="font-medium">Color</label>
                        <div class="flex justify-center">
                            <Tabs
                                class="flex-1"
                                v-model="form.color"
                                :options="[
                                    {
                                        value: 'white',
                                        label: 'Blanco',
                                        icon: ChessPiece,
                                        iconProps: { piece: 'K' },
                                    },
                                    {
                                        value: 'black',
                                        label: 'Negro',
                                        icon: ChessPiece,
                                        iconProps: { piece: 'k' },
                                    },
                                ]"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <!-- Nombre de la apertura -->
                        <label class="font-medium">Posición de referencia</label>
                        <span class="mb-2 text-sm text-gray-700/80 italic text-justify">
                            Posición de que se mostrara en el listado de aperturas. Efectue movimientos para cambiar la
                            posición.</span
                        >
                        <div class="flex justify-center ms-12">
                            <ChessBoard
                                v-model:fen="form.fen"
                                :rotated="form.color == 'black'"
                                class="flex-1 max-w-100"
                            />
                            <div class="w-12">
                                <Btn iconOnly class="ms-2" @click="form.fen = INITIAL_FEN">
                                    <BrushCleaning class="w-4 h-4" />
                                </Btn>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- FOOTER -->
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Btn variant="default" @click="show = false">Cancelar</Btn>

                    <Btn variant="create" :loading="loading" type="submit"> Crear </Btn>
                </div>
            </template>
        </BaseModal>
    </form>
</template>

<script setup>
    import { ref, watch, defineEmits, defineProps, reactive } from 'vue'
    import BaseModal from '@/components/common/BaseModal.vue'
    import Input from '@/components/common/Input.vue'
    import Btn from '@/components/common/Btn.vue'
    import Tabs from '@/components/common/Tabs.vue'
    import ChessPiece from '@/components/shared/ChessPiece.vue'

    import { BrushCleaning } from 'lucide-vue-next'
    import ChessBoard from '@/components/shared/ChessBoard.vue'
    import { INITIAL_FEN } from '@/utils/chess'

    const props = defineProps({
        modelValue: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:modelValue', 'confirm'])

    const show = ref(props.modelValue)
    const form = reactive({
        name: null,
        description: null,
        fen: INITIAL_FEN,
        color: 'white',
    })

    function handleSubmit() {
        emit('confirm', form)
        console.log(form)
    }

    // Sync con el v-model externo
    watch(
        () => props.modelValue,
        (val) => (show.value = val),
    )
    watch(show, (val) => emit('update:modelValue', val))
</script>
