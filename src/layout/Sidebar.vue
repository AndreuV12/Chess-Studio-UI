<!-- src/components/Sidebar.vue -->
<template>
    <div class="shadow bg-base-100 transition-all duration-300 z-120 text-black">
        <div class="flex items-center justify-between py-4 h-[100px]">
            <div class="flex-1 flex justify-center">
                <RouterLink to="/">
                    <template v-if="authStore.activeCompany?.logo">
                        <img class="w-40" :src="'/logo/' + authStore.activeCompany?.logo" alt="Logo" />
                    </template>
                    <template v-else>
                        <p>Sin logo asignado</p>
                    </template>
                </RouterLink>
            </div>
        </div>

        <nav class="flex-1 overflow-y-visible">
            <ul>
                <li v-for="item in menu" :key="item.label" class="rounded-lg hover:bg-gray-100 mx-2 my-1">
                    <RouterLink
                        :to="item.path"
                        class="flex items-center gap-2 px-2 py-1 rounded text-base transition overflow-visible"
                    >
                        <div class="tooltip tooltip-right text-sm">
                            <component :is="item.icon" class="w-6 h-6 mx-1" />
                        </div>
                        <span :class="route.path === item.path ? 'font-bold' : 'font-medium'" class="pt-1 pe-1">
                            {{ item.label }}
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
    const props = defineProps({
        sidebarOpen: {
            type: Boolean,
            default: false,
        },
    })
    defineEmits(['toggle'])

    import { reactive } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const authStore = useAuthStore()

    import { House, LayoutDashboard, Map, Clipboard } from 'lucide-vue-next'

    const route = useRoute()

    const menu = reactive([
        {
            label: 'Galeria',
            path: '/',
            icon: House,
        },
        {
            label: 'Editor',
            path: '/openings',
            icon: LayoutDashboard,
            children: [],
        },
    ])
</script>
