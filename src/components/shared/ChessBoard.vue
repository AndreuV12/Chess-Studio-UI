<template>
    <ChessBoardRenderer
        :fen="localFEN"
        :selected="selectedSquare"
        :lastMoved="localLastMove"
        :rotated="rotated"
        @square-click="handleClick"
    />
</template>

<script setup>
    import { ref, watch, defineEmits, defineProps, computed } from 'vue'
    import ChessBoardRenderer from '@/components/shared/ChessBoardRenderer.vue'
    import { INITIAL_FEN, getLegalMoves, makeMove } from '@/utils/chess.js'

    const props = defineProps({
        fen: { type: String, default: INITIAL_FEN },
        lastMove: { type: Array, default: null },
        rotated: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:fen', 'update:lastMove', 'move'])

    const selectedSquare = ref(null)
    const localFEN = ref(props.fen)
    const internalLastMove = ref([])

    const localLastMove = computed(() => {
        return props.lastMove ?? internalLastMove.value
    })

    // Sync cuando cambian props externas
    watch(
        () => props.fen,
        (val) => {
            if (val !== localFEN.value) {
                localFEN.value = val
                // SI no viene lastmove cuando se cambia el FEN
                if (props.lastMove === null) internalLastMove.value = []
            }
        },
    )

    // Emitir cuando se hacen movimientos
    watch(localFEN, (val) => emit('update:fen', val))
    watch(internalLastMove, (val) => {
        if (props.lastMove === null) {
            emit('update:lastMove', val)
        }
    })

    function handleClick(square) {
        const legalMoves = getLegalMoves(localFEN.value)

        // Nada seleccionado
        if (!selectedSquare.value) {
            if (!legalMoves[square]) return
            selectedSquare.value = square
            return
        }

        const from = selectedSquare.value
        const possible = legalMoves[from] || []

        if (!possible.includes(square)) {
            selectedSquare.value = null
            return
        }

        // Movimiento legal
        localFEN.value = makeMove(localFEN.value, from, square)
        let uciMove = (from + square).toLowerCase()
        emit('move', uciMove)

        if (props.lastMove === null) {
            internalLastMove.value = [from, square]
        }

        selectedSquare.value = null
    }
</script>
