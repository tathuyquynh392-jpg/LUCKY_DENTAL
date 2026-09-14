# LUCKY DENTAL - Hệ Thống Quản Lý Nha Khoa Chuyên Nghiệp

> **Slogan**: "Chăm sóc nụ cười – Kiến tạo tự tin"

Website quản lý phòng khám nha khoa **LUCKY DENTAL** xây dựng bằng **React**, **Vite**, **JavaScript/JSX**, **HTML/CSS**, kết hợp **LocalStorage State Persistence Engine** để phục vụ việc Deploy tự động và chạy trực tiếp trên **GitHub Pages** mà không cần tới máy chủ localhost.

---

## 🌟 GitHub Pages Live Demo

- **URL GitHub Pages**: [https://tathuyquynh392-jpg.github.io/LUCKY_DENTAL/](https://tathuyquynh392-jpg.github.io/LUCKY_DENTAL/)
- **Vite Base Path**: `/LUCKY_DENTAL/`
- **SPA Routing Handler**: Đã cấu hình `404.html` và `index.html` script redirect để không bị lỗi 404 khi người dùng refresh hoặc F5 trang.

---

## 🔑 Tài Khoản Demo

| Vai trò | Username / Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **ADMIN (Quản trị)** | `admin` hoặc `admin@luckydental.com` | `admin123` | Quản lý toàn bộ 14 module hệ thống, CRUD bệnh nhân, bác sĩ, lịch hẹn, hồ sơ, hóa đơn, doanh thu... |
| **PATIENT (Bệnh nhân)** | `patient` hoặc `patient@luckydental.com` | `patient123` | Đặt lịch khám trực tuyến, xem lịch hẹn cá nhân, xem bệnh án, đơn thuốc, hóa đơn và nhận thông báo. |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React, Vite, React Router DOM, Lucide React Icons.
- **Styling**: Modern CSS System (Plus Jakarta Sans, Medical Cyan Theme, Glassmorphism, Responsive Grid).
- **Persistence**: LocalStorage Engine với dữ liệu mẫu (Seed Data) phòng khám chuẩn hóa tiếng Việt.
- **Deployment**: GitHub Pages + GitHub Actions (`.github/workflows/deploy.yml`).

---

## 🚀 Hướng Dẫn Chạy Local

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Chạy Môi Trường Dev (Development Mode)
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173/LUCKY_DENTAL/` hoặc `http://localhost:5173/`

### 3. Kiểm Tra Build Production & Preview
```bash
npm run build
npm run preview
```

---

## 📦 Hướng Dẫn Deploy Lên GitHub Pages

### Bước 1: Commit và Push Code lên Branch `main`
```bash
git add .
git commit -m "Fix Lucky Dental GitHub Pages deployment & complete features"
git push origin main
```

### Bước 2: Bật GitHub Pages trên Repository GitHub
1. Vào repository: `https://github.com/tathuyquynh392-jpg/LUCKY_DENTAL`
2. Chọn **Settings** -> **Pages**.
3. Tại phần **Build and deployment** -> **Source**, chọn **GitHub Actions**.
4. Workflow trong `.github/workflows/deploy.yml` sẽ tự động build và deploy website.
