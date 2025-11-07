import { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'
import ChartCard from '../components/Dashboard/ChartCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Dữ liệu mẫu - sẽ thay thế bằng API call
const revenueData = [
  { month: 'T1', revenue: 120, expenses: 80, profit: 40 },
  { month: 'T2', revenue: 145, expenses: 90, profit: 55 },
  { month: 'T3', revenue: 135, expenses: 85, profit: 50 },
  { month: 'T4', revenue: 165, expenses: 95, profit: 70 },
  { month: 'T5', revenue: 175, expenses: 100, profit: 75 },
  { month: 'T6', revenue: 195, expenses: 110, profit: 85 },
]

const reportTypes = [
  { id: 1, name: 'Báo cáo doanh thu', icon: TrendingUp, color: 'blue', description: 'Thống kê doanh thu theo tháng/quý/năm' },
  { id: 2, name: 'Báo cáo bệnh nhân', icon: FileText, color: 'green', description: 'Thống kê số lượng và phân loại bệnh nhân' },
  { id: 3, name: 'Báo cáo khoa phòng', icon: FileText, color: 'purple', description: 'Hiệu suất hoạt động các khoa phòng' },
  { id: 4, name: 'Báo cáo thuốc', icon: FileText, color: 'orange', description: 'Thống kê sử dụng và tồn kho thuốc' },
]

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h1>
        <p className="text-gray-600 mt-1">Xem và xuất các báo cáo thống kê</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Chọn kỳ báo cáo:</span>
            <div className="flex space-x-2">
              {['month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'month' ? 'Tháng' : period === 'quarter' ? 'Quý' : 'Năm'}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <ChartCard title="Biểu đồ doanh thu và chi phí (triệu VNĐ)" action="Xem chi tiết">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Doanh thu" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Chi phí" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Lợi nhuận" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Các loại báo cáo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => {
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              orange: 'bg-orange-50 text-orange-600',
            }

            return (
              <div key={report.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[report.color]} flex items-center justify-center mb-4`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Xem báo cáo
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <ChartCard title="Báo cáo gần đây">
        <div className="space-y-3">
          {[
            { name: 'Báo cáo doanh thu tháng 6/2024', date: '2024-06-30', size: '2.4 MB' },
            { name: 'Báo cáo bệnh nhân quý 2/2024', date: '2024-06-30', size: '1.8 MB' },
            { name: 'Báo cáo khoa phòng tháng 5/2024', date: '2024-05-31', size: '1.2 MB' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700">
                <Download className="w-4 h-4 mr-1" />
                Tải xuống
              </button>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

export default Reports

