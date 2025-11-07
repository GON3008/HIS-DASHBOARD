# Hướng dẫn Tích hợp API cho HIS Dashboard

## 📋 Tổng quan

Document này hướng dẫn chi tiết cách tích hợp backend API vào HIS Dashboard.

## 🔧 Cấu hình ban đầu

### 1. Cập nhật API Base URL

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật URL API trong file `.env`:

```env
VITE_API_BASE_URL=http://your-backend-api.com/api
```

### 2. Cấu hình Authentication (nếu cần)

File `src/services/api.js` đã được cấu hình sẵn để xử lý authentication token:

```javascript
// Token sẽ được tự động thêm vào header của mọi request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📡 API Endpoints Specification

### Dashboard APIs

#### 1. Lấy thống kê tổng quan
```
GET /api/dashboard/overview
```

**Response:**
```json
{
  "totalPatients": 3842,
  "todayPatients": 156,
  "departments": 24,
  "bedOccupancy": 78,
  "trends": {
    "patients": "+12.5%",
    "todayPatients": "+8.2%",
    "bedOccupancy": "-3.1%"
  }
}
```

#### 2. Lấy dữ liệu bệnh nhân theo tháng
```
GET /api/dashboard/monthly-patients?months=6
```

**Response:**
```json
[
  {
    "month": "T1",
    "patients": 450,
    "revenue": 120
  },
  {
    "month": "T2",
    "patients": 520,
    "revenue": 145
  }
]
```

#### 3. Phân bố bệnh nhân theo khoa
```
GET /api/dashboard/department-distribution
```

**Response:**
```json
[
  {
    "name": "Nội khoa",
    "value": 35,
    "color": "#3b82f6"
  },
  {
    "name": "Ngoại khoa",
    "value": 25,
    "color": "#10b981"
  }
]
```

### Patient APIs

#### 1. Lấy danh sách bệnh nhân
```
GET /api/patients?page=1&pageSize=10&search=keyword
```

**Response:**
```json
{
  "data": [
    {
      "id": "BN001",
      "name": "Nguyễn Văn A",
      "age": 45,
      "gender": "Nam",
      "department": "Nội khoa",
      "status": "Đang điều trị",
      "admissionDate": "2024-01-15"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

#### 2. Lấy chi tiết bệnh nhân
```
GET /api/patients/:id
```

**Response:**
```json
{
  "id": "BN001",
  "name": "Nguyễn Văn A",
  "age": 45,
  "gender": "Nam",
  "department": "Nội khoa",
  "status": "Đang điều trị",
  "admissionDate": "2024-01-15",
  "diagnosis": "...",
  "treatment": "...",
  "medicalHistory": []
}
```

#### 3. Tạo bệnh nhân mới
```
POST /api/patients
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "age": 45,
  "gender": "Nam",
  "department": "Nội khoa",
  "admissionDate": "2024-01-15",
  "diagnosis": "...",
  "contact": {
    "phone": "0123456789",
    "address": "..."
  }
}
```

#### 4. Cập nhật bệnh nhân
```
PUT /api/patients/:id
```

**Request Body:** (tương tự POST)

#### 5. Xóa bệnh nhân
```
DELETE /api/patients/:id
```

#### 6. Tìm kiếm bệnh nhân
```
GET /api/patients/search?q=keyword
```

### Department APIs

#### 1. Lấy danh sách khoa phòng
```
GET /api/departments
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Khoa Nội",
    "head": "BS. Nguyễn Văn A",
    "patients": 45,
    "beds": 60,
    "occupancy": 75,
    "staff": 25
  }
]
```

#### 2. Lấy chi tiết khoa phòng
```
GET /api/departments/:id
```

#### 3. Thống kê khoa phòng
```
GET /api/departments/stats
```

### Report APIs

#### 1. Báo cáo doanh thu
```
GET /api/reports/revenue?period=month&startDate=2024-01-01&endDate=2024-06-30
```

**Response:**
```json
[
  {
    "month": "T1",
    "revenue": 120,
    "expenses": 80,
    "profit": 40
  }
]
```

#### 2. Báo cáo bệnh nhân
```
GET /api/reports/patients?period=month
```

#### 3. Xuất báo cáo
```
GET /api/reports/:type/export?format=excel
```

**Response:** File blob (Excel/PDF/CSV)

#### 4. Danh sách báo cáo gần đây
```
GET /api/reports/recent
```

## 🔄 Cách sử dụng Services trong Components

### Ví dụ 1: Sử dụng trong Overview Page

```javascript
import { useEffect, useState } from 'react'
import { dashboardService } from '../services'

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await dashboardService.getOverviewStats()
        setStats(data)
      } catch (error) {
        console.error('Error:', error)
        // Xử lý lỗi (hiển thị notification, etc.)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <StatCard value={stats.totalPatients} />
      {/* ... */}
    </div>
  )
}
```

### Ví dụ 2: Sử dụng trong Patients Page

```javascript
import { useEffect, useState } from 'react'
import { patientService } from '../services'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await patientService.getPatients({
        page: 1,
        pageSize: 10
      })
      setPatients(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatient = async (patientData) => {
    try {
      await patientService.createPatient(patientData)
      // Reload danh sách
      loadPatients()
      // Hiển thị thông báo thành công
    } catch (error) {
      console.error('Error:', error)
      // Hiển thị thông báo lỗi
    }
  }

  return (
    <div>
      <Table data={patients} />
    </div>
  )
}
```

## 🚨 Xử lý Lỗi

### Error Handling trong Services

Services đã được cấu hình để xử lý lỗi tự động:

```javascript
// src/services/api.js
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Custom Error Handling

```javascript
try {
  const data = await patientService.getPatients()
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Server Error:', error.response.data)
    alert(`Error: ${error.response.data.message}`)
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request)
    alert('Không thể kết nối đến server')
  } else {
    // Other errors
    console.error('Error:', error.message)
  }
}
```

## 🔐 Authentication Flow

### 1. Login và lưu token

```javascript
// Login function
const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    })
    
    // Lưu token vào localStorage
    localStorage.setItem('authToken', response.token)
    
    // Redirect to dashboard
    window.location.href = '/overview'
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### 2. Logout

