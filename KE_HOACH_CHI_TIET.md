# KẾ HOẠCH XÂY DỰNG WEB MUA BÁN XE HƠI CŨ & MỚI - C# + React

> Stack: **BE: ASP.NET Core 8 (C#) + EF Core + SQL Server | FE: React 18 + Vite + TypeScript | Auth: JWT + Refresh Token**

---

## 1. TỔNG QUAN & MỤC TIÊU

**Tên dự án:** Ban_Xe_Hoi
**Mô tả:** Sàn TMĐT cho phép cá nhân / showroom đăng tin bán xe cũ & mới, người mua tìm kiếm, lọc, so sánh, yêu thích, đặt lịch xem xe, chat với người bán. Admin kiểm duyệt tin, quản lý user, thống kê.
**Đối tượng:** Người mua xe, người bán cá nhân, Salon/Showroom, Admin

**Mục tiêu phi chức năng:**
- Responsive (Mobile-first)
- SEO tốt (cho trang danh sách xe, chi tiết xe)
- Tải nhanh < 2s (lazy image, pagination)
- Bảo mật: JWT, hash password (BCrypt), phân quyền RBAC, XSS/CSRF
- Mở rộng được: Clean Architecture

---

## 2. PHÂN TÍCH VAI TRÒ (RBAC)

| Vai trò | Quyền |
|---|---|
| **Guest (chưa đăng nhập)** | Xem danh sách xe, xem chi tiết, tìm kiếm/lọc, xem salon |
| **User / Buyer (đã đăng nhập)** | + Đăng tin bán xe, quản lý tin của mình, yêu thích, so sánh (tối đa 3 xe), đặt lịch xem xe, chat, đánh giá, đổi mật khẩu |
| **Seller (chính là User nhưng có tin đăng)** | Được hiển thị thông tin liên hệ, quản lý kho xe |
| **Admin** | Duyệt/từ chối/xóa tin, quản lý User, quản lý Hãng/Dòng xe, Banner, thống kê doanh số/lượt xem, quản lý báo cáo |

---

## 3. TECH STACK CHI TIẾT

### Backend - ASP.NET Core 8
```
- ASP.NET Core 8 Web API
- Entity Framework Core 8 + SQL Server (hoặc PostgreSQL nếu muốn free deploy)
- ASP.NET Identity + JWT Bearer + Refresh Token
- AutoMapper
- FluentValidation
- Swagger / Swashbuckle (OpenAPI)
- BCrypt.Net-Next (hash pass)
- Cloudinary / AWS S3 / Local Storage (ảnh xe) - Khuyên dùng Cloudinary free
- MailKit (gửi OTP/quên mk)
- Serilog (logging)
- Docker support
```
**Kiến trúc:** Clean Architecture (4 layer)
```
BanXeHoi.sln
 ├─ BanXeHoi.Domain (Entities, Enums, Interfaces)
 ├─ BanXeHoi.Application (DTOs, Services, Validators, Mappings, Interfaces)
 ├─ BanXeHoi.Infrastructure (DbContext, Repositories, JWT, Email, Cloudinary)
 └─ BanXeHoi.API (Controllers, Middlewares, Program.cs)
```

### Frontend - React
```
- React 18 + Vite + TypeScript
- React Router DOM v6
- State: Zustand (nhẹ, dễ) hoặc Redux Toolkit
- Data fetching: TanStack Query (React Query) + Axios
- UI: Ant Design 5 + Tailwind CSS (kết hợp)
- Form: React Hook Form + Zod
- Toast: react-hot-toast
- Image Upload: Ant Upload + preview
- Map: Leaflet (hiển thị vị trí salon)
- Chart (Admin): Recharts
- SEO: react-helmet-async
```

### Khác
- DB: SQL Server 2022 (local) / SQL Server trên Docker
- Git: master (main) + dev
- Deploy: FE -> Vercel, BE -> Azure / Railway / VPS + Docker + Nginx, DB -> Azure SQL / Supabase

---

## 4. THIẾT KẾ CSDL (ERD CHÍNH)

**Bảng chính (11 bảng):**

1.  **Users** (Id, FullName, Email, PasswordHash, Phone, Avatar, Role[User/Admin], Address, CreatedAt, IsActive)
2.  **Brands** (Id, Name, Logo, Slug) - Toyota, Honda, VinFast...
3.  **CarModels** (Id, BrandId, Name) - Vios, Civic, Fadil...
4.  **Cars** (Bảng trung tâm)
    - Id, SellerId (FK Users), BrandId, ModelId
    - Title, Description
    - Condition: New/Used (Enum)
    - Price, Year, Mileage (Odo), FuelType (Xăng/Dầu/Điện/Hybrid), Transmission (MT/AT/CVT), EngineCapacity, Color, Seats, Origin (Nhập/Lắp ráp)
    - Status: Pending/Approved/Rejected/Sold/Hidden (Enum) - để Admin duyệt
    - ViewCount, Location (Tỉnh/Thành), CreatedAt, UpdatedAt
5.  **CarImages** (Id, CarId, ImageUrl, IsMain, PublicId - cho Cloudinary)
6.  **Favorites** (UserId, CarId) - Many-to-Many
7.  **Appointments** (Id, CarId, BuyerId, SellerId, AppointmentDate, Status[Pending/Confirmed/Cancelled/Done], Note, Phone)
8.  **Conversations / Messages** (Đơn giản: SenderId, ReceiverId, CarId, Content, CreatedAt) - hoặc dùng SignalR sau
9.  **Reviews** (Id, CarId, UserId, Rating, Comment, CreatedAt)
10. **Notifications** (Id, UserId, Title, Message, IsRead, Link)
11. **Banners / News** (Id, Title, ImageUrl, Link) - cho trang chủ

**Quan hệ:** User 1-N Cars, Car N-1 Brand/Model, Car 1-N CarImages, User N-N Favorites

---

## 5. THIẾT KẾ API (RESTful - Prefix /api)

```
Auth:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/change-password  [Authorize]

Brands/Models:
GET /api/brands
POST /api/brands [Admin]
GET /api/models?brandId=...

Cars:
GET /api/cars?search=&brandId=&modelId=&condition=&minPrice=&maxPrice=&fuel=&transmission=&yearFrom=&yearTo=&sort=&page=&pageSize=
GET /api/cars/{id} (tăng ViewCount)
POST /api/cars [Authorize] (Seller đăng tin - Status=Pending)
PUT /api/cars/{id} [Authorize-Owner]
DELETE /api/cars/{id} [Authorize-Owner/Admin]
PATCH /api/cars/{id}/status [Admin] {status: Approved/Rejected/Sold}
GET /api/cars/my-listings [Authorize]
POST /api/cars/{id}/images [Authorize]
GET /api/cars/featured (xe nổi bật trang chủ)
POST /api/cars/{id}/compare (logic FE, BE chỉ cần get by ids)

Favorites:
GET /api/favorites [Authorize]
POST /api/favorites/{carId} [Authorize]
DELETE /api/favorites/{carId} [Authorize]

Appointments:
POST /api/appointments [Authorize]
GET /api/appointments/my-requests [Authorize] (buyer)
GET /api/appointments/received [Authorize] (seller)
PATCH /api/appointments/{id}/status [Authorize]

Admin:
GET /api/admin/stats (tổng xe, user, tin chờ duyệt, view)
GET /api/admin/cars/pending
GET /api/users [Admin]
PATCH /api/users/{id}/ban [Admin]
```

---

## 6. THIẾT KẾ GIAO DIỆN (FE PAGES)

```
/ (Trang chủ): Banner search, Xe nổi bật, Xe mới, Xe cũ, Thương hiệu, Salon uy tín
/cars (Danh sách): Filter sidebar (Hãng, Giá, Năm, Nhiên liệu, Hộp số, Tình trạng), Sort, Pagination, Grid/List view
/cars/:id (Chi tiết): Gallery ảnh, Thông số, Mô tả, Thông tin người bán, Nút: Yêu thích, So sánh, Đặt lịch, Chat, Gợi ý xe tương tự
/compare?ids=1,2,3 (So sánh)
/login, /register, /forgot-password
/profile (Thông tin cá nhân)
/my-cars (Quản lý tin đăng): Table + Trạng thái + Edit/Delete
/post-car (Đăng tin): Form multi-step (Thông tin cơ bản -> Thông số -> Ảnh -> Xem trước)
/favorites (Yêu thích)
/appointments (Lịch hẹn)
/admin/* (Dashboard, Duyệt tin, Quản lý user, Quản lý hãng, Thống kê chart)

/Components chung: Header, Footer, CarCard, FilterPanel, ImageUploader, Breadcrumb
```

---

## 7. LỘ TRÌNH 9 GIAI ĐOẠN (ROADMAP) - QUAN TRỌNG

| Giai đoạn | Tên | Thời gian ước tính | Mục tiêu |
|---|---|---|---|
| **0** | Khởi tạo dự án | 1 buổi | Tạo Solution, React App, chạy được Hello World, kết nối BE-FE, setup Git |
| **1** | Auth & User | 2-3 ngày | Register/Login/JWT/Refresh, Guards, Profile |
| **2** | Danh mục & CRUD Xe (BE) | 2-3 ngày | Brands, Models, Cars CRUD, Upload ảnh Cloudinary, Phân trang |
| **3** | Giao diện Danh sách & Chi tiết (FE) | 2-3 ngày | Trang chủ, List + Filter, Detail, ViewCount |
| **4** | Đăng tin & Duyệt tin | 2 ngày | Form đăng tin, My Cars, Admin duyệt (Pending->Approved) |
| **5** | Yêu thích / So sánh / Tìm kiếm nâng cao | 1-2 ngày | Favorite, Compare 3 xe, Search autocomplete |
| **6** | Đặt lịch & Chat & Thông báo | 2 ngày | Appointment, SignalR chat đơn giản hoặc form liên hệ |
| **7** | Admin Dashboard | 2 ngày | Stats, Charts, Quản lý user/banner |
| **8** | Hoàn thiện & Deploy | 1-2 ngày | Validation, Loading/Error, Responsive, SEO, Docker, Deploy Vercel + Railway |
| **9** | Mở rộng (Optional) | - | AI định giá xe cũ, thanh toán đặt cọc VNPay/MoMo, Map salon |

**Thứ tự code khuyên dùng:** Làm xong BE API nào thì làm luôn FE page đó (song song) để test ngay.

---

## 8. QUY ƯỚC CODE

- BE: Controller -> Service -> Repository, DTO riêng cho Request/Response, FluentValidation cho mọi DTO, Global Exception Middleware, Response chuẩn { success, message, data }
- FE: pages/ (mỗi route 1 folder), components/, hooks/, services/api.ts (axios instance), store/, types/, utils/
- Đặt tên: PascalCase (C#), camelCase (TS), kebab-case file FE
- Commit: `feat: auth login`, `fix: car filter price`, `chore: setup docker`

---

## 9. BỘ PROMPT COPY-PASTE CHO CHAT CODE (BÊN KIA)

> Bạn chỉ cần copy từng prompt dưới đây, dán sang cuộc trò chuyện Code (bên kia) theo thứ tự. Mỗi prompt là 1 giai đoạn hoàn chỉnh.

Xem file `PROMPT_CHO_CHAT_CODE.md`
