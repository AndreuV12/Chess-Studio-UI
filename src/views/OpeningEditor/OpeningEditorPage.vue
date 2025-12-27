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
                <EvalBar :evaluation="analysis.result?.[0]?.score" :rotated="opening.color == 'black'" />
                <ChessBoard
                    :fen="fen"
                    :lastMove="lastMove?.uci"
                    :rotated="opening.color == 'black'"
                    @move="handleUciMoveFromBoard"
                    class="h-160"
                />
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
                    <div v-if="!analysis.loading">
                        <pre>{{ analysis?.result }}</pre>
                    </div>
                    <div v-else>Calculando</div>
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
    const analysis = reactive({
        result: null,
        loading: false,
    })

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
    const handleUciMoveFromBoard = async (moveUci) => {
        const mappingKey = lastMove.value ? lastMove.value.id : 'initial'
        let move = parentMovesMapping.value[mappingKey]?.find((move) => move.uci == moveUci)
        if (!move) {
            move = await openings_api.addMove(opening.id, { uci: moveUci, prev_move_id: lastMove.value?.id })
            if (!parentMovesMapping.value[mappingKey]) {
                parentMovesMapping.value[mappingKey] = []
            }
            parentMovesMapping.value[mappingKey].push(move)
            opening.moves.push(move)
        }
        playedMoves.value.push(move)
        lastMove.value = move
    }

    const handleMoveClicked = (move) => {
        lastMove.value = move
    }

    watch(fen, async (fen) => {
        if (!fen) return

        try {
            console.log('analisis start:')
            analysis.loading = true
            analysis.value = 'Analizando...'
            const result = await engine.analyze(fen)
            console.log('analisis end:', result)
            analysis.result = result
        } catch (e) {
            console.error(e)
        } finally {
            analysis.loading = false
        }
    })

    // --- Cargar apertura ---
    onMounted(async () => {
        const id = route.params.id
        const res = await openings_api.getById(id)
        Object.assign(opening, res)
        console.log(opening)
        await engine.init()
    })
</script>
