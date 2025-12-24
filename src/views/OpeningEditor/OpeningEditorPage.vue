<template>
    <div class="flex flex-col gap-8 px-2">
        <div class="flex justify-between items-end flex-wrap">
            <div class="flex flex-col gap-2">
                <h1 class="text-2xl font-semibold">Editor de apertura</h1>
                <h2>Explora y edita tus aperturas de ajedrez</h2>
                <h3 class="text-lg font-bold text-gray-700/80 italic">{{ opening.name }}</h3>
            </div>
        </div>

        <div class="flex gap-4">
            <div class="flex gap-2">
                <EvalBar :evaluation="analysisResult?.[0]?.score" rotated />
                <ChessBoard :fen="fen" @move="handleUciMoveFromBoard" class="h-160" />
            </div>

            <div class="bg-white rounded-lg border border-gray-200 shadow-md p-2 flex-1 overflow-y-auto h-160">
                <span class="font-semibold">Movimientos</span>

                <!-- <div class="flex flex-col gap-2">
                    <div
                        v-for="move of availableMoves"
                        :key="move.id"
                        @click="handleMoveClicked(move)"
                        class="cursor-pointer hover:bg-gray-100 rounded p-1"
                    >
                        <span>{{ move.uci }}</span>
                    </div>
                </div> -->

                <div class="mt-4">
                    <span class="font-semibold">Análisis:</span>
                    <div v-if="analysisResult">
                        <pre>{{ analysisResult }}</pre>
                    </div>
                    <div v-else>Sin análisis</div>
                </div>
            </div>
        </div>
        <MoveNavigator :moves="opening.moves" :path="playedMoves" @moveClicked="handleMoveClicked"> </MoveNavigator>
    </div>
</template>

<script setup>
    import { reactive, computed, onMounted, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { openings_api } from '@/api'
    import ChessBoard from '@/components/shared/ChessBoard.vue'
    import { INITIAL_FEN } from '@/utils/chess'

    // Importamos tu clase Stockfish
    import { StockfishEngine } from '@/utils/_stockfish'
    import EvalBar from '@/components/shared/EvalBar.vue'
    import MoveNavigator from './MoveNavigator.vue'

    const route = useRoute()

    // --- Datos de la apertura ---

    const opening = reactive({})
    const lastMove = ref(null)

    const playedMoves = computed(() => {
        if (!lastMove.value) return []

        const path = []
        let current = lastMove.value

        // recorremos hacia atrás
        while (current) {
            path.unshift(current) // añadimos al inicio para mantener orden
            current = opening.moves.find((m) => m.id === current.prev_move_id)
        }

        return path
    })

    const fen = computed(() => {
        if (!lastMove.value) return INITIAL_FEN
        return lastMove.value.fen_after
    })

    // --- Stockfish ---
    const engine = new StockfishEngine()
    const analysisResult = ref(null)

    // ---Helper Moves Mapping ---
    const parentMovesMapping = computed(() => {
        const map = {}
        if (!opening.moves) return {}
        opening.moves.forEach((move) => {
            const key = move.prev_move_id || 'initial'
            if (!map[key]) map[key] = []
            map[key].push(move)
        })
        return map
    })

    // Click en movimiento
    const handleUciMoveFromBoard = (moveUci) => {
        if (!lastMove.value) {
            // First move
            const move = parentMovesMapping.value['initial'].find((move) => move.uci == moveUci)

            if (move) {
                playedMoves.value.push(move)
                currentFEN.value = move.fen_after
            } else {
                alert('Movimiento no disponible')
            }
        } else {
            parentMovesMapping.value[lastMove.value.id].find((move) => {
                if (move.uci === moveUci) {
                    playedMoves.value.push(move)
                    currentFEN.value = move.fen_after
                }
            })
        }
        // playedMoves.value.push(move)
        // currentFEN.value = move.fen_after
    }

    const handleMoveClicked = (move) => {
        lastMove.value = move
    }

    // --- Watch FEN y pedir análisis ---
    watch(fen, async (fen) => {
        if (!fen) return
        analysisResult.value = 'Calculando...'
        const result = await engine.analyze(fen)
        analysisResult.value = result
    })

    // --- Cargar apertura ---
    onMounted(async () => {
        await engine.init()
        const id = route.params.id
        const res = await openings_api.getById(id)
        Object.assign(opening, res)
        console.log(opening)
    })
</script>
