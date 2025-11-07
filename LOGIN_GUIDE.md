# 🔐 Hướng dẫn Login/Logout - EMR Dashboard

## ✨ Tính năng đã được tích hợp

- ✅ **Đăng nhập** với username và password
- ✅ **Nhớ mật khẩu** (Remember Me)
- ✅ **Đăng xuất** với xác nhận
- ✅ **Protected Routes** - Tự động redirect về login nếu chưa đăng nhập
- ✅ **User Menu** - Hiển thị thông tin user và nút logout
- ✅ **Mock Authentication** - Hoạt động ngay cả khi chưa có backend

## 🎯 Cách sử dụng

### 1. Đăng nhập

Khi chạy ứng dụng lần đầu, bạn sẽ được redirect về trang `/login`

**Tài khoản demo:**
- Username: `admin`
- Password: `admin123`

### 2. Tính năng "Nhớ mật khẩu"

- ✅ Tick vào checkbox "Nhớ mật khẩu" trước khi đăng nhập
- ✅ Lần sau mở lại, username và password sẽ tự động điền sẵn
- ✅ Thông tin được lưu an toàn trong localStorage

### 3. Đăng xuất

Có 2 cách để đăng xuất:

**Cách 1:** Click vào avatar ở góc phải trên → Chọn "Đăng xuất"

**Cách 2:** Sử dụng code:
```javascript
import { useAuth } from './contexts/AuthContext'

const { logout } = useAuth()
await logout()
```

## 🏗️ Cấu trúc Code

### 1. AuthService (`src/services/authService.js`)

Xử lý tất cả logic liên quan đến authentication:

```javascript
import { authService } from './services'

// Đăng nhập
await authService.login(username, password, rememberMe)

// Đăng xuất
await authService.logout()

// Kiểm tra đã đăng nhập chưa
const isLoggedIn = authService.isAuthenticated()

// Lấy thông tin user hiện tại
const user = authService.getCurrentUser()

// Lấy thông tin đã lưu (Remember Me)
const remembered = authService.getRememberedCredentials()
```

### 2. AuthContext (`src/contexts/AuthContext.jsx`)

Quản lý state authentication cho toàn bộ app:

```javascript
import { useAuth } from './contexts/AuthContext'

const MyComponent = () => {
  const { user, login, logout, isAuthenticated, loading } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Xin chào, {user.name}</p>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  )
}
```

### 3. ProtectedRoute (`src/components/ProtectedRoute.jsx`)

Bảo vệ các route yêu cầu authentication:

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 4. Login Page (`src/pages/Login.jsx`)

Trang đăng nhập với UI đẹp và đầy đủ tính năng.

## 🔌 Tích hợp với Backend API

### Endpoint cần implement:

#### 1. Login
```
POST /api/auth/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Quản trị viên",
    "email": "admin@hospital.com",
    "role": "Quản trị viên",
    "avatar": "https://..."
  }
}
```

#### 2. Logout
```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

### Cách hoạt động:

1. **Khi chưa có backend:**
   - Service sẽ tự động dùng mock data
   - Username: `admin`, Password: `admin123`
   - Token được generate tự động

2. **Khi có backend:**
   - Service sẽ gọi API thật
   - Nếu API lỗi, sẽ fallback về mock data
   - Token được lưu vào localStorage và tự động thêm vào header của mọi request

## 🔐 Bảo mật

### Token Management

Token được tự động thêm vào header của mọi API request:

```javascript
// File: src/services/api.js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Auto Logout khi Token hết hạn

```javascript
// File: src/services/api.js
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 📝 Lưu ý về "Nhớ mật khẩu"

### Cách hoạt động:

1. **Khi tick "Nhớ mật khẩu":**
   - Username được lưu dạng plain text
   - Password được mã hóa Base64 (đơn giản)
   - Lưu vào localStorage

2. **Khi mở lại app:**
   - Tự động load username và password đã lưu
   - Tự động tick checkbox "Nhớ mật khẩu"

3. **Khi bỏ tick "Nhớ mật khẩu":**
   - Xóa username và password đã lưu
   - Lần sau phải nhập lại

### ⚠️ Lưu ý bảo mật:

- Base64 **KHÔNG phải** là mã hóa an toàn
- Chỉ dùng cho môi trường development/demo
- Production nên dùng các phương pháp bảo mật tốt hơn:
  - Refresh token
  - Secure cookies
  - OAuth 2.0

## 🎨 Customization

### Thay đổi tài khoản demo:

Sửa file `src/services/authService.js`:

```javascript
// Thay đổi username/password demo
if (username === 'your-username' && password === 'your-password') {
  // ...
}
```

### Thêm nhiều tài khoản demo:

```javascript
const demoAccounts = {
  'admin': { password: 'admin123', role: 'Quản trị viên' },
  'doctor': { password: 'doctor123', role: 'Bác sĩ' },
  'nurse': { password: 'nurse123', role: 'Y tá' },
}

const account = demoAccounts[username]
if (account && account.password === password) {
  // Login thành công
}
```

### Tùy chỉnh thời gian session:

```javascript
// Thêm vào authService.js
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 phút

// Lưu thời gian login
localStorage.setItem('loginTime', Date.now())

// Kiểm tra timeout
const loginTime = localStorage.getItem('loginTime')
if (Date.now() - loginTime > SESSION_TIMEOUT) {
  // Auto logout
  authService.logout()
}
```

## 🧪 Testing

### Test Login:

1. Mở `http://localhost:3000`
2. Sẽ tự động redirect về `/login`
3. Nhập username: `admin`, password: `admin123`
4. Tick "Nhớ mật khẩu"
5. Click "Đăng nhập"
6. Sẽ redirect về `/overview`

### Test Remember Me:

1. Đăng nhập với "Nhớ mật khẩu" được tick
2. Đăng xuất
3. Refresh trang
4. Username và password sẽ tự động điền sẵn

### Test Protected Routes:

1. Đăng xuất
2. Thử truy cập `http://localhost:3000/overview`
3. Sẽ tự động redirect về `/login`

## 🚀 Next Steps

- [ ] Thêm "Quên mật khẩu" functionality
- [ ] Thêm "Đổi mật khẩu" functionality
- [ ] Thêm 2FA (Two-Factor Authentication)
- [ ] Thêm Social Login (Google, Facebook)
- [ ] Thêm Session timeout warning
- [ ] Thêm Login history/audit log

---

**Chúc bạn sử dụng tốt! 🎉**

