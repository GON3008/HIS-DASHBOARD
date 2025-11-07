import apiClient from './api'

/**
 * Dashboard Service
 * Các hàm để gọi API liên quan đến dashboard và thống kê
 * Mỗi function có endpoint riêng, dễ dàng thay đổi
 */

const dashboardService = {
  /**
   * Lấy thống kê tổng quan
   * @returns {Promise} - Dữ liệu thống kê tổng quan summary
   */
  getOverviewStats: async () => {
    // Endpoint cho function này
    const endpoint = '/v1/dashboard-summary'

    try {
      const response = await apiClient.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching overview stats:', error)
      // Trả về dữ liệu mẫu khi chưa có API
      return {

      }
    }
  },

  /**
   * Lấy thống kê tổng quan cho Stats Cards
   * @param {string} fromDate - Ngày bắt đầu (optional)
   * @param {string} toDate - Ngày kết thúc (optional)
   * @param {string} orgId - Mã cơ sở (optional)
   * @returns {Promise} - Dữ liệu summary
   */
  getDashboardSummary: async (fromDate, toDate, orgId) => {
    const endpoint = '/v1/dashboard-summary'

    // Build query params
    const params = new URLSearchParams()
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)
    if (orgId) params.append('orgId', orgId)

    const queryString = params.toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    try {
      const response = await apiClient.get(url)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      // Fallback mẫu
      return {
        examPatients: { total: 0, label: 'Bệnh nhân khám' },
        inpatients: { total: 0, label: 'Bệnh nhân nội trú' },
        revenue: { total: 0, formatted: '0 ₫', label: 'Doanh thu' },
        bedOccupancy: { totalBeds: 0, usedBeds: 0, occupancyRate: 0, label: 'Công suất giường' }
      }
    }
  },

  /**
   * Lấy dữ liệu biểu đồ bệnh nhân điều trị theo dịch vụ (Phẫu thuật/Xạ trị)
   * @param {string} fromDate - Ngày bắt đầu (optional)
   * @param {string} toDate - Ngày kết thúc (optional)
   * @param {string} orgId - Mã cơ sở (optional)
   * @returns {Promise} - Dữ liệu biểu đồ
   */
  getOperationStatistics: async (fromDate, toDate, orgId) => {
    const endpoint = '/v1/operation-statistics'

    // Build query params
    const params = new URLSearchParams()
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)
    if (orgId) params.append('orgId', orgId)

    const queryString = params.toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    try {
      const response = await apiClient.get(url)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Error fetching operation statistics:', error)

      // Trả về dữ liệu mẫu khi lỗi
      return {
        total: 0,
        distribution: []
      }
    }
  },

    /**
     * Lấy thống kê bệnh nhân khám theo cơ sở
     * @param {string} fromDate - Ngày bắt đầu (optional)
     * @param {string} toDate - Ngày kết thúc (optional)
     * @param {string} orgId - Mã cơ sở (optional: '01906', '01254', '01253')
     * @returns {Promise} - Dữ liệu thống kê
     */
  getExamStatistics: async (fromDate, toDate, orgId) => {
    const endpoint = '/v1/exam-statistics'

        // Build query params
        const params = new URLSearchParams();
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        if (orgId) params.append('orgId', orgId);

        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        try {
            const response = await apiClient.get(url);

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error fetching exam statistics:', error);

            // Trả về dữ liệu mẫu khi lỗi
            return {
                total: 100,
                distribution: [
                    { name: 'Khám Thường', value: 65, color: '#3b82f6' },
                    { name: 'Khám Yêu Cầu', value: 35, color: '#10b981' }
                ]
            };
        }
    },

    /**
     * Lấy thống kê công suất giường 3 khối (Nội, Ngoại, Xạ)
     * @param {number} days - Số ngày thống kê (mặc định 7 ngày)
     * @param {string} orgId - Mã cơ sở (optional)
     * @returns {Promise} - Dữ liệu thống kê công suất giường
     */
    getBedOccupancyStatistics: async (days = 7, orgId) => {
        const endpoint = '/v1/bed-occupancy-statistics'

        // Build query params
        const params = new URLSearchParams()
        if (days) params.append('days', days)
        if (orgId) params.append('orgId', orgId)

        const queryString = params.toString()
        const url = queryString ? `${endpoint}?${queryString}` : endpoint

        try {
            const response = await apiClient.get(url)

            if (response.success && response.data) {
                return response.data
            }

            throw new Error('Invalid response format')
        } catch (error) {
            console.error('Error fetching bed occupancy statistics:', error)

            // Trả về dữ liệu mẫu khi lỗi
            return {
                chartData: [],
                summary: {
                    internal: { avgRate: 0, totalBeds: 0, avgUsed: 0 },
                    surgical: { avgRate: 0, totalBeds: 0, avgUsed: 0 },
                    radiation: { avgRate: 0, totalBeds: 0, avgUsed: 0 },
                    overall: { avgRate: 0, totalBeds: 0, avgUsed: 0 }
                }
            }
        }
    }
};

export default dashboardService