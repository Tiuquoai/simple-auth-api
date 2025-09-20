# Simple Auth API

Ứng dụng Authentication cơ bản với Node.js, Express và MongoDB.  
Hỗ trợ các chức năng chính: Đăng ký, Đăng nhập, Lấy thông tin user (profile), Đăng xuất.

---

## Công nghệ sử dụng
- Node.js + Express (REST API)
- MongoDB + Mongoose (lưu user và session)
- express-session + connect-mongo (lưu session trong MongoDB)
- bcryptjs (hash mật khẩu)
- dotenv (biến môi trường)
- cookie-parser (tùy chọn, quản lý cookie phụ)

---

## Hướng dẫn cài đặt

1. Clone project hoặc copy source code về máy.  
2. Cài dependencies:
   ```bash
   npm install
3. Tạo file .env ở thư mục gốc:
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/myappdb
SESSION_SECRET=mysecretkey
4. Chạy server:
node app.js
Khi thành công, terminal sẽ hiển thị:

✅ MongoDB connected
🚀 Server running on http://localhost:3000

---

## API Endpoints
1. Đăng ký (Register)
POST /auth/register
Request body (JSON):
{
  "username": "demo",
  "password": "123456"
}

Response: { "message": "Đăng ký thành công" }
2. Đăng nhập (Login)
POST /auth/login
Request body (JSON):
{
  "username": "demo",
  "password": "123456"
}

Response: { "message": "Đăng nhập thành công" }
Khi đăng nhập thành công:
MongoDB tạo document trong collection sessions.
Client nhận cookie connect.sid (session ID) và cookie phụ username.
3. Lấy thông tin user (Profile)
GET /auth/profile
Response khi đã đăng nhập:
{
  "message": "Thông tin user hiện tại",
  "user": {
    "_id": "65c123abc...",
    "username": "demo"
  }
}
Nếu chưa đăng nhập:{ "message": "Chưa đăng nhập" }
4. Đăng xuất (Logout)
GET /auth/logout
Response: { "message": "Đăng xuất thành công, cookie đã được xóa" }
Khi logout:Session trong MongoDB bị xóa.
Cookie connect.sid và username trên client cũng bị clear.

---

## Quy trình test với Postman
Đăng ký → Gửi POST /auth/register với username + password mới.
Đăng nhập → Gửi POST /auth/login, nhận lại thông báo thành công và cookie.
Profile → Gửi GET /auth/profile, hiển thị thông tin user hiện tại.
Đăng xuất → Gửi GET /auth/logout, session và cookie bị xóa.
Profile lại → Gửi GET /auth/profile, kết quả trả về { "message": "Chưa đăng nhập" }.