# 🍂 Autumn Store - E-Commerce Website

Một trang web bán hàng đầy đủ tính năng với React, TypeScript, Tailwind CSS và Supabase.

## ✨ Tính Năng

- 🛍️ **E-Commerce đầy đủ:** Giỏ hàng, thanh toán, quản lý sản phẩm
- 🌍 **Đa ngôn ngữ:** Tiếng Việt, English, Deutsch
- 💳 **Thanh toán:** Chuyển khoản ngân hàng & PayPal
- 👨‍💼 **Admin Dashboard:** Quản lý sản phẩm, đơn hàng (Login: admin/admin123)
- 🎨 **Theme:** Pastel gradient (rose, orange, amber)
- 📱 **Responsive:** Hoạt động trên mọi thiết bị
- 🔐 **Backend:** Supabase (Database + Auth + Storage)

## 🚀 Deploy lên Vercel

### Bước 1: Push lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/autumn-store.git
git push -u origin main
```

### Bước 2: Deploy Vercel
1. Vào [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Vercel tự động detect Vite và deploy
4. Thêm domain `autumn-story.de`

### Bước 3: Cấu hình Supabase
Sau khi deploy, cập nhật Supabase Authentication:
- Site URL: `https://autumn-story.de`
- Redirect URLs: `https://autumn-story.de/**`

## 🔧 Local Development

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📦 Environment Variables (Supabase)

Các biến môi trường đã được cấu hình sẵn trong code:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 👨‍💼 Admin Access

- Username: `admin`
- Password: `admin123`

## 📄 License

MIT License - Feel free to use for your projects!
