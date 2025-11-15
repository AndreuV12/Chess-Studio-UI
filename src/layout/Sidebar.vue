<!-- src/components/Sidebar.vue -->
<template>
    <div class="shadow bg-base-100 transition-all duration-300 z-120">
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
            <ul :class="['space-y-6 px-4', sidebarOpen ? '' : 'flex flex-col items-center']">
                <li
                    v-for="item in menu"
                    :key="item.label"
                    :class="sidebarOpen ? '' : 'flex flex-col items-center gap-2'"
                >
                    <template>
                        <div v-if="sidebarOpen" class="px-2 uppercase text-gray-400 mb-1 text-[13px]">
                            {{ item.label }}
                        </div>
                        <i v-else class="fa-solid fa-ellipsis text-gray-300"></i>

                        <ul class="space-y-1">
                            <li
                                v-for="sub in item.children"
                                :key="sub.label"
                                class="py-1 px-0 rounded-lg hover:bg-slate-50"
                                :class="route.path === sub.path ? 'bg-gray-50' : ''"
                            >
                                <RouterLink
                                    :to="sub.path"
                                    class="flex items-center gap-2 px-2 py-1 rounded text-base transition overflow-visible"
                                >
                                    <div class="tooltip tooltip-right text-sm" :data-tip="sidebarOpen ? '' : sub.label">
                                        <component :is="sub.icon" class="w-6 h-6 mx-1" />
                                    </div>
                                    <span
                                        v-if="sidebarOpen"
                                        :class="route.path === sub.path ? 'font-bold' : 'font-medium'"
                                        class="pt-1 pe-1"
                                    >
                                        {{ sub.label }}
                                    </span>
                                </RouterLink>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
    defineProps(['sidebarOpen'])
    defineEmits(['toggle'])

    import { reactive } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const authStore = useAuthStore()

    import { House, LayoutDashboard, Map, Clipboard } from 'lucide-vue-next'

    const route = useRoute()

    // Permission can be declard on items and children
    // When no permission is set, will be accessibe
    // When no children is accessible, item will be hidden

    const menu = reactive([
        {
            label: null,
            children: [
                {
                    label: 'Inicio',
                    path: '/',
                    icon: House,
                },
                {
                    label: 'Dashboard',
                    path: '/dashboard',
                    icon: LayoutDashboard,
                },
                {
                    label: 'Monitoreo',
                    path: '/monitoring',
                    icon: Map,
                },
                {
                    label: 'Reportes',
                    path: '/reports',
                    icon: Clipboard,
                },
            ],
        },
    ])
</script>
