<template>
    <header class="card shadow-sm bg-base-100 text-stone-700">
        <div class="card-body p-2">
            <div class="flex justify-between items-center lg:mx-2">
                <!-- Menú desplegable DaisyUI -->
                <button class="btn btn-sm btn-ghost" @click="$emit('toggle')">
                    <Menu class="w-5 h-5"></Menu>
                </button>

                <div class="flex items-center gap-2">
                    <!-- 👤 Menú usuario -->
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <CircleUser class="w-10 h-10 py-1"></CircleUser>
                        </div>
                        <ul
                            tabindex="0"
                            class="mt-1 -mr-2 z-1 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-42 border border-gray-300"
                        >
                            <li>
                                <div class="hover:bg-transparent cursor-auto">
                                    <User class="w-5 h-5"></User>
                                    <span class="font-medium">
                                        {{ auth.user?.name || auth.user?.email || 'Usuario' }}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div class="hover:bg-transparent cursor-auto">
                                    <Building class="w-5 h-5" />
                                    <span class="font-medium">
                                        {{ auth.activeCompany?.name || 'Empresa' }}
                                    </span>
                                </div>
                            </li>
                            <li v-if="auth.companies?.length > 1">
                                <a @click="router.push('/select-company')">
                                    <Repeat class="w-5 h-5" />
                                    Seleccionar empresa
                                </a>
                            </li>
                            <li>
                                <a class="text-red-600" @click="handleLogout">
                                    <LogOut class="w-5 h-5"></LogOut>
                                    Cerrar sesión
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
    import { useRouter } from 'vue-router'

    import { useAuthStore } from '@/stores/auth'

    import { Menu, User, CircleUser, LogOut, Repeat, Building, Languages } from 'lucide-vue-next'

    defineEmits(['toggle'])

    const auth = useAuthStore()

    const router = useRouter()

    const handleLogout = () => {
        auth.clearStore()
        router.push('/login')
    }
</script>
