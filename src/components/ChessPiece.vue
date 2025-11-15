<template>
    <div class="text-3xl">
        {{ symbol }}
    </div>
</template>

<script setup>
    const props = defineProps({ piece: String })

    const symbols = {
        K: '♔',
        Q: '♕',
        R: '♖',
        B: '♗',
        N: '♘',
        P: '♙',
        k: '♚',
        q: '♛',
        r: '♜',
        b: '♝',
        n: '♞',
        p: '♟︎',
    }

    const symbol = symbols[props.piece] || ''
</script>
