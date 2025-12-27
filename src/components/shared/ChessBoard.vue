<template>
    <ChessBoardRenderer
        :fen="localFEN"
        :selected="selectedSquare"
        :lastMoved="props.lastMove"
        :rotated="rotated"
        @square-click="handleClick"
    />
</template>

<script setup>
    import { ref, watch, computed } from 'vue'
    import ChessBoardRenderer from '@/components/shared/ChessBoardRenderer.vue'
    import { INITIAL_FEN, getLegalMoves, makeMove } from '@/utils/chess.js'

    const props = defineProps({
        fen: { type: String, default: INITIAL_FEN },
        lastMove: { type: String, default: null }, // UCI: e2e4
        rotated: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:fen', 'move'])

    const selectedSquare = ref(null)

    const localFEN = computed({
        get: () => props.fen,
        set: (val) => emit('update:fen', val),
    })

    function handleClick(square) {
        const legalMoves = getLegalMoves(localFEN.value)

        // Nada seleccionado todavía
        if (!selectedSquare.value) {
            if (!legalMoves[square]) return
            selectedSquare.value = square
            return
        }

        const from = selectedSquare.value
        const possible = legalMoves[from] || []

        // Click inválido → reset selección
        if (!possible.includes(square)) {
            selectedSquare.value = null
            return
        }

        // Movimiento legal
        const newFEN = makeMove(localFEN.value, from, square)
        const uciMove = (from + square).toLowerCase()

        localFEN.value = newFEN
        emit('move', uciMove)

        selectedSquare.value = null
    }

    watch(
        () => props.fen,
        () => {
            selectedSquare.value = null
        },
    )

    watch(
        () => props.lastMove,
        () => {
            selectedSquare.value = null
        },
    )
</script>
