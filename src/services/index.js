import api from './api'

export const authService = {
    login: (email, password) => api.post('/auth/v1/login', { email, password }),
    register: (data) => api.post('/auth/v1/register', data),
    me: () => api.get('/auth/me'),
}

export const businessService = {
    getById: (id) => api.get(`/businesses/${id}`),
    update: (id, data) => api.put(`/businesses/${id}`, data),
    getAll: () => api.get('/businesses'),
    delete: (id) => api.delete(`/businesses/${id}`),
}

export const customerService = {
    getAll: (bId) => api.get(`/customers?businessId=${bId}`),
    getById: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
    search: (bId, q) => api.get(`/customers/search?businessId=${bId}&q=${q}`),
}

export const supplierService = {
    getAll: (bId) => api.get(`/suppliers?businessId=${bId}`),
    getById: (id) => api.get(`/suppliers/${id}`),
    create: (data) => api.post('/suppliers', data),
    update: (id, data) => api.put(`/suppliers/${id}`, data),
    delete: (id) => api.delete(`/suppliers/${id}`),
}

export const productService = {
    getAll: (bId) => api.get(`/products?businessId=${bId}`),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    getLowStock: (bId) => api.get(`/products/low-stock?businessId=${bId}`),
}

export const salesService = {
    getAll: (bId, params) => api.get(`/sales?businessId=${bId}`, { params }),
    getById: (id) => api.get(`/sales/${id}`),
    create: (data) => api.post('/sales', data),
    delete: (id) => api.delete(`/sales/${id}`),
    getSummary: (bId, period) => api.get(`/sales/summary?businessId=${bId}&period=${period}`),
}

export const invoiceService = {
    getAll: (bId) => api.get(`/invoices?businessId=${bId}`),
    getById: (id) => api.get(`/invoices/${id}`),
    delete: (id) => api.delete(`/invoices/${id}`),
}

export const expenseService = {
    getAll: (bId, params) => api.get(`/expenses?businessId=${bId}`, { params }),
    getById: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`),
    getSummary: (bId, period) => api.get(`/expenses/summary?businessId=${bId}&period=${period}`),
}

export const reportService = {
    getSalesReport: (bId, params) => api.get(`/reports/sales?businessId=${bId}`, { params }),
    getProfitReport: (bId, params) => api.get(`/reports/profit?businessId=${bId}`, { params }),
    getInventoryReport: (bId) => api.get(`/reports/inventory?businessId=${bId}`),
}

export const aiService = {
    businessInsight: (bId, question) => api.post('/ai/insight', { businessId: bId, question }),
    generateEmail: (bId, context) => api.post('/ai/email', { businessId: bId, context }),
    generateMarketing: (bId, context) => api.post('/ai/marketing', { businessId: bId, context }),
    summarizeInvoice: (invoiceId) => api.post(`/ai/invoice-summary/${invoiceId}`),
}

export const subscriptionService = {
    getByBusiness: (bId) => api.get(`/subscriptions/business/${bId}`),
    getPlans: () => api.get('/subscriptions/plans'),
    subscribe: (data) => api.post('/subscriptions', data),
    cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
}

export const userService = {
    getAll: (bId) => api.get(`/users?businessId=${bId}`),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
}

export const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsageLogs: (params) => api.get('/admin/logs', { params }),
    getAIUsage: () => api.get('/admin/ai-usage'),
}
