<template>
    <ChessBoard interactive />
    <Button class="btn btn-create" @click="loading = !loading" :loading="loading">
        <Trash class="w-5 h-5" />
        Test del boto
    </Button>
</template>

<script setup>
    import { ref } from 'vue'
    import ChessBoard from '@/components/ChessBoard.vue'
    import Button from '@/components/common/Button.vue'
    import { Trash } from 'lucide-vue-next'

    const loading = ref(false)
</script>
