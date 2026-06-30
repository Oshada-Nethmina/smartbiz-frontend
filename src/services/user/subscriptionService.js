import api from '../common/axiosConfig'

export const subscriptionService = {
    // User
    getByBusiness: (businessId) =>
        api.get(`/subscriptions/business/${businessId}`),

    getPlans: () =>
        api.get('/subscription-plans/getAll'),

    subscribe: (data) =>
        api.post('/subscriptions/subscribe', data),

    cancel: (businessId) =>
        api.delete(`/subscriptions/cancel/${businessId}`),

    // Admin
    getAllSubscriptions: () =>
        api.get('/subscriptions/getAll'),

    getStatistics: () =>
        api.get('/subscriptions/statistics'),
}
