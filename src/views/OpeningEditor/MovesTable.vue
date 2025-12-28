<template>
    <div class="flex-1 flex flex-col justify-between">
        <div>
            <h2 class="text-md font-semibold ms-2">Movimientos Guardados</h2>
            <div
                v-for="move in currentAvailableMoves"
                :key="move.id"
                @click="emit('moveClicked', move)"
                class="h-20 bg-white border border-gray-300 shadow-sm rounded-lg m-2 p-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
                <div class="flex-1 font-bold text-lg p-2">
                    {{ move.san }}
                </div>
                <div>
                    <Trash2
                        class="w-8 h-8 p-2 rounded-full hover:text-red-600 hover:bg-red-100"
                        @click.stop="emit('deleteMove', move)"
                    ></Trash2>
                </div>
            </div>
        </div>
        <div>
            <h2 class="text-md font-semibold ms-2">Mejores Movimientos</h2>
            <div
                v-for="move in analysis.result"
                :key="move.id"
                @click="emit('moveClicked', move)"
                class="h-20 bg-white border border-gray-300 shadow-sm rounded-lg m-2 p-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
                <div class="flex-1 font-bold text-lg p-2">
                    <div class="flex gap-2 align-bottom">
                        <span>{{ move.pv[0] }}</span>
                        <span class="text-gray-500 text-sm mx-1 mt-1"> {{ move.pv.slice(1).join(', ') }}... </span>
                    </div>

                    <div>
                        <span class="text-gray-900 text-lg"> {{ formatScore(move.score) }} </span>
                    </div>
                </div>
                <div>
                    <Trash2
                        class="w-8 h-8 p-2 rounded-full hover:text-red-600 hover:bg-red-100"
                        @click.stop="emit('deleteMove', move)"
                    ></Trash2>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import { Trash2 } from 'lucide-vue-next'
    import { formatScore } from '@/utils/chess'
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
        analysis: {
            type: Object,
            default: () => {},
        },
    })

    const emit = defineEmits(['moveClicked', 'deleteMove'])

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

    const lastMove = computed(() => props.path[props.path.length - 1])

    const currentAvailableMoves = computed(() => {
        const key = lastMove.value?.id || 'initial'
        return parentMovesMapping.value[key]
    })
</script>
