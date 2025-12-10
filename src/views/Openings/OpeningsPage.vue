<template>
    <div class="flex flex-col gap-8 px-2">
        <div class="flex justify-between items-end flex-wrap">
            <div class="flex flex-col gap-2">
                <h1 class="text-2xl font-semibold">Galeria de aperturas</h1>
                <h2>Explora y edita tus aperturas de ajedrez</h2>
            </div>
            <Btn variant="action" class="w-full sm:w-50" :loading="false" @click="createOpeningModal.show = true">
                Crear apertura</Btn
            >
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
                v-for="opening in gallery.openings"
                :key="opening.id"
                class="flex flex-col p-4 border-1 border-gray-200 bg-white rounded-lg shadow gap-2 cursor-pointer hover:shadow-lg hover:bg-gray-50"
                @click="goToOpening(opening.id)"
            >
                <span class="font-semibold">{{ opening.name }}</span>
                <ChessBoard :fen="opening.fen" :rotated="opening.color = 'black'" />
            </div>
        </div>
        <CreateOpeningModal
            v-model="createOpeningModal.show"
            :loading="createOpeningModal.loading"
            @confirm="createOpening"
        />
    </div>
</template>

<script setup>
    import { onMounted, reactive } from 'vue'
    import { openings_api } from '@/api'
    // import { makeMove, INITIAL_FEN } from '@/utils/chess.js'
    import ChessBoard from '@/components/shared/ChessBoardRenderer.vue'
    import Btn from '@/components/common/Btn.vue'

    import CreateOpeningModal from './CreateOpeningModal.vue'

    const gallery = reactive({
        openings: [],
        loading: false,
    })

    const createOpeningModal = reactive({
        show: false,
        loading: false,
    })

    async function createOpening(opening) {
        try {
            createOpeningModal.loading = true
            const newOpening = await openings_api.create(opening)
            gallery.openings.push(newOpening)
            createOpeningModal.show = false
        } catch (error) {
            console.error(error)
        } finally {
            createOpeningModal.loading = false
        }
    }
    onMounted(async () => {
        gallery.loading = true
        gallery.openings = await openings_api.get()
        gallery.loading = false
    })

    function goToOpening(id) {
        console.log(id)
    }
</script>
