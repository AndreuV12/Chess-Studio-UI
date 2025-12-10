<template>
    <router-view></router-view>
    <!-- <ErrorModal v-model="ui.errorModal.show" :title="ui.errorModal.title" :message="ui.errorModal.message" />
    <ActionModal
        v-model="ui.actionModal.show"
        :title="ui.actionModal.title"
        :message="ui.actionModal.message"
        :loading="ui.actionModal.loading"
        :type="ui.actionModal.type"
        @confirm="ui.actionModal.confirm"
    /> -->
    <Toast
        v-model="ui.toast.show"
        :message="ui.toast.message"
        :type="ui.toast.type"
        :duration="ui.toast.duration"
    ></Toast>
</template>

<script setup>
    import Toast from '@/components/common/Toast.vue'
    import { useUiStore } from '@/stores/ui'
    const ui = useUiStore()
</script>
