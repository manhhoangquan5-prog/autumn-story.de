# 🚀 HƯỚNG DẪN DEPLOY LÊN GITHUB + VERCEL

## 📦 **DANH SÁCH FILES CẦN UPLOAD**

Bạn cần upload TẤT CẢ các files sau lên GitHub:

### **📁 Root Files (Thư mục gốc)**
```
/.gitignore
/App.tsx
/index.html
/main.tsx
/package.json
/postcss.config.js
/README.md
/tsconfig.json
/tsconfig.node.json
/vercel.json
/vite.config.js
```

### **📁 components/**
```
/components/AboutSection.tsx
/components/AdminDashboard.tsx
/components/AdminLogin.tsx
/components/AuthModal.tsx
/components/Cart.tsx
/components/Footer.tsx
/components/Header.tsx
/components/Hero.tsx
/components/Kasse.tsx
/components/OrderManagement.tsx
/components/ProductCard.tsx
/components/ProductForm.tsx
/components/ProductGrid.tsx
/components/figma/ImageWithFallback.tsx
```

### **📁 components/ui/** (Tất cả UI components)
```
/components/ui/accordion.tsx
/components/ui/alert-dialog.tsx
/components/ui/alert.tsx
... (tất cả files trong /components/ui/)
```

### **📁 styles/**
```
/styles/globals.css
```

### **📁 supabase/**
```
/supabase/functions/server/index.tsx
/supabase/functions/server/kv_store.tsx
```

### **📁 utils/**
```
/utils/supabase/client.tsx
/utils/supabase/info.tsx
```

---

## 🎯 **CÁCH UPLOAD NẾU KHÔNG CÓ ZIP FILE**

### **Option 1: Upload Từng File Qua Web (Chậm nhưng chắc chắn)**

1. Vào repository GitHub
2. Click **"Add file"** → **"Create new file"**
3. Nhập tên file (ví dụ: `App.tsx`)
4. Copy nội dung từ Figma Make → Paste vào GitHub
5. Click **"Commit changes"**
6. Lặp lại với TẤT CẢ files

**⚠️ Chú ý:** Để tạo folder, nhập tên như sau:
- `components/Header.tsx` (tự tạo folder components)
- `components/ui/button.tsx` (tự tạo folder components/ui)

---

### **Option 2: Dùng GitHub Desktop (KHUYẾN NGHỊ)** ⭐

Xem hướng dẫn dưới đây!

---

## 💡 **LƯU Ý**

- ✅ Upload TẤT CẢ files
- ✅ Giữ nguyên cấu trúc thư mục
- ✅ Không bỏ sót file nào
- ✅ File .gitignore phải có
- ✅ package.json phải có

---

## ❓ **NẾU GẶP LỖI**

Contact để được hỗ trợ chi tiết hơn!
