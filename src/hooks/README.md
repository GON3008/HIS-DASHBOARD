# useRealtimeData Hook

Custom React hook để tự động fetch và cập nhật dữ liệu real-time.

## 📦 Features

- ✅ **Auto-refresh**: Tự động fetch data theo interval
- ✅ **Manual refresh**: Nút làm mới thủ công
- ✅ **Loading states**: Quản lý loading và refreshing states
- ✅ **Last updated**: Timestamp cập nhật cuối
- ✅ **Error handling**: Xử lý lỗi tự động
- ✅ **Pause/Resume**: Tạm dừng và tiếp tục auto-refresh
- ✅ **Dependencies**: Re-fetch khi dependencies thay đổi
- ✅ **Cleanup**: Tự động cleanup interval

## 🚀 Usage

### Basic Usage

```javascript
import useRealtimeData from '../hooks/useRealtimeData'
import dashboardService from '../services/dashboardService'

const MyComponent = () => {
  const { data, loading, refresh } = useRealtimeData(
    async () => await dashboardService.getData(),
    5000 // Auto-refresh mỗi 5 giây
  )

  return (
    <div>
      {loading ? 'Loading...' : <DisplayData data={data} />}
      <button onClick={refresh}>Làm mới</button>
    </div>
  )
}
```

### With Dependencies

```javascript
const MyComponent = () => {
  const [orgId, setOrgId] = useState('')

  const fetchData = useCallback(async () => {
    return await dashboardService.getData(orgId)
  }, [orgId])

  const { data, loading } = useRealtimeData(
    fetchData,
    10000, // 10 giây
    [orgId] // Re-fetch khi orgId thay đổi
  )

  return (
    <div>
      <select value={orgId} onChange={(e) => setOrgId(e.target.value)}>
        <option value="">Tất cả</option>
        <option value="1">Org 1</option>
      </select>
      <DisplayData data={data} />
    </div>
  )
}
```

### Multiple Data Sources

```javascript
const Dashboard = () => {
  const patients = useRealtimeData(
    async () => await dashboardService.getPatients(),
    5000
  )

  const revenue = useRealtimeData(
    async () => await dashboardService.getRevenue(),
    10000
  )

  return (
    <div>
      <PatientCard data={patients.data} loading={patients.loading} />
      <RevenueCard data={revenue.data} loading={revenue.loading} />
    </div>
  )
}
```

### Pause/Resume

```javascript
const MonitoringView = () => {
  const { data, pause, resume, refresh } = useRealtimeData(
    async () => await dashboardService.getMonitoring(),
    3000
  )

  return (
    <div>
      <button onClick={pause}>Tạm dừng</button>
      <button onClick={resume}>Tiếp tục</button>
      <button onClick={refresh}>Làm mới ngay</button>
      <MonitoringChart data={data} />
    </div>
  )
}
```

### Disable Auto-refresh

```javascript
const ReportView = () => {
  const { data, loading, refresh } = useRealtimeData(
    async () => await dashboardService.getReport(),
    0 // Set interval = 0 để tắt auto-refresh
  )

  return (
    <div>
      <button onClick={refresh}>Tải báo cáo</button>
      {loading ? <Spinner /> : <Report data={data} />}
    </div>
  )
}
```

## 📝 API

### Parameters

```javascript
useRealtimeData(fetchFunction, interval, dependencies)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fetchFunction` | `Function` | **required** | Async function để fetch data |
| `interval` | `number` | `5000` | Thời gian auto-refresh (ms). Set `0` để tắt |
| `dependencies` | `Array` | `[]` | Dependencies để trigger re-fetch |

### Return Values

```javascript
const {
  data,          // Dữ liệu từ API
  loading,       // true khi đang loading lần đầu
  isRefreshing,  // true khi đang refresh (auto hoặc manual)
  lastUpdated,   // Date object của lần cập nhật cuối
  error,         // Error object nếu có lỗi
  refresh,       // Function để refresh thủ công
  pause,         // Function để tạm dừng auto-refresh
  resume         // Function để tiếp tục auto-refresh
} = useRealtimeData(...)
```

## 🎯 Common Intervals

| Interval | Use Case |
|----------|----------|
| `3000` (3s) | Real-time monitoring, live data |
| `5000` (5s) | Dashboard statistics, charts |
| `10000` (10s) | Patient lists, appointments |
| `30000` (30s) | Reports, analytics |
| `60000` (60s) | Historical data, trends |
| `0` | Manual refresh only |

## 💡 Best Practices

1. **Use `useCallback`** cho fetchFunction để tránh re-render không cần thiết
2. **Specify dependencies** khi fetch function phụ thuộc vào state/props
3. **Choose appropriate interval** dựa trên tần suất thay đổi data
4. **Handle errors** để hiển thị thông báo lỗi cho user
5. **Show loading states** để UX tốt hơn
6. **Display last updated time** để user biết data mới nhất

## 📚 Examples

Xem file `useRealtimeData.example.js` để có thêm nhiều ví dụ chi tiết.

## 🔧 Troubleshooting

### Hook không re-fetch khi state thay đổi
- Đảm bảo bạn đã thêm state vào `dependencies` array
- Wrap fetchFunction trong `useCallback` với dependencies

### Memory leak warning
- Hook tự động cleanup interval khi component unmount
- Nếu vẫn gặp warning, kiểm tra fetchFunction có cancel được không

### Too many API calls
- Tăng interval time
- Sử dụng `pause()` khi user không active
- Set interval = 0 và chỉ dùng manual refresh

## 📄 License

MIT
