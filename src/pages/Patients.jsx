import { useState } from 'react'
import { Search, Filter, Download, UserPlus } from 'lucide-react'
import Table from '../components/Dashboard/Table'
import ChartCard from '../components/Dashboard/ChartCard'

// Dữ liệu mẫu - sẽ thay thế bằng API call
const patientsData = [
  { id: 'BN001', name: 'Nguyễn Văn A', age: 45, gender: 'Nam', department: 'Nội khoa', status: 'Đang điều trị', admissionDate: '2024-01-15' },
  { id: 'BN002', name: 'Trần Thị B', age: 32, gender: 'Nữ', department: 'Sản khoa', status: 'Đang điều trị', admissionDate: '2024-01-16' },
  { id: 'BN003', name: 'Lê Văn C', age: 28, gender: 'Nam', department: 'Ngoại khoa', status: 'Xuất viện', admissionDate: '2024-01-10' },
  { id: 'BN004', name: 'Phạm Thị D', age: 55, gender: 'Nữ', department: 'Tim mạch', status: 'Đang điều trị', admissionDate: '2024-01-17' },
  { id: 'BN005', name: 'Hoàng Văn E', age: 38, gender: 'Nam', department: 'Nội khoa', status: 'Đang điều trị', admissionDate: '2024-01-18' },
]

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const columns = [
    { header: 'Mã BN', accessor: 'id' },
    { header: 'Họ và tên', accessor: 'name' },
    { header: 'Tuổi', accessor: 'age' },
    { header: 'Giới tính', accessor: 'gender' },
    { header: 'Khoa', accessor: 'department' },
    { 
      header: 'Trạng thái', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Đang điều trị' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Ngày nhập viện', accessor: 'admissionDate' },
  ]

  const handleRowClick = (row) => {
    console.log('Patient clicked:', row)
    // TODO: Navigate to patient detail page or open modal
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin bệnh nhân</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <UserPlus className="w-5 h-5 mr-2" />
          Thêm bệnh nhân
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Lọc
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <ChartCard title={`Danh sách bệnh nhân (${patientsData.length})`}>
        <Table 
          columns={columns} 
          data={patientsData}
          onRowClick={handleRowClick}
        />
      </ChartCard>
    </div>
  )
}

export default Patients

