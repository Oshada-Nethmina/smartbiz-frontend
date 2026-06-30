import api from '../common/axiosConfig'

export const userService = {
    getAll: (bId) => api.get(`/users?businessId=${bId}`),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
}
