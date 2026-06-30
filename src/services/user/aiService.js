import api from '../common/axiosConfig'

export const aiService = {
    businessInsight: (bId, question) => api.post('/ai/insight', { businessId: bId, question }),
    generateEmail: (bId, context) => api.post('/ai/email', { businessId: bId, context }),
    generateMarketing: (bId, context) => api.post('/ai/marketing', { businessId: bId, context }),
    summarizeInvoice: (invoiceId) => api.post(`/ai/invoice-summary/${invoiceId}`),
}
