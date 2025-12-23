import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import OpeningsPage from '@/views/Openings/OpeningsPage.vue'
import OpeningEditorPage from '@/views/OpeningEditor/OpeningEditorPage.vue'

const routes = [
    // Rutas que usan el layout
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'login', name: 'Login', component: Login },
            { path: '', name: 'Home', component: OpeningsPage },
            { path: 'openings/:id', name: 'OpeningEditor', component: OpeningEditorPage },
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
