<template>
    <ChessBoard interactive />
    <Button class="btn btn-delete w-40" @click="loading = !loading" :loading="loading">
        <Trash class="w-5 h-5" />
        Eliminar
    </Button>
</template>

<script setup>
    import { ref } from 'vue'
    import ChessBoard from '@/components/ChessBoard.vue'
    import Button from '@/components/common/Button.vue'
    import { Trash } from 'lucide-vue-next'

    const loading = ref(false)
</script>