```javascript
const logout = () => {
  localStorage.removeItem('authToken')
  window.location.href = '/login'
}
```

## 📊 Loading States và UX

### Thêm Loading Spinner

```javascript
const [loading, setLoading] = useState(true)

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}
```

## 🎯 Best Practices

1. **Luôn xử lý loading states**
2. **Xử lý errors một cách graceful**
3. **Sử dụng try-catch cho async operations**
4. **Validate dữ liệu trước khi gửi lên server**
5. **Hiển thị feedback cho user (success/error messages)**
6. **Implement pagination cho danh sách lớn**
7. **Cache dữ liệu khi cần thiết**

## 🔄 Testing API Integration

### Test với Mock Data

Hiện tại các services đã có fallback về mock data khi API chưa sẵn sàng:

```javascript
try {
  const response = await apiClient.get('/patients')
  return response
} catch (error) {
  // Trả về mock data khi API chưa có
  return mockData
}
```

### Test với Real API

1. Cập nhật `.env` với URL API thật
2. Remove mock data fallback trong services
3. Test từng endpoint một

## 📝 Checklist Tích hợp

- [ ] Cập nhật API Base URL trong `.env`
- [ ] Test connection đến backend API
- [ ] Implement authentication nếu cần
- [ ] Test từng service function
- [ ] Xử lý error cases
- [ ] Thêm loading states
- [ ] Thêm success/error notifications
- [ ] Test với dữ liệu thật
- [ ] Optimize performance (caching, pagination)
- [ ] Security review (XSS, CSRF protection)

---

**Lưu ý:** Document này sẽ được cập nhật khi có thay đổi về API structure.

