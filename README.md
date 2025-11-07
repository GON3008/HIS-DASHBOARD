# HIS Dashboard - Hệ thống Thông tin Bệnh viện

Dashboard quản lý và thống kê cho hệ thống thông tin bệnh viện (Hospital Information System).

## 🚀 Tính năng

- ✅ **Tổng quan Dashboard**: Thống kê tổng quan về bệnh nhân, khoa phòng, doanh thu
- ✅ **Quản lý Bệnh nhân**: Danh sách, tìm kiếm, và quản lý thông tin bệnh nhân
- ✅ **Quản lý Khoa phòng**: Thống kê và quản lý các khoa phòng
- ✅ **Báo cáo**: Xem và xuất các báo cáo thống kê
- ✅ **Biểu đồ trực quan**: Sử dụng Recharts để hiển thị dữ liệu
- ✅ **Responsive Design**: Giao diện tương thích với mọi thiết bị
- ✅ **API Service Layer**: Cấu trúc sẵn sàng để tích hợp backend API

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd his-dashboard
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` và cập nhật URL API của bạn:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🏗️ Cấu trúc dự án

```
his-dashboard/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard/    # Dashboard components (StatCard, ChartCard, Table)
│   │   └── Layout/       # Layout components (Sidebar, Header)
│   ├── pages/            # Page components
│   │   ├── Overview.jsx  # Trang tổng quan
│   │   ├── Patients.jsx  # Trang quản lý bệnh nhân
│   │   ├── Departments.jsx # Trang quản lý khoa phòng
│   │   └── Reports.jsx   # Trang báo cáo
│   ├── services/         # API services
│   │   ├── api.js        # Axios instance và interceptors
│   │   ├── dashboardService.js
│   │   ├── patientService.js
│   │   ├── departmentService.js
│   │   └── reportService.js
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables example
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔌 Tích hợp API

### Cấu hình API Base URL

Trong file `.env`, cập nhật URL của backend API:

```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

### Sử dụng Services

Các service đã được tạo sẵn trong thư mục `src/services/`. Ví dụ sử dụng:

```javascript
import { patientService } from '../services'

// Lấy danh sách bệnh nhân
const patients = await patientService.getPatients()

// Tạo bệnh nhân mới
const newPatient = await patientService.createPatient({
  name: 'Nguyễn Văn A',
  age: 30,
  gender: 'Nam',
  // ...
})
```

### API Endpoints cần implement

Backend API cần cung cấp các endpoints sau:

#### Dashboard
- `GET /api/dashboard/overview` - Thống kê tổng quan
- `GET /api/dashboard/monthly-patients` - Bệnh nhân theo tháng
- `GET /api/dashboard/department-distribution` - Phân bố theo khoa

#### Patients
- `GET /api/patients` - Danh sách bệnh nhân
- `GET /api/patients/:id` - Chi tiết bệnh nhân
- `POST /api/patients` - Tạo bệnh nhân mới
- `PUT /api/patients/:id` - Cập nhật bệnh nhân
- `DELETE /api/patients/:id` - Xóa bệnh nhân
- `GET /api/patients/search?q=keyword` - Tìm kiếm

#### Departments
- `GET /api/departments` - Danh sách khoa phòng
- `GET /api/departments/:id` - Chi tiết khoa phòng
- `GET /api/departments/stats` - Thống kê khoa phòng

#### Reports
- `GET /api/reports/revenue` - Báo cáo doanh thu
- `GET /api/reports/patients` - Báo cáo bệnh nhân
- `GET /api/reports/:type/export` - Xuất báo cáo
- `GET /api/reports/recent` - Báo cáo gần đây

## 🎨 Customization

### Thay đổi màu sắc chủ đạo

Chỉnh sửa file `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi màu primary tại đây
        500: '#3b82f6',
        600: '#2563eb',
        // ...
      },
    },
  },
}
```

### Thêm menu mới

Chỉnh sửa file `src/components/Layout/Sidebar.jsx`:

```javascript
const menuItems = [
  // Thêm menu item mới
  { path: '/new-page', icon: YourIcon, label: 'Trang mới' },
]
```

## 📝 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 🔐 Authentication

Hiện tại project chưa có authentication. Để thêm authentication:

1. Cập nhật `src/services/api.js` để xử lý token
2. Tạo login page và auth context
3. Protect routes với authentication guard

## 📱 Responsive Design

Dashboard được thiết kế responsive và hoạt động tốt trên:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License

## 📞 Liên hệ GITHUB GON3008

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.

---
# HIS-DASHBOARD
