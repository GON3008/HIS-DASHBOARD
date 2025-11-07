# 🚀 Quick Start Guide - HIS Dashboard

## Bước 1: Cài đặt Dependencies

```bash
npm install
```

## Bước 2: Cấu hình Environment

Tạo file `.env`:

```bash
cp .env.example .env
```

Nội dung file `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Bước 3: Chạy Development Server

```bash
npm run dev
```

Dashboard sẽ chạy tại: **http://localhost:3000**

## 📱 Các trang có sẵn

1. **Tổng quan** (`/overview`) - Dashboard chính với thống kê và biểu đồ
2. **Bệnh nhân** (`/patients`) - Quản lý danh sách bệnh nhân
3. **Khoa phòng** (`/departments`) - Quản lý các khoa phòng
4. **Báo cáo** (`/reports`) - Xem và xuất báo cáo

## 🔌 Tích hợp API Backend

### Hiện tại: Sử dụng Mock Data

Dashboard đang sử dụng dữ liệu mẫu (mock data) để bạn có thể xem trước giao diện.

### Khi có Backend API:

1. **Cập nhật URL API** trong file `.env`:
   ```env
   VITE_API_BASE_URL=http://your-api-url.com/api
   ```

2. **Các API endpoints cần implement** (xem chi tiết trong `API_INTEGRATION_GUIDE.md`):
   - `GET /api/dashboard/overview` - Thống kê tổng quan
   - `GET /api/patients` - Danh sách bệnh nhân
   - `GET /api/departments` - Danh sách khoa phòng
   - `GET /api/reports/revenue` - Báo cáo doanh thu
   - ... và nhiều endpoints khác

3. **Services đã sẵn sàng** trong `src/services/`:
   - `dashboardService.js` - API cho dashboard
   - `patientService.js` - API cho bệnh nhân
   - `departmentService.js` - API cho khoa phòng
   - `reportService.js` - API cho báo cáo

### Ví dụ sử dụng Service:

```javascript
import { patientService } from './services'

// Lấy danh sách bệnh nhân
const patients = await patientService.getPatients()

// Tạo bệnh nhân mới
const newPatient = await patientService.createPatient({
  name: 'Nguyễn Văn A',
  age: 30,
  gender: 'Nam',
  department: 'Nội khoa'
})
```

## 🎨 Customization

### Thay đổi màu sắc

Chỉnh sửa `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#3b82f6', // Màu chính
    600: '#2563eb',
  },
}
```

### Thêm menu mới

Chỉnh sửa `src/components/Layout/Sidebar.jsx`:

```javascript
const menuItems = [
  { path: '/new-page', icon: YourIcon, label: 'Trang mới' },
]
```

## 📦 Build cho Production

```bash
npm run build
```

Files build sẽ được tạo trong thư mục `dist/`

## 🆘 Troubleshooting

### Port 3000 đã được sử dụng?

Chỉnh sửa `vite.config.js`:

```javascript
server: {
  port: 3001, // Đổi sang port khác
}
```

### API không kết nối được?

1. Kiểm tra URL trong file `.env`
2. Kiểm tra CORS settings trên backend
3. Xem console log để debug

## 📚 Tài liệu chi tiết

- **README.md** - Tổng quan dự án
- **API_INTEGRATION_GUIDE.md** - Hướng dẫn tích hợp API chi tiết

## 🎯 Next Steps

1. ✅ Chạy development server
2. ✅ Xem các trang dashboard
3. ⏳ Chuẩn bị backend API
4. ⏳ Tích hợp API vào frontend
5. ⏳ Thêm authentication
6. ⏳ Deploy lên production

---

**Chúc bạn code vui vẻ! 🎉**

