import api from './axios'

export const auth_api = {
    async login({ username, password }) {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        const response = await api.post('/auth/login', formData)

        return response.data
    },

    async getUserCompanies() {
        const response = await api.get('/auth/companies') // Token needs to be setted on auth_store
        return response.data
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me') // Token needs to be setted on auth_store
        return response.data
    },
}
