import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute Component
 * Bảo vệ các route yêu cầu authentication
 * Redirect về /login nếu chưa đăng nhập
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Redirect về login nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render children nếu đã đăng nhập
  return children
}

export default ProtectedRoute

