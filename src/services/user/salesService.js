import api from '../common/axiosConfig'

export const salesService = {
    getAll: () => api.get(`/sales/getAll`),
    getById: (id) => api.get(`/sales/search/${id}`),
    create: (data) => api.post('/sales/save', data),
    delete: (id) => api.delete(`/sales/delete/${id}`),
    getSummary: (bId, period) => api.get(`/sales/summary?businessId=${bId}&period=${period}`),
}
