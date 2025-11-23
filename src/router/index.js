import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import About from '@/views/About.vue'
import NotFound from '@/views/NotFound.vue'
import InputView from '@/views/InputView.vue'

const routes = [
    // Rutas que usan el layout
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            { path: 'login', name: 'Login', component: Login },
            { path: 'about', name: 'About', component: About },
            { path: 'components/input', name: 'Input', component: InputView },
            { path: 'components/select', name: 'Select', component: InputView },
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
