<template>
    <div class="p-6 flex gap-4">
        <ChessBoard :fen="fen1" :interactive="true" selected="C7" :lastMoved="['D2', 'D4']" />
        <ChessBoard :fen="fen2" :interactive="true" selected="C2" :lastMoved="['D7', 'D5']" />
    </div>
</template>

<script setup>
    import { makeMove, INITIAL_FEN } from '@/utils/chess.js'
    import ChessBoard from '@/components/shared/ChessBoardRenderer.vue'

    let fen = INITIAL_FEN

    // Mover peón blanco de D2 a D4
    const fen1 = makeMove(fen, 'D2', 'D4')

    // Mover peón negro de D7 a D5
    const fen2 = makeMove(fen1, 'D7', 'D5')
</script>
