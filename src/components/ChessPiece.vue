<template>
    <div class="w-12 h-12">
        <img v-if="src" :src="src" :alt="piece" class="w-full h-full" />
    </div>
</template>

<script setup>
    const props = defineProps({
        piece: { type: String, required: true },
    })

    // Mapa de símbolos a rutas de imágenes
    const pieceMap = {
        K: '/src/assets/pieces/white-king.svg',
        Q: '/src/assets/pieces/white-queen.svg',
        R: '/src/assets/pieces/white-rook.svg',
        B: '/src/assets/pieces/white-bishop.svg',
        N: '/src/assets/pieces/white-knight.svg',
        P: '/src/assets/pieces/white-pawn.svg',
        k: '/src/assets/pieces/black-king.svg',
        q: '/src/assets/pieces/black-queen.svg',
        r: '/src/assets/pieces/black-rook.svg',
        b: '/src/assets/pieces/black-bishop.svg',
        n: '/src/assets/pieces/black-knight.svg',
        p: '/src/assets/pieces/black-pawn.svg',
    }

    // Ruta de la imagen según la pieza
    const src = pieceMap[props.piece] || null
</script>
