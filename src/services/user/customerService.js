import api from '../common/axiosConfig'

export const customerService = {
    getAll: () => api.get("/customer/getAll"),

    getById: (id) => api.get(`/customer/find/${id}`),

    create: (data) => api.post("/customer/save", data),

    update: (id, data) => api.put(`/customer/update/${id}`, data),

    delete: (id) => api.delete(`/customer/delete/${id}`),
}
