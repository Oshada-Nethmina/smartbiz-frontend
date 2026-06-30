import api from '../common/axiosConfig'

export const businessService = {
    getById: (id) => api.get(`/business/find/${id}`),
    update: (id, data) => api.put(`/businesses/${id}`, data),
    getAll: () => api.get('/business'),
    delete: (id) => api.delete(`/businesses/${id}`),
}
