# Hướng dẫn đóng gói và triển khai Docker cho HIS Dashboard

Tài liệu này hướng dẫn build image Docker, chạy container trên máy chủ (cổng 8005), và cách cập nhật khi có thay đổi code.

- Repo: `his-dashboard`
- Port mong muốn trên máy chủ: `8005`
- Runtime: Nginx phục vụ static build từ Vite (multi-stage Docker)

Các file đã có sẵn trong repo:
- `Dockerfile`
- `nginx.conf`
- `.dockerignore`

---

## 1) Yêu cầu hệ thống trên máy chủ

- Docker Engine (bắt buộc)
- (Tuỳ chọn) Docker Compose v2
- Quyền mở cổng 8005 (firewall/security group)

### Cài Docker nhanh (Ubuntu/Debian)
```bash
a pt update -y && apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update -y && apt install -y docker-ce docker-ce-cli containerd.io
systemctl enable --now docker
```

### Cài Docker nhanh (CentOS/RHEL)
```bash
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl enable --now docker
```

Kiểm tra:
```bash
docker --version
```

---

## 2) Build image Docker

Thực hiện tại thư mục gốc dự án (chứa `Dockerfile`):
```bash
docker build -t his-dashboard:latest .
```

Nếu tốc độ mạng chậm, có thể bật build cache registry/tạo proxy, nhưng thường không cần.

---

## 3) Chạy container (port 8005)

Map cổng máy chủ `8005` -> cổng container `80`:
```bash
docker run -d --name his-dashboard \
  -p 8005:80 \
  --restart unless-stopped \
  his-dashboard:latest
```

Kiểm tra chạy:
```bash
docker ps
docker logs -f his-dashboard
```

Truy cập ứng dụng: `http://<IP_MAY_CHU>:8005`

Nếu dùng firewall (ví dụ firewalld):
```bash
sudo firewall-cmd --permanent --add-port=8005/tcp
sudo firewall-cmd --reload
```

---

## 4) Cập nhật khi có thay đổi code

Mỗi lần đổi code, build lại image và khởi động lại container:
```bash
# Trong thư mục dự án đã cập nhật code
docker build -t his-dashboard:latest .
docker stop his-dashboard && docker rm his-dashboard

docker run -d --name his-dashboard \
  -p 8005:80 \
  --restart unless-stopped \
  his-dashboard:latest
```

Tuỳ chọn gom lệnh thành script `deploy.sh`.

---

## 5) Docker Compose (tuỳ chọn)

Tạo `docker-compose.yml` nếu muốn quản lý dễ hơn:
```yaml
version: '3.9'
services:
  his-dashboard:
    build: .
    image: his-dashboard:latest
    container_name: his-dashboard
    ports:
      - "8005:80"
    restart: unless-stopped
```
Chạy:
```bash
docker compose up -d
# Cập nhật:
docker compose build --no-cache && docker compose up -d
```

---

## 6) Cấu hình Nginx trong container

File `nginx.conf` đã cấu hình SPA routing:
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|ttf|svg)$ {
    try_files $uri =404;
    expires 7d;
    access_log off;
  }
}
```

Nếu cần HTTPS/public domain, đặt reverse proxy Nginx/Apache ở HOST (ngoài container) và trỏ đến `http://127.0.0.1:8005`.

---

## 7) Một số lệnh quản trị hữu ích

```bash
# Xem container đang chạy
docker ps

# Log realtime
docker logs -f his-dashboard

# Restart container
docker restart his-dashboard

# Stop & remove
docker stop his-dashboard && docker rm his-dashboard

# Xoá image cũ (khi cần dọn dẹp)
docker image prune -f
```

---

## 8) Troubleshooting

- Không truy cập được 8005: Kiểm tra firewall/SELinux, cổng đã mở chưa, container có listen 0.0.0.0:8005 không.
- Trắng trang khi refresh route: Đảm bảo `nginx.conf` có `try_files ... /index.html`.
- Build fail trên server cũ: Dockerfile dùng Node 20 để build, không phụ thuộc Node của máy chủ.
- Cập nhật không thấy thay đổi: Xác nhận build lại image thành công, container đang dùng image mới (`docker images`, `docker inspect`).

---

## 9) Quy trình đề xuất (tóm tắt)

- **Lần đầu:** Cài Docker -> `docker build -t his-dashboard:latest .` -> `docker run -d --name his-dashboard -p 8005:80 --restart unless-stopped his-dashboard:latest` -> mở cổng firewall.
- **Mỗi lần cập nhật code:** `docker build -t his-dashboard:latest .` -> `docker stop && docker rm` container cũ -> `docker run -d ...` lại.

> Có thể chuyển sang dùng `docker compose` để ngắn gọn, hoặc tích hợp CI/CD để tự động build/push và rollout trên server.
