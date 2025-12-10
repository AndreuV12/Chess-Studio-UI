import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Openings from '@/views/Openings.vue'

const routes = [
    // Rutas que usan el layout
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'login', name: 'Login', component: Login },
            { path: '', name: 'Home', component: Openings },
            { path: 'openings/:id', name: 'Opening', component: Openings },
            // { path: 'openings', name: 'Openings', component: Openings },
        ],
    },
    // Rutas que van sin layout
    { path: '/404', name: 'NotFound', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
