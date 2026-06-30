import api from '../common/axiosConfig'

export const supplierService = {
    getAll: () => api.get('/supplier/getAll'),
    getById: (id) => api.get(`/supplier/search/${id}`),
    create: (data) => api.post('/supplier/save', data),
    update: (id, data) => api.put(`/supplier/update/${id}`, data),
    delete: (id) => api.delete(`/supplier/delete/${id}`),
}
