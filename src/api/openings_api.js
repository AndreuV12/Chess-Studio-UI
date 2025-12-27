import api from './axios'

export const openings_api = {
    async getList() {
        const response = await api.get('/openings')
        return response.data
    },

    async create({ name, description, fen, color, moves }) {
        const response = await api.post('/openings', { name, description, fen, color, moves })
        return response.data
    },

    async getById(id) {
        const response = await api.get(`/openings/${id}`)
        return response.data
    },

    async addMove(opening_id, { uci, prev_move_id }) {
        const response = await api.post(`/openings/${opening_id}/move`, { uci, prev_move_id })
        return response.data
    },
}
