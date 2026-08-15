# AI CODE Studio & AI Vision (Full-Stack Web App)

Ứng dụng tích hợp trọn vẹn Google Gemini 2.5/2.0 API, AI Hermes Agent tự hành, AI Vision, Code Studio và trợ lý iPhone Widget.

---

## 📦 Cách xuất mã nguồn và tạo ứng dụng hoàn chỉnh

### 1. Xuất file mã nguồn trực tiếp từ Google AI Studio
- Bấm vào menu **Settings / Export** ở góc trên cùng bên phải giao diện AI Studio.
- Chọn **Export to ZIP** để tải toàn bộ source code đã đóng gói về máy tính.
- Hoặc chọn **Export to GitHub** để đẩy trực tiếp lên kho lưu trữ GitHub của bạn.

---

## 🚀 Hướng dẫn cài đặt & chạy ứng dụng cục bộ (Local / VPS)

### Yêu cầu:
- Node.js version 18+ (khuyên dùng Node.js 20 LTS)
- npm hoặc yarn / pnpm

### Các bước chạy:
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Tạo file cấu hình biến môi trường
cp .env.example .env
# Thêm khóa API: GEMINI_API_KEY=your_gemini_api_key_here

# 3. Chạy môi trường phát triển (Dev)
npm run dev

# 4. Đóng gói bản Production hoàn chỉnh
npm run build

# 5. Khởi chạy server Production
npm start
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 🐳 Đóng gói bằng Docker (Containerized App)

```bash
# Xây dựng Docker Image
docker build -t ai-code-studio .

# Khởi chạy Container
docker run -d -p 3000:3000 -e GEMINI_API_KEY="your_api_key" --name ai-app ai-code-studio
```

---

## 📱 Cài đặt thành App trên Điện thoại (iOS / Android PWA)

Ứng dụng đã được tích hợp sẵn chuẩn **Progressive Web App (PWA)**:
- **Trên iPhone / iPad (Safari)**:
  1. Mở liên kết ứng dụng bằng trình duyệt Safari.
  2. Bấm nút **Chia sẻ** (biểu tượng hình vuông có mũi tên hướng lên).
  3. Chọn **Thêm vào MH chính (Add to Home Screen)**.
  4. Ứng dụng sẽ hiển thị icon riêng và chạy toàn màn hình độc lập như một Native App.
- **Trên Android (Chrome)**:
  1. Mở liên kết ứng dụng trên Google Chrome.
  2. Bấm biểu tượng 3 chấm ở góc phải trên.
  3. Chọn **Cài đặt ứng dụng (Install App)**.

---

## 💻 Đóng gói thành App Desktop (Windows .exe, macOS .dmg, Linux .AppImage)

Dự án đã tích hợp sẵn tệp điều khiển Electron (`electron/main.cjs`):

```bash
# 1. Cài đặt các thư viện AI và Electron (nếu chưa có)
npm install @langchain/google-genai lucide-react framer-motion
npm install -D electron electron-builder

# 2. Build bản web & backend tối ưu
npm run build

# 3. Đóng gói thành App Desktop cài đặt tự động (.exe / .dmg / .AppImage)
npx electron-builder
```
Tệp cài đặt phần mềm máy tính Desktop hoàn chỉnh sẽ được lưu trữ tự động trong thư mục `dist/`!

