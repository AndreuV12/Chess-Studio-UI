<template>
    <!-- Contenedor general (SIN overflow) -->
    <div class="relative flex items-center gap-2 bg-gray-100 border border-gray-300 py-1 rounded-sm">
        <div class="flex flex-wrap gap-2 px-2 h-full">
            <template v-for="(move, i) in internalPath" :key="move.id">
                <!-- Número de movimiento (solo blancas) -->

                <!-- Movimiento + variantes -->
                <div class="relative inline-flex flex-nowrap items-center gap-1 h-full shrink-0">
                    <span v-if="i % 2 === 0" class="text-gray-400 ml-2 py-1 shrink-0">
                        {{ Math.floor(i / 2) + 1 }}.
                    </span>
                    <!-- Movimiento activo -->
                    <span
                        v-if="move.id === path[path.length - 1]?.id"
                        class="bg-gray-200 rounded-lg px-2 py-1 font-semibold"
                    >
                        {{ move.san }}
                    </span>

                    <!-- Movimiento normal -->
                    <span
                        v-else
                        class="cursor-pointer hover:text-sorigue-primary px-1 py-1"
                        @click="handleMoveClicked(move)"
                    >
                        {{ move.san }}
                    </span>

                    <!-- Flecha (solo si hay variantes) -->
                    <Btn
                        v-if="hasVariants(move)"
                        @click.stop="toggleDropdown(move.id)"
                        v-click-outside="() => (openDropdown = null)"
                        icon-only
                        class="text-gray-500 hover:text-black mr-1"
                    >
                        <ChevronDown class="w-4 h-4" />
                    </Btn>

                    <!-- Dropdown de variantes -->
                    <div
                        v-if="openDropdown === move.id"
                        class="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-300 rounded shadow-lg"
                    >
                        <div
                            v-for="variant in getVariants(move)"
                            :key="variant.id"
                            class="px-3 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                            @click="selectVariant(move, variant)"
                        >
                            {{ variant.san }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import { ChevronDown } from 'lucide-vue-next'
    import Btn from '@/components/common/Btn.vue'

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

    const internalPath = ref([])
    const openDropdown = ref(null)

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

    const extendPathByDefault = (basePath) => {
        const result = [...basePath]
        let lastMove = result[result.length - 1]

        while (true) {
            const nextMoves = lastMove ? parentMovesMapping.value[lastMove.id] : parentMovesMapping.value['initial']

            if (!nextMoves?.length) break

            result.push(nextMoves[0])
            lastMove = nextMoves[0]
        }

        return result
    }

    const toggleDropdown = (moveId) => {
        openDropdown.value = openDropdown.value === moveId ? null : moveId
    }

    const getVariants = (move) => {
        return parentMovesMapping.value[move.prev_move_id] || []
    }

    const hasVariants = (move) => {
        return getVariants(move).length > 1
    }

    const selectVariant = (fromMove, selectedVariant) => {
        const index = internalPath.value.findIndex((m) => m.id === fromMove.id)
        const newBasePath = internalPath.value.slice(0, index)
        newBasePath.push(selectedVariant)
        internalPath.value = extendPathByDefault(newBasePath)
        emit('moveClicked', selectedVariant)
    }

    const handleMoveClicked = (move) => {
        emit('moveClicked', move)
    }

    watch(
        [() => props.path, () => props.moves],
        ([newPath, _moves]) => {
            internalPath.value = extendPathByDefault(newPath)
        },
        { immediate: true },
    )
</script>
