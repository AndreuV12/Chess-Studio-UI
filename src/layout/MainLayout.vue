<template>
    <div class="min-h-screen flex relative">
        <!-- Sidebar -->
        <Sidebar
            :sidebarOpen="sidebarOpen"
            @toggle="toggleSidebar"
            :class="[
                'fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ]"
        />

        <!-- Overlay -->
        <div v-if="sidebarOpen" class="fixed inset-0 bg-black opacity-30 z-30" @click="toggleSidebar"></div>

        <!-- Contenido principal -->
        <div class="flex flex-col flex-1 min-w-0 mx-2 sm:mx-4">
            <Header class="my-2 sm:my-3" @toggle="toggleSidebar"></Header>
            <main class="flex-1 mb-4 overflow-y-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import Sidebar from '@/layout/Sidebar.vue'
    import Header from '@/layout/Header.vue'

    const sidebarOpen = ref(false)

    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value
    }
</script>
