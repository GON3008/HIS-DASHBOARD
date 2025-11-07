import apiClient from './api'

/**
 * Report Service
 * Các hàm để gọi API liên quan đến báo cáo
 * Mỗi function có endpoint riêng, dễ dàng thay đổi
 */

const reportService = {
  /**
   * Lấy dữ liệu báo cáo doanh thu
   * @param {Object} params - Tham số (period, startDate, endDate)
   * @returns {Promise} - Dữ liệu báo cáo
   */
  getRevenueReport: async (params = {}) => {
    // Endpoint cho function này
    const endpoint = '/reports/revenue'

    try {
      const response = await apiClient.get(endpoint, { params })
      return response
    } catch (error) {
      console.error('Error fetching revenue report:', error)
      // Trả về dữ liệu mẫu
      return [
        { month: 'T1', revenue: 120, expenses: 80, profit: 40 },
        { month: 'T2', revenue: 145, expenses: 90, profit: 55 },
        { month: 'T3', revenue: 135, expenses: 85, profit: 50 },
        { month: 'T4', revenue: 165, expenses: 95, profit: 70 },
        { month: 'T5', revenue: 175, expenses: 100, profit: 75 },
        { month: 'T6', revenue: 195, expenses: 110, profit: 85 },
      ]
    }
  },

  /**
   * Lấy báo cáo bệnh nhân
   * @param {Object} params - Tham số
   * @returns {Promise} - Dữ liệu báo cáo
   */
  getPatientReport: async (params = {}) => {
    // Endpoint cho function này
    const endpoint = '/reports/patients'

    try {
      const response = await apiClient.get(endpoint, { params })
      return response
    } catch (error) {
      console.error('Error fetching patient report:', error)
      throw error
    }
  },

  /**
   * Xuất báo cáo ra file
   * @param {string} reportType - Loại báo cáo
   * @param {string} format - Định dạng file (pdf, excel, csv)
   * @param {Object} params - Tham số báo cáo
   * @returns {Promise} - File blob
   */
  exportReport: async (reportType, format = 'excel', params = {}) => {
    // Endpoint cho function này
    const endpoint = `/reports/${reportType}/export`

    try {
      const response = await apiClient.get(endpoint, {
        params: { ...params, format },
        responseType: 'blob',
      })

      // Tạo link download
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}_report.${format === 'excel' ? 'xlsx' : format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      return response
    } catch (error) {
      console.error('Error exporting report:', error)
      throw error
    }
  },

  /**
   * Lấy danh sách báo cáo đã tạo
   * @returns {Promise} - Danh sách báo cáo
   */
  getRecentReports: async () => {
    // Endpoint cho function này
    const endpoint = '/reports/recent'

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching recent reports:', error)
      // Trả về dữ liệu mẫu
      return [
        { id: 1, name: 'Báo cáo doanh thu tháng 6/2024', date: '2024-06-30', size: '2.4 MB', type: 'revenue' },
        { id: 2, name: 'Báo cáo bệnh nhân quý 2/2024', date: '2024-06-30', size: '1.8 MB', type: 'patient' },
        { id: 3, name: 'Báo cáo khoa phòng tháng 5/2024', date: '2024-05-31', size: '1.2 MB', type: 'department' },
      ]
    }
  },
}

export default reportService

