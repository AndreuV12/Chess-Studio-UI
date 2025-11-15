<template>
    <header class="flex justify-between items-center">
        <div class="flex flex-col items-center">
            <img :src="logo" alt="Logo" class="rounded-full bg-white" :class="'w-8 h-8'" />
            <h2 v-if="showNormalSidebar" class="text-black font-bold">{{ projectName }}</h2>
        </div>
        <CircleUser class="w-8 h-8"></CircleUser>
    </header>
</template>

<script setup>
    import { Menu, CircleUser } from 'lucide-vue-next'
    import logo from '@/assets/logo.png'

    defineProps({
        collapsed: {
            type: Boolean,
            default: false,
        },
    })
    const emit = defineEmits(['toggle-sidebar'])
</script>
