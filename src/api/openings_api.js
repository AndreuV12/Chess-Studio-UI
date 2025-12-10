import api from './axios'

export const openings_api = {
    async get() {
        const response = await api.get('/openings')
        return response.data
    },
}
