import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Kiểm tra authentication khi app load
  useEffect(() => {
    const initAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Đăng nhập
  const login = async (username, password, rememberMe = false) => {
    try {
      const response = await authService.login(username, password, rememberMe)
      setUser(response.user)
      navigate('/overview')
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' 
      }
    }
  }

  // Đăng xuất
  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Vẫn logout ở frontend dù API có lỗi
      setUser(null)
      navigate('/login')
    }
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

