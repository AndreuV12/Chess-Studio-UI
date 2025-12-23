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
            <ChessBoard v-model:fen="currentFEN" class="w-120" />

            <div class="bg-white rounded-lg border border-gray-200 shadow-md p-2 flex-1 overflow-y-auto max-h-140">
                <span class="font-semibold">Movimientos</span>

                <div class="flex flex-col gap-2">
                    <div
                        v-for="move of availableMoves"
                        :key="move.id"
                        @click="handleMoveClicked(move)"
                        class="cursor-pointer hover:bg-gray-100 rounded p-1"
                    >
                        <span>{{ move.uci }}</span>
                    </div>
                </div>

                <div class="mt-4">
                    <span class="font-semibold">Análisis:</span>
                    <div v-if="analysisResult">
                        <pre>{{ analysisResult }}</pre>
                    </div>
                    <div v-else>Sin análisis</div>
                </div>
            </div>
        </div>

        last move: {{ lastMove }}
        <pre>{{ movesMapping }}</pre>
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

    const engine = new StockfishEngine()

    const analysisResult = ref(null)

    // --- Datos de la apertura ---
    const route = useRoute()
    const opening = reactive({})
    const playedMoves = ref([])

    // --- Moves Mapping ---
    const movesMapping = computed(() => {
        const map = {}
        if (!opening.moves) return {}
        opening.moves.forEach((move) => {
            const key = move.prev_move_id || 'initial'
            if (!map[key]) map[key] = []
            map[key].push(move)
        })
        return map
    })

    const lastMove = computed(() => playedMoves.value[playedMoves.value.length - 1])
    const availableMoves = computed(() => {
        const key = lastMove.value ? lastMove.value.id : 'initial'
        return movesMapping.value[key]
    })

    // Ahora será reactivo y controlado por un v-model desde fuera si quieres
    const currentFEN = ref(INITIAL_FEN)

    // Click en movimiento
    const handleMoveClicked = (move) => {
        playedMoves.value.push(move)
        currentFEN.value = move.fen_after
    }

    // --- Watch FEN y pedir análisis ---
    watch(currentFEN, async (fen) => {
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
    })
</script>
