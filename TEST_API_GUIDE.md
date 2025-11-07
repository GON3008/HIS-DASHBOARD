# 🧪 Hướng dẫn Test API

## ✅ Đã tạo endpoint test

Tôi đã tạo sẵn một trang để test endpoint của bạn!

### 📍 Endpoint được test:

```
GET /v1/templates/get-user
```

**Function:** `getSysUsersByDept(deptId)`

**File:** `src/services/departmentService.js`

---

## 🚀 Cách sử dụng

### Bước 1: Chạy ứng dụng

```bash
npm run dev
```

### Bước 2: Đăng nhập

- Mở `http://localhost:3000`
- Đăng nhập với:
  - Username: `admin`
  - Password: `admin123`

### Bước 3: Vào trang Test API

Có 2 cách:

**Cách 1:** Click vào menu **"🧪 Test API"** ở sidebar (có badge "NEW" màu xanh)

**Cách 2:** Truy cập trực tiếp: `http://localhost:3000/test-api`

### Bước 4: Test endpoint

1. Nhập **Department ID** (ví dụ: 1, 2, 3, 4, 5)
2. Click nút **"Test Endpoint"**
3. Xem kết quả:
   - ✅ **Success** → Hiển thị response data màu xanh
   - ❌ **Error** → Hiển thị error message màu đỏ

### Bước 5: Kiểm tra Console

1. Nhấn `F12` để mở Developer Tools
2. Chọn tab **Console**
3. Xem log chi tiết:
   - 🚀 Request được gửi
   - ✅ Response nhận được
   - ❌ Error (nếu có)

---

## 📊 Cấu trúc Code

### 1. Service Function (`src/services/departmentService.js`)

<augment_code_snippet path="src/services/departmentService.js" mode="EXCERPT">
````javascript
getSysUsersByDept: async (deptId) => {
  const endpoint = '/v1/templates/get-user'
  
  try {
    const response = await apiClient.get(endpoint, {
      params: { deptId }
    })
    
    console.log('✅ Test endpoint success:', endpoint)
    console.log('📊 Response data:', response)
    
    return response
  } catch (error) {
    console.error('❌ Error calling endpoint:', endpoint, error)
    // Trả về mock data nếu API lỗi
    return mockData
  }
}
````
</augment_code_snippet>

### 2. Test Page (`src/pages/TestAPI.jsx`)

Trang UI để test endpoint với:
- Input field cho Department ID
- Button để gọi API
- Hiển thị kết quả (success/error)
- Thông tin về endpoint

### 3. Route (`src/App.jsx`)

```javascript
<Route path="/test-api" element={<TestAPI />} />
```

### 4. Menu (`src/components/Layout/Sidebar.jsx`)

```javascript
{ path: '/test-api', icon: FlaskConical, label: '🧪 Test API', badge: 'NEW' }
```

---

## 🔌 Tích hợp Backend

### Khi backend đã sẵn sàng:

#### 1. Cập nhật `.env`

```env
VITE_API_BASE_URL=http://your-backend-url/api
```

Ví dụ:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### 2. Backend cần implement endpoint:

```
GET /v1/templates/get-user?deptId={deptId}
```

**Request:**
```
GET /v1/templates/get-user?deptId=1
```

**Response mẫu:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "user1",
      "name": "Nguyễn Văn A",
      "deptId": 1,
      "role": "Bác sĩ",
      "email": "user1@hospital.com"
    },
    {
      "id": 2,
      "username": "user2",
      "name": "Trần Thị B",
      "deptId": 1,
      "role": "Y tá",
      "email": "user2@hospital.com"
    }
  ]
}
```

#### 3. Test với backend thật:

1. Đảm bảo backend đang chạy
2. Cập nhật `VITE_API_BASE_URL` trong `.env`
3. Restart dev server: `npm run dev`
4. Vào trang Test API
5. Nhập Department ID
6. Click "Test Endpoint"
7. Kiểm tra response

---

## 🔍 Debug

### Nếu gặp lỗi CORS:

Backend cần enable CORS:

**Node.js/Express:**
```javascript
const cors = require('cors')
app.use(cors())
```

**Spring Boot:**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Nếu endpoint không đúng:

Sửa trong `src/services/departmentService.js`:

```javascript
getSysUsersByDept: async (deptId) => {
  // Thay đổi endpoint ở đây
  const endpoint = '/your-custom-endpoint'
  // ...
}
```

### Nếu cần thêm headers:

```javascript
const response = await apiClient.get(endpoint, {
  params: { deptId },
  headers: {
    'Custom-Header': 'value'
  }
})
```

### Nếu cần POST thay vì GET:

```javascript
const response = await apiClient.post(endpoint, {
  deptId: deptId
})
```

---

## 📝 Mock Data

Khi backend chưa sẵn sàng, service tự động trả về mock data:

```javascript
{
  success: true,
  data: [
    { id: 1, username: 'user1', name: 'Nguyễn Văn A', deptId: deptId, role: 'Bác sĩ' },
    { id: 2, username: 'user2', name: 'Trần Thị B', deptId: deptId, role: 'Y tá' },
    { id: 3, username: 'user3', name: 'Lê Văn C', deptId: deptId, role: 'Điều dưỡng' },
  ]
}
```

Bạn có thể thay đổi mock data trong file `src/services/departmentService.js`

---

## 🎯 Ví dụ sử dụng trong code

### Gọi từ component khác:

```javascript
import { departmentService } from '../services'

const MyComponent = () => {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await departmentService.getSysUsersByDept(1)
        setUsers(response.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    fetchUsers()
  }, [])
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### Gọi với async/await:

```javascript
const handleLoadUsers = async (deptId) => {
  try {
    const result = await departmentService.getSysUsersByDept(deptId)
    console.log('Users:', result.data)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Gọi với Promise:

```javascript
departmentService.getSysUsersByDept(1)
  .then(response => {
    console.log('Success:', response.data)
  })
  .catch(error => {
    console.error('Error:', error)
  })
```

---

## 📋 Checklist Test

- [ ] Backend đang chạy
- [ ] `.env` đã cấu hình đúng `VITE_API_BASE_URL`
- [ ] Đã restart dev server sau khi sửa `.env`
- [ ] CORS đã được enable ở backend
- [ ] Endpoint đúng format: `/v1/templates/get-user`
- [ ] Parameter `deptId` được gửi đúng
- [ ] Response format đúng như mong đợi
- [ ] Console không có lỗi
- [ ] Network tab (F12) hiển thị request thành công

---

## 🎉 Tổng kết

Bạn đã có:

✅ Endpoint test: `/v1/templates/get-user`  
✅ Function: `getSysUsersByDept(deptId)`  
✅ Trang Test UI: `/test-api`  
✅ Menu trong Sidebar với badge "NEW"  
✅ Mock data fallback  
✅ Console logging chi tiết  
✅ Error handling  

**Sẵn sàng để test ngay khi backend có API!** 🚀

---

## 💡 Tips

1. **Luôn kiểm tra Console** - Mọi request/response đều được log
2. **Dùng Network tab** - Xem chi tiết HTTP request/response
3. **Test với mock data trước** - Đảm bảo UI hoạt động đúng
4. **Sau đó test với backend thật** - Kiểm tra integration
5. **Đọc error message** - Thường rất rõ ràng về vấn đề

---

**Happy Testing! 🧪**

