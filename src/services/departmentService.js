import apiClient from './api'

/**
 * Department Service
 * Các hàm để gọi API liên quan đến khoa phòng
 * Mỗi function có endpoint riêng, dễ dàng thay đổi
 */

const departmentService = {
  /**
   * Lấy danh sách khoa phòng
   * @returns {Promise} - Danh sách khoa phòng
   */
  getDepartments: async () => {
    // Endpoint cho function này
    const endpoint = '/departments'

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching departments:', error)
      // Trả về dữ liệu mẫu
      return [
        { id: 1, name: 'Khoa Nội', head: 'BS. Nguyễn Văn A', patients: 45, beds: 60, occupancy: 75, staff: 25 },
        { id: 2, name: 'Khoa Ngoại', head: 'BS. Trần Thị B', patients: 38, beds: 50, occupancy: 76, staff: 22 },
        { id: 3, name: 'Khoa Sản', head: 'BS. Lê Văn C', patients: 28, beds: 40, occupancy: 70, staff: 18 },
        { id: 4, name: 'Khoa Nhi', head: 'BS. Phạm Thị D', patients: 32, beds: 45, occupancy: 71, staff: 20 },
        { id: 5, name: 'Khoa Tim mạch', head: 'BS. Hoàng Văn E', patients: 25, beds: 30, occupancy: 83, staff: 15 },
      ]
    }
  },

  /**
   * Lấy thông tin chi tiết khoa phòng
   * @param {number} departmentId - ID khoa phòng
   * @returns {Promise} - Thông tin khoa phòng
   */
  getDepartmentById: async (departmentId) => {
    // Endpoint cho function này
    const endpoint = `/departments/${departmentId}`

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching department:', error)
      throw error
    }
  },

  /**
   * Lấy thống kê khoa phòng
   * @returns {Promise} - Thống kê khoa phòng
   */
  getDepartmentStats: async () => {
    // Endpoint cho function này
    const endpoint = '/departments/stats'

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching department stats:', error)
      throw error
    }
  },

  /**
   * Lấy danh sách user theo department (TEST ENDPOINT)
   * @param {string|number} deptId - ID của department
   * @returns {Promise} - Danh sách users
   */
  getSysUsersByDept: async (deptId) => {
    // Endpoint cho function này - TEST
    const endpoint = '/v1/templates/get-user'

    try {
      const response = await apiClient.get(endpoint, {
        params: { deptId }
      })

      console.log('✅ Test endpoint success:', endpoint)
      console.log('📊 Response data:', response)

      return response
    } catch (error) {
      console.error('❌ Error calling endpoint:', endpoint, error)

      // Mock data để test
      const mockData = {
        success: true,
        data: [
          { id: 1, username: 'user1', name: 'Nguyễn Văn A', deptId: deptId, role: 'Bác sĩ' },
          { id: 2, username: 'user2', name: 'Trần Thị B', deptId: deptId, role: 'Y tá' },
          { id: 3, username: 'user3', name: 'Lê Văn C', deptId: deptId, role: 'Điều dưỡng' },
        ]
      }

      console.log('📝 Using mock data:', mockData)
      return mockData
    }
  },
}

export default departmentService

