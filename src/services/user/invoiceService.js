import api from '../common/axiosConfig'

export const invoiceService = {
    getAll: (businessId) =>
        api.get(`/invoices/getAll?businessId=${businessId}`),

    getById: (id) =>
        api.get(`/invoices/find/${id}`),

    delete: (id) =>
        api.delete(`/invoices/delete/${id}`),
}
