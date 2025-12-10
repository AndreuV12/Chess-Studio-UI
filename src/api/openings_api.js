import api from './axios'

export const openings_api = {
    async get() {
        const response = await api.post('/openings')
        return response.data
    },
}
