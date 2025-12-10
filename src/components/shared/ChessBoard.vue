<!-- src/components/chess/ChessBoard.vue -->
<template>
    <ChessBoardRenderer
        :fen="localFEN"
        :selected="selectedSquare"
        :lastMoved="lastMove"
        :interactive="true"
        @click="handleClick"
    />
</template>

<script setup>
    import { ref, watch, defineEmits, defineProps } from 'vue'
    import ChessBoardRenderer from './ChessBoardRenderer.vue'
    import { makeMove, getLegalMoves, INITIAL_FEN } from '@/utils/chess.js'

    const props = defineProps({
        modelValue: { type: String, default: INITIAL_FEN }, // v-model:fen
    })
    const emit = defineEmits(['update:modelValue'])

    const localFEN = ref(props.modelValue)
    const selectedSquare = ref(null)
    const lastMove = ref([])

    // Mantener sincronización con v-model externo
    watch(
        () => props.modelValue,
        (val) => {
            if (val !== localFEN.value) localFEN.value = val
        },
    )
    watch(localFEN, (val) => emit('update:model-value', val))

    function handleClick(square) {
        const legalMoves = getLegalMoves(localFEN.value)

        // Si no hay pieza seleccionada
        if (!selectedSquare.value) {
            if (!legalMoves[square]) return // No hay pieza en esa casilla → nada que hacer
            selectedSquare.value = square
            return
        }

        // Si hay una pieza seleccionada
        const from = selectedSquare.value
        const possible = legalMoves[from] || []

        if (!possible.includes(square)) {
            // Movimiento ilegal → limpiar selección
            selectedSquare.value = null
            return
        }

        // Movimiento legal → aplicar
        localFEN.value = makeMove(localFEN.value, from, square)
        lastMove.value = [from, square]

        // Reset selección
        selectedSquare.value = null
    }
</script>
