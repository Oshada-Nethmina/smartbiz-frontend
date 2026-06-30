import api from '../common/axiosConfig'

export const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsageLogs: (params) => api.get('/admin/logs', { params }),
    getAIUsage: () => api.get('/admin/ai-usage'),
}
