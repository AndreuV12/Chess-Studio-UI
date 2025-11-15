<template>
    <aside class="sidebar p-4" v-if="showNormalSidebar || showReducedSidebar">
        <!-- Imagen superior -->

        <div class="mb-6 flex flex-col items-center gap-2 py-2">
            <img
                :src="logo"
                alt="Logo"
                class="rounded-full bg-white p-2"
                :class="showNormalSidebar ? 'w-22 h-22' : 'w-12 h-12'"
            />
            <h2 v-if="showNormalSidebar" class="text-black font-bold">{{ projectName }}</h2>
        </div>

        <!-- Secciones -->
        <div v-for="(section, index) in sidebarData" :key="index" class="mb-6 flex flex-col">
            <span v-if="showNormalSidebar" class="text-black font-bold text-sm p-4">{{ section.title }}</span>
            <ul>
                <li
                    v-for="(link, i) in section.links"
                    :key="i"
                    class="mb-1 flex items-center"
                    :class="showReducedSidebar ? 'justify-center' : ''"
                >
                    <router-link :to="link.path">
                        <!-- Icono -->
                        <div class="flex items-center rounded-lg hover:bg-gray-200 px-2">
                            <component :is="link.icon" class="w-6 h-6 m-2" />
                            <span v-if="showNormalSidebar" class="me-2"> {{ link.label }}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup>
    import { Home, User, Settings, HelpCircle, TextCursor, ChevronsUpDown } from 'lucide-vue-next'
    import logo from '@/assets/logo.png'

    import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false,
        },
    })

    const emit = defineEmits(['update:modelValue'])

    const projectName = 'Mi Portafolio'
    const sidebarData = [
        {
            title: 'Personal',
            links: [
                { label: 'Inicio', path: '/', icon: Home },
                { label: 'Sobre mi', path: '/about', icon: User },
                { label: 'Contacto', path: '/contact', icon: User },
            ],
        },
        {
            title: 'Componentes',
            links: [
                { label: 'Input', path: '/components/input', icon: TextCursor },
                { label: 'Select', path: '/components/select', icon: ChevronsUpDown },
            ],
        },
    ]

    const breakpoint = 768
    const windowWith = ref(window.innerWidth)

    const isMobile = computed(() => windowWith.value < breakpoint)
    const isCollapsed = ref(props.modelValue)

    const showNormalSidebar = computed(() => !isMobile.value && !isCollapsed.value)
    const showReducedSidebar = computed(() => isMobile.value || isCollapsed.value)

    // Abrir cerrar desde el padre
    watch(
        () => props.modelValue,
        (val) => {
            isCollapsed.value = val
        },
    )

    // Notificar cambios de estado al padre
    watch(isMobile, (val) => {
        // Abrir cerrar al redimensionar
        if (val) {
            isCollapsed.value = true
        } else {
            isCollapsed.value = false
        }
    })

    watch(isCollapsed, (val) => {
        emit('update:modelValue', val)
    })

    onMounted(() => {
        if (isMobile.value) {
            isCollapsed.value = true
        }
        window.addEventListener('resize', () => {
            windowWith.value = window.innerWidth
        })
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize')
    })
</script>
