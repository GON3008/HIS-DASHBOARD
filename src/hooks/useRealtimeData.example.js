/**
 * EXAMPLES: Cách sử dụng useRealtimeData hook ở các view khác
 */

import { useCallback } from 'react'
import useRealtimeData from './useRealtimeData'
import dashboardService from '../services/dashboardService'

// ============================================
// EXAMPLE 1: Simple usage - Fetch single data
// ============================================
const PatientListView = () => {
  const fetchPatients = useCallback(async () => {
    return await dashboardService.getPatients()
  }, [])

  const { data, loading, isRefreshing, lastUpdated, refresh } = useRealtimeData(
    fetchPatients,
    10000 // Auto-refresh mỗi 10 giây
  )

  return (
    <div>
      <h1>Danh sách bệnh nhân</h1>
      {lastUpdated && <p>Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}</p>}
      <button onClick={refresh} disabled={isRefreshing}>
        {isRefreshing ? 'Đang tải...' : 'Làm mới'}
      </button>
      {loading ? <p>Loading...</p> : <PatientList data={data} />}
    </div>
  )
}

// ============================================
// EXAMPLE 2: With dependencies - Filter by params
// ============================================
const DepartmentStatsView = () => {
  const [departmentId, setDepartmentId] = useState('')
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  const fetchStats = useCallback(async () => {
    return await dashboardService.getDepartmentStats(
      departmentId,
      dateRange.from,
      dateRange.to
    )
  }, [departmentId, dateRange])

  const { data, loading, lastUpdated, refresh } = useRealtimeData(
    fetchStats,
    30000, // Auto-refresh mỗi 30 giây
    [departmentId, dateRange] // Re-fetch khi dependencies thay đổi
  )

  return (
    <div>
      <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
        <option value="">Tất cả khoa</option>
        <option value="1">Khoa Nội</option>
        <option value="2">Khoa Ngoại</option>
      </select>
      <button onClick={refresh}>Làm mới</button>
      <StatsChart data={data} />
    </div>
  )
}

// ============================================
// EXAMPLE 3: Multiple real-time data sources
// ============================================
const DashboardView = () => {
  // Real-time patients data
  const patients = useRealtimeData(
    async () => await dashboardService.getPatients(),
    5000 // 5 giây
  )

  // Real-time revenue data
  const revenue = useRealtimeData(
    async () => await dashboardService.getRevenue(),
    10000 // 10 giây
  )

  // Real-time appointments data
  const appointments = useRealtimeData(
    async () => await dashboardService.getAppointments(),
    15000 // 15 giây
  )

  return (
    <div>
      <PatientCard data={patients.data} loading={patients.loading} />
      <RevenueCard data={revenue.data} loading={revenue.loading} />
      <AppointmentCard data={appointments.data} loading={appointments.loading} />
    </div>
  )
}

// ============================================
// EXAMPLE 4: Pause/Resume real-time updates
// ============================================
const MonitoringView = () => {
  const fetchMonitoringData = useCallback(async () => {
    return await dashboardService.getMonitoringData()
  }, [])

  const { 
    data, 
    loading, 
    lastUpdated, 
    refresh, 
    pause, 
    resume 
  } = useRealtimeData(fetchMonitoringData, 3000) // 3 giây

  const [isPaused, setIsPaused] = useState(false)

  const handleTogglePause = () => {
    if (isPaused) {
      resume()
    } else {
      pause()
    }
    setIsPaused(!isPaused)
  }

  return (
    <div>
      <button onClick={handleTogglePause}>
        {isPaused ? 'Tiếp tục' : 'Tạm dừng'} auto-refresh
      </button>
      <button onClick={refresh}>Làm mới ngay</button>
      <MonitoringChart data={data} />
    </div>
  )
}

// ============================================
// EXAMPLE 5: Disable auto-refresh (manual only)
// ============================================
const ReportView = () => {
  const fetchReport = useCallback(async () => {
    return await dashboardService.getReport()
  }, [])

  // Set interval = 0 để tắt auto-refresh
  const { data, loading, refresh } = useRealtimeData(
    fetchReport,
    0 // Không auto-refresh
  )

  return (
    <div>
      <button onClick={refresh}>Tải báo cáo</button>
      {loading ? <Spinner /> : <Report data={data} />}
    </div>
  )
}

// ============================================
// EXAMPLE 6: Error handling
// ============================================
const DataView = () => {
  const fetchData = useCallback(async () => {
    return await dashboardService.getData()
  }, [])

  const { data, loading, error, refresh } = useRealtimeData(fetchData, 5000)

  if (error) {
    return (
      <div>
        <p>Lỗi: {error.message}</p>
        <button onClick={refresh}>Thử lại</button>
      </div>
    )
  }

  return <div>{loading ? <Spinner /> : <DataDisplay data={data} />}</div>
}

// ============================================
// EXAMPLE 7: Combined with other hooks
// ============================================
const AdvancedView = () => {
  const [filters, setFilters] = useState({ status: 'active', type: 'all' })

  const fetchFilteredData = useCallback(async () => {
    const result = await dashboardService.getFilteredData(filters)
    return result
  }, [filters])

  const { 
    data, 
    loading, 
    isRefreshing, 
    lastUpdated, 
    refresh 
  } = useRealtimeData(fetchFilteredData, 8000, [filters])

  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      <div className="flex items-center gap-2">
        <span>Cập nhật: {lastUpdated?.toLocaleTimeString('vi-VN')}</span>
        <button onClick={refresh} disabled={isRefreshing}>
          {isRefreshing ? '🔄' : '↻'} Làm mới
        </button>
      </div>
      <DataTable data={data} loading={loading} />
    </div>
  )
}

export {
  PatientListView,
  DepartmentStatsView,
  DashboardView,
  MonitoringView,
  ReportView,
  DataView,
  AdvancedView
}
