import { Building2, Users, Bed, TrendingUp } from 'lucide-react'
import StatCard from '../components/Dashboard/StatCard'
import ChartCard from '../components/Dashboard/ChartCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Dữ liệu mẫu - sẽ thay thế bằng API call
const departmentsData = [
  { 
    id: 1, 
    name: 'Khoa Nội', 
    head: 'BS. Nguyễn Văn A', 
    patients: 45, 
    beds: 60, 
    occupancy: 75,
    staff: 25 
  },
  { 
    id: 2, 
    name: 'Khoa Ngoại', 
    head: 'BS. Trần Thị B', 
    patients: 38, 
    beds: 50, 
    occupancy: 76,
    staff: 22 
  },
  { 
    id: 3, 
    name: 'Khoa Sản', 
    head: 'BS. Lê Văn C', 
    patients: 28, 
    beds: 40, 
    occupancy: 70,
    staff: 18 
  },
  { 
    id: 4, 
    name: 'Khoa Nhi', 
    head: 'BS. Phạm Thị D', 
    patients: 32, 
    beds: 45, 
    occupancy: 71,
    staff: 20 
  },
  { 
    id: 5, 
    name: 'Khoa Tim mạch', 
    head: 'BS. Hoàng Văn E', 
    patients: 25, 
    beds: 30, 
    occupancy: 83,
    staff: 15 
  },
]

const Departments = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khoa phòng</h1>
        <p className="text-gray-600 mt-1">Thống kê và quản lý các khoa phòng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số khoa"
          value="24"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Tổng nhân viên"
          value="320"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
          color="green"
        />
        <StatCard
          title="Tổng số giường"
          value="450"
          icon={Bed}
          color="purple"
        />
        <StatCard
          title="Tỷ lệ sử dụng TB"
          value="75%"
          icon={TrendingUp}
          trend="up"
          trendValue="+2.3%"
          color="orange"
        />
      </div>

      {/* Department Occupancy Chart */}
      <ChartCard title="Tỷ lệ sử dụng giường theo khoa (%)" action="Xem chi tiết">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="occupancy" fill="#3b82f6" name="Tỷ lệ sử dụng (%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Departments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departmentsData.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Trưởng khoa: {dept.head}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Bệnh nhân</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dept.patients}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Số giường</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dept.beds}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Nhân viên</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dept.staff}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tỷ lệ sử dụng</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dept.occupancy}%</p>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Departments

