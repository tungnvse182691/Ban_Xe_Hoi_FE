# FE SKILL STACK - WEB BÁN XE (FE FIRST - MOCK DATA)

> Mục tiêu: Làm xong toàn bộ giao diện trước, dùng Mock Data + Zustand + MSW, sau đó chỉ việc thay baseURL là nối BE C#.

---

## 1. BỘ SKILL ĐÃ NGHIÊN CỨU - DÙNG CHO DỰ ÁN NÀY

### Skill 1: Nền tảng (BẮT BUỘC)
- **Vite 5 + React 18 + TypeScript 5** - build nhanh, type an toàn
- **Tailwind CSS 3.4** - utility-first, responsive mobile-first, không viết CSS thuần
- **Ant Design 5** - component enterprise (Table, Form, DatePicker, Upload) cho Admin + form đăng tin. Kết hợp Tailwind để custom (không xung đột)
- *Alternative nếu muốn đẹp hơn:* `shadcn/ui` + Tailwind (nhưng Ant nhanh hơn cho web bán xe nhiều Table/Form)

### Skill 2: Định tuyến & Layout
- **React Router DOM 6.22** - `createBrowserRouter`, lazy loading pages, ProtectedRoute, AdminRoute
- Layout: `MainLayout` (Header/Footer) + `AdminLayout` (Sider + Header) - tách riêng, không lẫn

### Skill 3: Quản lý State & Data (QUAN TRỌNG khi FE-first)
- **Zustand 4.5** - nhẹ hơn Redux, lưu: authStore (user/token), favoriteStore, compareStore (tối đa 3 xe), filterStore (lưu query URL)
- **TanStack Query (React Query 5)** - cache, loading, pagination, infinite scroll. Khi FE-first thì queryFn đọc từ mock, sau này đổi sang axios là xong
- **Axios 1.6** - tạo `api.ts` với interceptors, nhưng khi FE-first thì chưa cần, dùng MSW intercept

### Skill 4: Form & Validate (Bán xe form rất dài)
- **React Hook Form 7 + Zod 3.23 + @hookform/resolvers** - performance cao, validate tiếng Việt, hiển thị lỗi ngay dưới input
- Dùng cho: Login, Register, PostCar (3 bước), Appointment

### Skill 5: Mock Data First (ĐỂ LÀM FE TRƯỚC KHÔNG CẦN BE)
- **MSW 2.2 (Mock Service Worker)** - intercept fetch/axios, trả về JSON giả như BE thật. Hoặc đơn giản hơn: `src/mocks/data.ts` (mảng 30 xe giả) + `src/mocks/handlers.ts`
- Cách làm: Tạo `carsMock: Car[]` 30 xe (đủ Hãng Toyota/Honda/VinFast, Giá 300tr-3 tỷ, Năm 2015-2024, Ảnh từ unsplash), `brandsMock`, `usersMock`. Sau đó `carService.ts` nếu `VITE_USE_MOCK=true` thì return mock, else gọi API. -> FE xong 100% trước BE.

### Skill 6: UI/UX Nâng cao cho web bán xe
- **react-hot-toast** - toast đẹp
- **dayjs** - format ngày, tính "Đăng 2 giờ trước"
- **antd Image.PreviewGroup** - gallery zoom
- **Swiper 11** - slider banner trang chủ, slider ảnh chi tiết
- **Recharts 2.12** - chart Admin (Pie/Bar/Line)
- **Leaflet / Google Map iframe** - hiển thị vị trí salon (optional)
- **react-helmet-async** - SEO title

