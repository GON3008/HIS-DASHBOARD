import {useState, useCallback} from 'react'
import {Users, UserCheck, Building2, Activity, RefreshCw, DollarSign, BanknoteIcon} from 'lucide-react'
import StatCard from '../components/Dashboard/StatCard'
import dashboardService from '../services/dashboardService'
import useRealtimeData from '../hooks/useRealtimeData'
import { useSettings } from '../contexts/SettingsContext'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

// Interval được cấu hình trong Settings

const ChartCard = ({title, action, children}) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            {action && (
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {action}
                </button>
            )}
        </div>
        {children}
    </div>
);

const Overview = () => {
    const [selectedOrg, setSelectedOrg] = useState('')
    const [bedOccupancyDays, setBedOccupancyDays] = useState(7)
    const { realtimeInterval } = useSettings()
    
    // Date range for operation and exam statistics
    const today = new Date().toISOString().split('T')[0]
    const [dateRange, setDateRange] = useState({
        fromDate: today,
        toDate: today
    })

    // Fetch function for real-time hook
    const fetchDashboardData = useCallback(async () => {
        // Fetch exam statistics with date range
        const examStats = await dashboardService.getExamStatistics(
            dateRange.fromDate, 
            dateRange.toDate, 
            selectedOrg || null
        )

        // Fetch operation statistics with date range (Phẫu thuật/Xạ trị)
        const operationStats = await dashboardService.getOperationStatistics(
            dateRange.fromDate, 
            dateRange.toDate, 
            selectedOrg || null
        )

        // Fetch dashboard summary for Stat Cards
        const summary = await dashboardService.getDashboardSummary(
            dateRange.fromDate,
            dateRange.toDate,
            selectedOrg || null
        )

        // Fetch bed occupancy statistics (Công suất giường)
        const bedOccupancyStats = await dashboardService.getBedOccupancyStatistics(bedOccupancyDays, selectedOrg || null)

        return {
            examData: examStats,
            operationData: operationStats,
            bedOccupancyData: bedOccupancyStats,
            summaryData: summary
        }
    }, [selectedOrg, bedOccupancyDays, dateRange])

    // Use real-time hook
    const {
        data,
        loading,
        isRefreshing,
        lastUpdated,
        refresh
    } = useRealtimeData(fetchDashboardData, realtimeInterval, [selectedOrg, bedOccupancyDays, dateRange])

    // Extract data
    const examData = data?.examData || {total: 0, distribution: []}
    const operationData = data?.operationData || {total: 0, distribution: []}
    const bedOccupancyData = data?.bedOccupancyData || {chartData: [], summary: {}}
    const summaryData = data?.summaryData || null

    const handleOrgChange = (e) => {
        setSelectedOrg(e.target.value)
    }

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-600 dark:text-gray-400">Thống kê tổng quan hệ thống bệnh viện</p>
                        {lastUpdated && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                            • Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
                        </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-sm md:text-md font-medium text-gray-700 dark:text-gray-300">Chọn cơ sở
                            điều trị:</label>
                        <select
                            value={selectedOrg}
                            onChange={handleOrgChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:min-w-[200px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                        >
                            <option value="">Tất cả</option>
                            <option value="01906">Cơ sở 1</option>
                            <option value="01254">Cơ sở 2</option>
                            <option value="01253">Cơ sở 3</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            className="text-sm md:text-md font-medium text-gray-700 dark:text-gray-300 opacity-0">Refresh</label>
                        <button
                            onClick={refresh}
                            disabled={isRefreshing}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                            title="Làm mới dữ liệu"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}/>
                            <span className="hidden md:inline">Làm mới</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards data summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={summaryData?.examPatients?.label || 'Bệnh nhân khám'}
                    value={(summaryData?.examPatients?.total ?? 0).toLocaleString('vi-VN')}
                    icon={Users}
                    trend=""
                    trendValue=""
                    color="blue"
                />
                <StatCard
                    title={summaryData?.inpatients?.label || 'Bệnh nhân nội trú'}
                    value={(summaryData?.inpatients?.total ?? 0).toLocaleString('vi-VN')}
                    icon={UserCheck}
                    trend=""
                    trendValue=""
                    color="green"
                />
                <StatCard
                    title={summaryData?.revenue?.label || 'Doanh thu'}
                    value={summaryData?.revenue?.formatted || (summaryData?.revenue?.total != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summaryData.revenue.total) : '0 ₫')}
                    icon={BanknoteIcon}
                    color="purple"
                />
                <StatCard
                    title={summaryData?.bedOccupancy?.label || 'Công suất giường'}
                    value={`${(summaryData?.bedOccupancy?.occupancyRate ?? 0).toFixed(2)}%`}
                    icon={Activity}
                    trend=""
                    trendValue=""
                    color="orange"
                />
            </div>

            {/* Date Range Filter for Charts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lọc theo khoảng thời gian:
                    </label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Từ ngày:</label>
                            <input
                                type="date"
                                value={dateRange.fromDate}
                                onChange={(e) => handleDateChange('fromDate', e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Đến ngày:</label>
                            <input
                                type="date"
                                value={dateRange.toDate}
                                onChange={(e) => handleDateChange('toDate', e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setDateRange({ fromDate: today, toDate: today })}
                            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                            Hôm nay
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Áp dụng cho: Bệnh nhân khám & Điều trị theo dịch vụ
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Phẫu thuật/Xạ trị */}
                <ChartCard title={`Tổng số bệnh nhân điều trị theo dịch vụ (Tổng: ${operationData.total})`}
                           action="Xem chi tiết">
                    {loading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : operationData.distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={operationData.distribution}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="value" fill="#10b981" name="Số bệnh nhân">
                                    {operationData.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                            Không có dữ liệu
                        </div>
                    )}
                </ChartCard>

                {/* Pie Chart - Exam Statistics */}
                <ChartCard title={`Số bệnh nhân khám (Tổng: ${examData.total})`} action="Xem chi tiết">
                    {loading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : examData.distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={examData.distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {examData.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                            Không có dữ liệu
                        </div>
                    )}
                </ChartCard>
            </div>

            {/* Line Chart - Công suất giường */}
            <ChartCard 
                title={
                    <div className="flex items-center justify-between w-full">
                        <span>Công suất giường 3 khối (Nội, Ngoại, Xạ)</span>
                        <select
                            value={bedOccupancyDays}
                            onChange={(e) => setBedOccupancyDays(Number(e.target.value))}
                            className="ml-4 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value={7}>7 ngày</option>
                            <option value={14}>14 ngày</option>
                            <option value={30}>30 ngày</option>
                        </select>
                    </div>
                }
                action="Xem báo cáo"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : bedOccupancyData.chartData.length > 0 ? (
                    <div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={bedOccupancyData.chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="date" />
                                <YAxis 
                                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                    domain={[0, 1]}
                                />
                                <Tooltip 
                                    formatter={(value) => `${(value * 100).toFixed(2)}%`}
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="internal" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2} 
                                    name="Khối Nội"
                                    dot={{ r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="surgical" 
                                    stroke="#10b981" 
                                    strokeWidth={2} 
                                    name="Khối Ngoại"
                                    dot={{ r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="radiation" 
                                    stroke="#f59e0b" 
                                    strokeWidth={2} 
                                    name="Khối Xạ"
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        
                        {/* Summary Stats */}
                        {bedOccupancyData.summary && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Khối Nội (TB)</p>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        {(bedOccupancyData.summary.internal?.avgRate * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {bedOccupancyData.summary.internal?.avgUsed}/{bedOccupancyData.summary.internal?.totalBeds} giường
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Khối Ngoại (TB)</p>
                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                        {(bedOccupancyData.summary.surgical?.avgRate * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {bedOccupancyData.summary.surgical?.avgUsed}/{bedOccupancyData.summary.surgical?.totalBeds} giường
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Khối Xạ (TB)</p>
                                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                        {(bedOccupancyData.summary.radiation?.avgRate * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {bedOccupancyData.summary.radiation?.avgUsed}/{bedOccupancyData.summary.radiation?.totalBeds} giường
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng thể (TB)</p>
                                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                        {(bedOccupancyData.summary.overall?.avgRate * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {bedOccupancyData.summary.overall?.avgUsed}/{bedOccupancyData.summary.overall?.totalBeds} giường
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                        Không có dữ liệu
                    </div>
                )}
            </ChartCard>
        </div>
    )
}

export default Overview

