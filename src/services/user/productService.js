import api from '../common/axiosConfig'

export const productService = {
    getAll: () => api.get(`/product/getAll`),
    getById: (id) => api.get(`/product/search/${id}`),
    create: (data) => api.post('/product/save', data),
    update: (bId, pId, data) =>
        api.put(`/product/update/${bId}/${pId}`, data),
    delete: (bId, pId) => api.delete(`/product/delete/business/${bId}/${pId}`),
    getLowStock: (bId) => api.get(`/product/low-stock?businessId=${bId}`),
}
