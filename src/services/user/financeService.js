import api from '../common/axiosConfig'

export const financeService = {
    getAll: () => api.get('/finance/getAll'),
    search: (id) => api.get(`/finance/search/${id}`),
    create: (data) => api.post('/finance/save', data),
    update: (id, data) => api.put(`/finance/update/${id}`, data),
    delete: (id) => api.delete(`/finance/delete/${id}`),
    getSummary: (businessId, period) =>
        api.get(`/finance/summary?businessId=${businessId}&period=${period}`)
}
