import apiClient from './api'

const authService = {
    /**
     * Đăng nhập
     * @param {string} username - Tên đăng nhập
     * @param {string} password - Mật khẩu
     * @param {boolean} rememberMe - Nhớ mật khẩu
     * @returns {Promise} - Thông tin user và token
     */
    login: async (username, password, rememberMe = false) => {
        const endpoint = '/v1/login'

        try {
            const response = await apiClient.post(endpoint, {
                username,
                password,
            })

            // ✅ Xử lý response từ backend
            // Backend trả về: { code: 200, message: "...", data: { user, token } }
            const { data } = response

            if (!data || !data.token) {
                throw new Error('Invalid response from server')
            }

            // Lưu token vào localStorage
            localStorage.setItem('authToken', data.token)

            // Lưu thông tin user
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
            }

            // Nếu chọn "Nhớ mật khẩu", lưu username và password
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username)
                localStorage.setItem('rememberedPassword', btoa(password))
                localStorage.setItem('rememberMe', 'true')
            } else {
                localStorage.removeItem('rememberedUsername')
                localStorage.removeItem('rememberedPassword')
                localStorage.removeItem('rememberMe')
            }

            // ✅ Trả về format mà component expect
            return {
                token: data.token,
                user: data.user,
                message: response.message || 'Login successful'
            }
        } catch (error) {
            console.error('Login error:', error)

            // Xử lý error message từ backend
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Tên đăng nhập hoặc mật khẩu không đúng'

            throw new Error(errorMessage)
        }
    },


    logout: async () => {
        const endpoint = '/auth/logout'

        try {
            await apiClient.post(endpoint)
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken')
        return !!token
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                return JSON.parse(userStr)
            } catch (error) {
                console.error('Error parsing user data:', error)
                return null
            }
        }
        return null
    },

    getToken: () => {
        return localStorage.getItem('authToken')
    },

    getRememberedCredentials: () => {
        const rememberMe = localStorage.getItem('rememberMe') === 'true'
        if (rememberMe) {
            const username = localStorage.getItem('rememberedUsername') || ''
            const encodedPassword = localStorage.getItem('rememberedPassword') || ''
            const password = encodedPassword ? atob(encodedPassword) : ''

            return {
                username,
                password,
                rememberMe: true,
            }
        }

        return {
            username: '',
            password: '',
            rememberMe: false,
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        const endpoint = '/auth/change-password'

        try {
            const response = await apiClient.post(endpoint, {
                oldPassword,
                newPassword,
            })
            return response
        } catch (error) {
            console.error('Change password error:', error)
            throw error
        }
    },

    forgotPassword: async (email) => {
        const endpoint = '/auth/forgot-password'

        try {
            const response = await apiClient.post(endpoint, { email })
            return response
        } catch (error) {
            console.error('Forgot password error:', error)
            throw error
        }
    },
}

export default authService