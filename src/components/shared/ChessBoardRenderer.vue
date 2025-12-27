<template>
    <div class="border-4 border-gray-700 rounded-lg flex flex-wrap aspect-square">
        <div
            v-for="(square, index) in squares"
            :key="square"
            :class="['h-1/8 w-1/8', getSquareColor(square, index)]"
            @click="emit('square-click', square)"
        >
            <ChessPiece v-if="board[square]" :piece="board[square]" class="w-full h-full" />
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import ChessPiece from '@/components/shared/ChessPiece.vue'
    import { getBoardFromFEN, INITIAL_FEN } from '@/utils/chess.js'

    const props = defineProps({
        fen: { type: String, default: INITIAL_FEN },
        selected: { type: String, default: null },
        lastMoved: { type: String, default: null }, // UCI: e2e4
        rotated: { type: Boolean, default: false },
    })

    const emit = defineEmits(['square-click'])

    const board = computed(() => getBoardFromFEN(props.fen))

    // Generar casillas A8-H1
    const squares = computed(() => {
        const rows = '87654321'
        const cols = 'ABCDEFGH'

        return Array.from({ length: 8 }, (_, r) => r).flatMap((r) =>
            Array.from({ length: 8 }, (_, c) => {
                const rowIndex = props.rotated ? 7 - r : r
                const colIndex = props.rotated ? 7 - c : c
                return cols[colIndex] + rows[rowIndex]
            }),
        )
    })

    const lastMovedSquares = computed(() => {
        if (!props.lastMoved || props.lastMoved.length < 4) return []

        const from = props.lastMoved.slice(0, 2).toUpperCase()
        const to = props.lastMoved.slice(2, 4).toUpperCase()

        return [from, to]
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
        } else if (lastMovedSquares.value.includes(square)) {
            return isLight ? lastMovedLight : lastMovedDark
        } else {
            return isLight ? lightColor : darkColor
        }
    }
</script>
