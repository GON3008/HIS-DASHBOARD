// api.js
import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Xử lý response
apiClient.interceptors.response.use(
    (response) => {
        // Trả về data từ response
        return response.data
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default apiClient