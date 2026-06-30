import api from '../common/axiosConfig'

export const reportService = {
    getSalesReport: (bId, period) => api.get(`/reports/sales?businessId=${bId}&period=${period}`),
    getProfitReport: (bId, period) => api.get(`/reports/profit?businessId=${bId}&period=${period}`),
    getInventoryReport: (bId) => api.get(`/reports/inventory?businessId=${bId}`),
}
