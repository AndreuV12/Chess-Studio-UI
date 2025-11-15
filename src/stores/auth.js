import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },

        setUser(user) {
            this.user = user
        },

        clearStore() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },
    },
})
