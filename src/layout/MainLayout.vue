<template>
    <div class="h-screen flex rounded-xl">
        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-y-auto">
            <!-- Header -->
            <Header
                class="bg-white shadow-sm rounded-lg"
                :class="[
                    (deviceType == 'mobile' || deviceType == 'tablet') && 'm-2 p-2',
                    deviceType == 'desktop' && 'm-4 p-4',
                ]"
            ></Header>

            <!-- Page content -->
            <main
                class="bg-white shadow-sm rounded-lg mt-0 mb-[100px]"
                :class="[
                    (deviceType == 'mobile' || deviceType == 'tablet') && 'mx-2 p-2',
                    deviceType == 'desktop' && 'mx-4 p-4',
                ]"
            >
                <p>Modo actual: {{ deviceType }}</p>
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import Header from '@/layout/Header.vue'

    // ---- Detectar tipo de dispositivo según ancho ----
    const deviceType = ref('desktop')

    function updateDeviceType() {
        const width = window.innerWidth
        if (width < 768) {
            deviceType.value = 'mobile'
        } else if (width < 1024) {
            deviceType.value = 'tablet'
        } else {
            deviceType.value = 'desktop'
        }
    }

    // Ejecutar al montar
    onMounted(() => {
        updateDeviceType()
        window.addEventListener('resize', updateDeviceType)
    })

    // Limpiar evento
    onBeforeUnmount(() => {
        window.removeEventListener('resize', updateDeviceType)
    })
</script>
