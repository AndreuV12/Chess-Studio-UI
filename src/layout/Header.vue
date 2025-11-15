<template>
    <header class="card rounded-lg shadow-sm bg-white text-stone-700 p-2">
        <div class="flex justify-between items-center lg:mx-2">
            <button class="btn btn-sm btn-ghost" @click="$emit('toggle')" v-tooltip="'open menu'">
                <Menu class="w-5 h-5"></Menu>
            </button>
            <div class="relative" v-click-outside="() => (open = false)">
                <button
                    @click="open = !open"
                    class="flex items-center justify-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                    <CircleUser class="w-8 h-8 text-gray-700" />
                </button>

                <ul
                    v-if="open"
                    class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-200 py-2 z-50"
                >
                    <li class="px-4 py-2 flex items-center gap-2 cursor-default">
                        <User class="w-5 h-5 text-gray-600" />
                        <span class="font-medium text-gray-800">
                            {{ auth.user?.name || auth.user?.email || 'Usuario' }}
                        </span>
                    </li>

                    <li>
                        <button
                            @click="handleLogout"
                            class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2"
                        >
                            <LogOut class="w-5 h-5" />
                            <span>Cerrar sesión</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    import { useAuthStore } from '@/stores/auth'

    import { Menu, User, CircleUser, LogOut } from 'lucide-vue-next'

    defineEmits(['toggle'])

    const auth = useAuthStore()

    const router = useRouter()

    const open = ref(false)

    const handleLogout = () => {
        auth.clearStore()
        router.push('/login')
    }
</script>