### Skill 7: Tối ưu & Responsive
- Lazy loading: `React.lazy + Suspense`, `loading="lazy"` cho ảnh, `Skeleton` của Antd khi fetch
- Mobile-first: Tailwind `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, Header -> Drawer trên mobile
- Format: `formatPrice(price) => 1.250.000.000 VNĐ`, `formatMileage`

### Skill 8: Công cụ hỗ trợ dev
- **ESLint + Prettier** - có sẵn trong Vite
- **absolute import** `@/*` -> `@/components`, `@/pages`

---

## 2. THAM KHẢO GIAO DIỆN (Lấy ý tưởng trước khi code)

Trước khi code, xem 3 web này để chốt UI:
- bonbanh.com (VN) - filter rất chuẩn
- chotot.com/oto (VN) - CarCard đẹp
- cars.com / autotrader.com (US) - so sánh xe

Khuyên dùng Figma free: search "Car dealership template Figma" -> clone 1 file, lấy màu chủ đạo: `#1677ff` (Ant blue) + `#ff6b00` (cam CTA) + `#f5f5f5` (nền)

---

## 3. CẤU TRÚC THƯ MỤC FE (FE-FIRST)

```
frontend/
 ├─ src/
 │   ├─ components/
 │   │   ├─ common/ (Header, Footer, Breadcrumb, EmptyState, Loading)
 │   │   ├─ car/ (CarCard, CarGallery, CarSpecs, FilterPanel, CompareTable)
 │   │   └─ ui/ (nếu dùng shadcn)
 │   ├─ pages/
 │   │   ├─ Home.tsx
 │   │   ├─ CarList.tsx
 │   │   ├─ CarDetail.tsx
 │   │   ├─ Compare.tsx
 │   │   ├─ Favorites.tsx
 │   │   ├─ PostCar.tsx (3 steps)
 │   │   ├─ MyCars.tsx
 │   │   ├─ Appointments.tsx
 │   │   ├─ Login.tsx / Register.tsx
 │   │   └─ admin/ (Dashboard.tsx, PendingCars.tsx, Users.tsx)
 │   ├─ mocks/
 │   │   ├─ data.ts (30 cars, 5 brands, 10 models)
 │   │   └─ handlers.ts (MSW hoặc mock service)
 │   ├─ services/ (carService.ts, authService.ts - đọc mock trước)
 │   ├─ store/ (authStore.ts, compareStore.ts, favoriteStore.ts)
 │   ├─ types/ (Car.ts, User.ts, ApiResponse.ts)
 │   ├─ hooks/ (useCars, useDebounce, usePagination)
 │   ├─ utils/ (formatPrice, formatDate, constants)
 │   ├─ routes/index.tsx
 │   └─ App.tsx
 ├─ .env (VITE_USE_MOCK=true, VITE_API_URL=http://localhost:5000/api)
 └─ vite.config.ts
```

---

## 4. LỘ TRÌNH FE-FIRST (8 BƯỚC - MỖI BƯỚC 1 PROMPT)

| Bước | Tên | Mock gì | Kỹ năng chính |
|---|---|---|---|
| F0 | Setup + Design System | - | Vite+TS+Tailwind+Antd+Router+Zustand+Query |
| F1 | Layout + Home | carsMock (featured) | Header/Footer, Hero Search, CarCard, Swiper |
| F2 | Car List + Filter | carsMock 30 xe + filter logic FE | FilterPanel, useSearchParams, Pagination, Sort |
| F3 | Car Detail + Gallery | getCarById mock | Image.PreviewGroup, Specs grid, Seller Card |
| F4 | Auth UI (Mock) | usersMock | RHF+Zod, authStore, ProtectedRoute |
| F5 | Post Car + My Cars | localStorage lưu car mới tạo | Steps, Upload Dragger, Table status |
| F6 | Favorites + Compare | Zustand persist | compareStore max 3, favoriteStore |
| F7 | Admin Dashboard | stats mock | Recharts, AdminLayout, Table Pending |
| F8 | Polish + Nối BE | Thay VITE_USE_MOCK=false | Axios interceptors, thay service |

**Lợi ích FE-first:** Bạn thấy giao diện ngay, chốt UX trước, BE chỉ việc làm API đúng contract đã định.

---

## 5. MOCK DATA MẪU (Sẽ tạo sẵn ở F0)

```ts
// types/Car.ts
export type Car = {
  id: string;
  title: string; // "Toyota Vios 2022 1.5G CVT - Odo 25k"
  brand: string; // "Toyota"
  model: string; // "Vios"
  brandId: number;
  modelId: number;
  price: number; // 520000000
  year: number;
  mileage: number;
  fuel: 'Petrol'|'Diesel'|'Electric'|'Hybrid';
  transmission: 'MT'|'AT'|'CVT';
  condition: 'New'|'Used';
  location: string; // "Hà Nội"
  images: string[]; // 5 ảnh unsplash
  status: 'Approved'|'Pending'|'Sold';
  viewCount: number;
  seller: { name: string; phone: string; avatar: string };
}
```

Seed 30 xe với ảnh thật từ: https://source.unsplash.com/600x400/?car

---

## 6. BỘ PROMPT FE-FIRST ĐỂ DÁN SANG CHAT CODE

Xem file `PROMPT_FE_FIRST.md`
