import api from './axios'

export const openings_api = {
    async get() {
        const response = await api.get('/openings')
        return response.data
    },

    async create({ name, description, fen, color }) {
        const response = await api.post('/openings', { name, description, fen, color })
        return response.data
    },
}
