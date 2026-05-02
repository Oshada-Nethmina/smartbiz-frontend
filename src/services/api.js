import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sb_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (err) => Promise.reject(err)
)

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status
        const message = err.response?.data?.message || 'Something went wrong'
        if (status === 401) {
            localStorage.removeItem('sb_token')
            localStorage.removeItem('sb_user')
            window.location.href = '/login'
            toast.error('Session expired. Please sign in again.')
        } else if (status === 403) {
            toast.error('Access denied.')
        } else if (status >= 500) {
            toast.error('Server error. Please try again.')
        } else if (status !== 404) {
            toast.error(message)
        }
        return Promise.reject(err)
    }
)

export default api
