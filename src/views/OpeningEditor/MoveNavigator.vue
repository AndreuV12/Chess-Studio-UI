<template>
    <div class="flex items-center gap-2 bg-gray-100 border border-gray-300 py-1 rounded-sm h-10">
        <div class="flex flex-wrap gap-1 px-2">
            <template v-for="(move, i) in showingMoves" :key="move.id">
                <!-- Mostramos el número de movimiento solo si es la jugada de las blancas -->
                <span v-if="i % 2 === 0" class="text-gray-400 ml-2 py-1"> {{ Math.floor(i / 2) + 1 }}. </span>

                <span
                    v-if="move.id === path[path.length - 1]?.id"
                    class="bg-gray-200 rounded-lg px-2 py-1 font-semibold"
                >
                    {{ move.uci }}
                </span>

                <span v-else class="cursor-pointer hover:text-sorigue-primary p-1" @click="handleMoveClicked(move)">
                    {{ move.uci }}
                </span>
            </template>
        </div>
    </div>
</template>
<script setup>
    import { ref, computed } from 'vue'
    const props = defineProps({
        moves: {
            // Array of full opening move objets
            type: Array,
            default: () => [],
        },
        path: {
            // Array of played move objets
            type: Array,
            default: [],
        },
    })

    const emit = defineEmits(['moveClicked'])

    const parentMovesMapping = computed(() => {
        const map = {}
        if (!props.moves) return {}
        props.moves.forEach((move) => {
            const key = move.prev_move_id || 'initial'
            if (!map[key]) map[key] = []
            map[key].push(move)
        })
        return map
    })

    const showingMoves = computed(() => {
        // Creamos un array nuevo para no mutar props
        const moves = [...props.path]

        // Tomamos el último move de la línea actual
        let lastMove = moves[moves.length - 1]

        while (true) {
            const nextAvailableMoves = lastMove
                ? parentMovesMapping.value[lastMove.id]
                : parentMovesMapping.value['initial']

            if (!nextAvailableMoves?.length) break
            const nextMove = nextAvailableMoves[0]
            moves.push(nextMove)
            lastMove = nextMove
        }

        return moves
    })

    const handleMoveClicked = (move) => {
        emit('moveClicked', move)
    }
</script>
