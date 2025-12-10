<template>
    <div class="border-4 border-gray-700 rounded-lg flex flex-wrap aspect-square">
        <div
            v-for="(square, index) in squares"
            :key="square"
            :class="['h-1/8 w-1/8', getSquareColor(square, index)]"
            @click="handleClick(square)"
        >
            <ChessPiece v-if="board[square]" :piece="board[square]" class="w-full h-full" />
        </div>
    </div>
</template>

<script setup>
    import { computed, watch } from 'vue'
    import ChessPiece from './ChessPiece.vue'
    import { getBoardFromFEN, INITIAL_FEN } from '@/utils/chess.js'

    const props = defineProps({
        fen: { type: String, default: INITIAL_FEN },
        interactive: { type: Boolean, default: false },
        selected: { type: String, default: null },
        lastMoved: { type: Array, default: () => [] }, // puede ser 1 o 2 casillas
    })

    const emit = defineEmits(['move'])

    const board = computed(() => getBoardFromFEN(props.fen))

    // Generar casillas A8-H1
    const squares = computed(() => {
        const rows = '87654321'.split('')
        const cols = 'ABCDEFGH'.split('')
        return rows.flatMap((r) => cols.map((c) => c + r))
    })

    function getSquareColor(square, index) {
        const row = Math.floor(index / 8)
        const col = index % 8
        const isLight = (row + col) % 2 === 0

        // Colores base
        const lightColor = 'bg-orange-200/80'
        const darkColor = 'bg-orange-800/80'

        // Colores seleccionados
        const selectedLight = 'bg-yellow-300/80'
        const selectedDark = 'bg-yellow-600/80'

        // Colores último movimiento
        const lastMovedLight = 'bg-orange-300'
        const lastMovedDark = 'bg-amber-700/80'

        if (square === props.selected) {
            return isLight ? selectedLight : selectedDark
        } else if (props.lastMoved.includes(square)) {
            return isLight ? lastMovedLight : lastMovedDark
        } else {
            return isLight ? lightColor : darkColor
        }
    }

    function handleClick(square) {
        if (!props.interactive) return

        // Solo emitir si hay selección previa o si la casilla tiene pieza
        if (props.selected) {
            emit('move', { from: props.selected, to: square })
        } else if (board.value[square]) {
            emit('move', { from: square, to: null })
        }
    }
</script>
