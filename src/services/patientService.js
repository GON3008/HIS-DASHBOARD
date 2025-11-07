import apiClient from './api'

/**
 * Patient Service
 * Các hàm để gọi API liên quan đến bệnh nhân
 * Mỗi function có endpoint riêng, dễ dàng thay đổi
 */

const patientService = {
  /**
   * Lấy danh sách bệnh nhân
   * @param {Object} params - Tham số tìm kiếm và phân trang
   * @returns {Promise} - Danh sách bệnh nhân
   */
  getPatients: async (params = {}) => {
    // Endpoint cho function này
    const endpoint = '/patients'

    try {
      const response = await apiClient.get(endpoint, { params })
      return response
    } catch (error) {
      console.error('Error fetching patients:', error)
      // Trả về dữ liệu mẫu
      return {
        data: [
          { id: 'BN001', name: 'Nguyễn Văn A', age: 45, gender: 'Nam', department: 'Nội khoa', status: 'Đang điều trị', admissionDate: '2024-01-15' },
          { id: 'BN002', name: 'Trần Thị B', age: 32, gender: 'Nữ', department: 'Sản khoa', status: 'Đang điều trị', admissionDate: '2024-01-16' },
          { id: 'BN003', name: 'Lê Văn C', age: 28, gender: 'Nam', department: 'Ngoại khoa', status: 'Xuất viện', admissionDate: '2024-01-10' },
          { id: 'BN004', name: 'Phạm Thị D', age: 55, gender: 'Nữ', department: 'Tim mạch', status: 'Đang điều trị', admissionDate: '2024-01-17' },
          { id: 'BN005', name: 'Hoàng Văn E', age: 38, gender: 'Nam', department: 'Nội khoa', status: 'Đang điều trị', admissionDate: '2024-01-18' },
        ],
        total: 5,
        page: 1,
        pageSize: 10,
      }
    }
  },

  /**
   * Lấy thông tin chi tiết bệnh nhân
   * @param {string} patientId - Mã bệnh nhân
   * @returns {Promise} - Thông tin bệnh nhân
   */
  getPatientById: async (patientId) => {
    // Endpoint cho function này
    const endpoint = `/patients/${patientId}`

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  /**
   * Tạo bệnh nhân mới
   * @param {Object} patientData - Dữ liệu bệnh nhân
   * @returns {Promise} - Bệnh nhân đã tạo
   */
  createPatient: async (patientData) => {
    // Endpoint cho function này
    const endpoint = '/patients'

    try {
      const response = await apiClient.post(endpoint, patientData)
      return response
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  },

  /**
   * Cập nhật thông tin bệnh nhân
   * @param {string} patientId - Mã bệnh nhân
   * @param {Object} patientData - Dữ liệu cập nhật
   * @returns {Promise} - Bệnh nhân đã cập nhật
   */
  updatePatient: async (patientId, patientData) => {
    // Endpoint cho function này
    const endpoint = `/patients/${patientId}`

    try {
      const response = await apiClient.put(endpoint, patientData)
      return response
    } catch (error) {
      console.error('Error updating patient:', error)
      throw error
    }
  },

  /**
   * Xóa bệnh nhân
   * @param {string} patientId - Mã bệnh nhân
   * @returns {Promise}
   */
  deletePatient: async (patientId) => {
    // Endpoint cho function này
    const endpoint = `/patients/${patientId}`

    try {
      const response = await apiClient.delete(endpoint)
      return response
    } catch (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  },

  /**
   * Tìm kiếm bệnh nhân
   * @param {string} searchTerm - Từ khóa tìm kiếm
   * @returns {Promise} - Kết quả tìm kiếm
   */
  searchPatients: async (searchTerm) => {
    // Endpoint cho function này
    const endpoint = '/patients/search'

    try {
      const response = await apiClient.get(endpoint, {
        params: { q: searchTerm }
      })
      return response
    } catch (error) {
      console.error('Error searching patients:', error)
      throw error
    }
  },
}

export default patientService

