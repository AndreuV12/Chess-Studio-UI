<template>
    <div class="inline-block border-4 border-gray-700 rounded-lg overflow-hidden select-none">
        <div class="grid grid-cols-8">
            <div
                v-for="(square, index) in squares"
                :key="square"
                :class="[
                    'w-14 h-14 flex items-center justify-center relative transition-colors',
                    getSquareColor(index),
                    isSelected(square) ? 'ring-4 ring-yellow-400' : '',
                    interactive ? 'cursor-pointer' : '',
                ]"
                @click="handleClick(square)"
            >
                <ChessPiece v-if="board[square]" :piece="board[square]" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from 'vue'
    import ChessPiece from './ChessPiece.vue'
    import { getBoardFromFEN } from '@/utils/chess.js'

    const props = defineProps({
        fen: { type: String, required: false },
        interactive: { type: Boolean, default: false },
    })

    const emit = defineEmits(['move'])

    const selected = ref(null)
    const board = ref({})

    // Generar casillas A8-H1
    const squares = computed(() => {
        const rows = '87654321'.split('')
        const cols = 'ABCDEFGH'.split('')
        return rows.flatMap((r) => cols.map((c) => c + r))
    })

    // Actualizar el tablero cuando cambia el FEN
    watch(
        () => props.fen,
        (newFen) => {
            board.value = getBoardFromFEN(newFen)
        },
        { immediate: true },
    )

    function getSquareColor(i) {
        const row = Math.floor(i / 8)
        const col = i % 8
        return (row + col) % 2 === 0 ? 'bg-amber-200' : 'bg-green-600'
    }

    function handleClick(square) {
        if (!props.interactive) return

        if (selected.value) {
            // Emitir movimiento al padre
            emit('move', { from: selected.value, to: square })
            selected.value = null
        } else if (board.value[square]) {
            // Seleccionar pieza si hay una
            selected.value = square
        }
    }

    function isSelected(square) {
        return selected.value === square
    }
</script>
