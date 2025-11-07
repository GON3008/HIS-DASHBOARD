import { useState } from 'react'
import { departmentService } from '../services'
import { Play, CheckCircle, XCircle, Loader } from 'lucide-react'

/**
 * Test API Page
 * Trang để test các endpoint API
 */
const TestAPI = () => {
  const [deptId, setDeptId] = useState('1')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🚀 Testing endpoint with deptId:', deptId)
      const response = await departmentService.getSysUsersByDept(deptId)
      
      setResult(response)
      console.log('✅ Success:', response)
    } catch (err) {
      setError(err.message || 'Unknown error')
      console.error('❌ Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🧪 Test API Endpoint
        </h1>
        <p className="text-gray-600">
          Test endpoint: <code className="bg-gray-100 px-2 py-1 rounded text-sm">/v1/templates/get-user</code>
        </p>
      </div>

      {/* Test Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Test getSysUsersByDept</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department ID
          </label>
          <input
            type="text"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            placeholder="Nhập department ID (ví dụ: 1, 2, 3...)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Thử với các giá trị: 1, 2, 3, 4, 5
          </p>
        </div>

        <button
          onClick={handleTest}
          disabled={loading || !deptId}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Đang gọi API...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Test Endpoint
            </>
          )}
        </button>
      </div>

      {/* Success Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              ✅ Success!
            </h3>
          </div>
          
          <div className="bg-white rounded-lg p-4 overflow-auto">
            <p className="text-sm text-gray-600 mb-2 font-medium">Response Data:</p>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Error Result */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              ❌ Error
            </h3>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* API Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          📋 API Information
        </h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-blue-900">Endpoint:</span>
            <code className="ml-2 bg-white px-2 py-1 rounded text-blue-700">
              GET /v1/templates/get-user
            </code>
          </div>
          
          <div>
            <span className="font-medium text-blue-900">Parameters:</span>
            <code className="ml-2 bg-white px-2 py-1 rounded text-blue-700">
              deptId (string|number)
            </code>
          </div>
          
          <div>
            <span className="font-medium text-blue-900">Function:</span>
            <code className="ml-2 bg-white px-2 py-1 rounded text-blue-700">
              departmentService.getSysUsersByDept(deptId)
            </code>
          </div>
          
          <div>
            <span className="font-medium text-blue-900">File:</span>
            <code className="ml-2 bg-white px-2 py-1 rounded text-blue-700">
              src/services/departmentService.js
            </code>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Lưu ý:</strong> Nếu backend chưa sẵn sàng, service sẽ tự động trả về mock data.
            Kiểm tra Console (F12) để xem chi tiết request/response.
          </p>
        </div>
      </div>

      {/* Console Instructions */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🔍 Kiểm tra Console
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Nhấn <kbd className="bg-gray-200 px-2 py-1 rounded">F12</kbd> để mở Developer Tools</li>
          <li>Chọn tab <strong>Console</strong></li>
          <li>Click nút "Test Endpoint" ở trên</li>
          <li>Xem log chi tiết về request và response</li>
        </ol>
      </div>
    </div>
  )
}

export default TestAPI

