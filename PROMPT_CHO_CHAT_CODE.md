# BỘ PROMPT ĐỂ DÁN SANG CHAT CODE (BE C# + FE React)

> Hướng dẫn sử dụng:
> 1. Mở cuộc trò chuyện thứ 2 (chat Code).
> 2. Copy **nguyên văn** từng PROMPT bên dưới, dán và gửi theo thứ tự từ 0 -> 8.
> 3. Đợi chat Code làm xong, test ok rồi mới dán PROMPT tiếp theo.
> 4. Nếu gặp lỗi, copy lỗi dán lại cho chat Code sửa trước khi qua bước sau.

---

### PROMPT 0: KHỞI TẠO DỰ ÁN

```
Tôi đang làm web mua bán xe hơi cũ & mới. Stack: BE ASP.NET Core 8 + EF Core + SQL Server, FE React 18 + Vite + TypeScript + Ant Design + Tailwind + Zustand + React Query.

Yêu cầu PROMPT 0 - Khởi tạo dự án trong thư mục D:\Ban_Xe_Hoi:

1. Backend: Tạo solution BanXeHoi.sln với 4 project theo Clean Architecture:
   - BanXeHoi.Domain (Classlib)
   - BanXeHoi.Application (Classlib)
   - BanXeHoi.Infrastructure (Classlib)
   - BanXeHoi.API (Web API)
   Thêm reference: API -> Application -> Domain, Infrastructure -> Application, API -> Infrastructure
   Cài package: Microsoft.EntityFrameworkCore.SqlServer, Microsoft.EntityFrameworkCore.Tools, AutoMapper, FluentValidation.AspNetCore, Swashbuckle.AspNetCore, Microsoft.AspNetCore.Authentication.JwtBearer, BCrypt.Net-Next, Serilog.AspNetCore
   Cấu hình Program.cs: Swagger, CORS cho http://localhost:5173, Serilog, appsettings.json (ConnectionStrings, Jwt: Key/Issuer/Audience/ExpireMinutes)
   Tạo thư mục cho Clean Architecture.

2. Frontend: Tạo React app bằng Vite + TS trong folder `frontend`:
   npm create vite@latest frontend -- --template react-ts
   Cài: react-router-dom, axios, zustand, @tanstack/react-query, antd, tailwindcss, react-hook-form, zod, @hookform/resolvers, react-hot-toast, dayjs, recharts
   Setup Tailwind (init + config), setup Ant Design, tạo cấu trúc: src/pages, src/components, src/services/api.ts (axios instance baseURL http://localhost:5000/api), src/store, src/types, src/hooks, src/utils
   Cấu hình React Router với các route rỗng: /, /cars, /login, /admin
   Tạo Header/Footer layout cơ bản.

3. Chạy thử: dotnet run (BE chạy ở 5000) và npm run dev (FE 5173) phải Hello World được.
   Tạo README.md hướng dẫn chạy.

Không cần code Auth/Car vội, chỉ cần khởi tạo chạy được. Dùng .NET 8.
```

---

### PROMPT 1: AUTH & JWT

```
Tiếp tục dự án Ban_Xe_Hoi. PROMPT 1 - XÁC THỰC & PHÂN QUYỀN:

Backend (BanXeHoi.*):
1. Tạo Entity User (Id Guid, FullName, Email, PasswordHash, Phone, Avatar, Role enum [User, Admin], Address, CreatedAt, IsActive)
   Tạo DbContext ApplicationDbContext với DbSet<User>, cấu hình SQL Server, tạo Migration InitialCreate và update-database.
   Seed 1 tài khoản Admin: admin@banxehoi.com / Admin@123

2. Tạo DTOs: RegisterRequest (FullName, Email, Password, ConfirmPassword, Phone), LoginRequest, AuthResponse (Token, RefreshToken, User), RefreshToken entity (lưu DB hoặc in-memory).
   Dùng FluentValidation cho Register/Login, BCrypt hash, JWT tạo AccessToken (15p) + RefreshToken (7 ngày).

3. Tạo AuthService (Register, Login, RefreshToken, ChangePassword) và AuthController (/api/auth/register, /api/auth/login, /api/auth/refresh-token, /api/auth/me [Authorize])
   Cấu hình JWT Authentication trong Program.cs, Swagger thêm JWT Bearer.

4. Tạo Middleware Global Exception + Response chuẩn ApiResponse<T> { success, message, data }

Frontend (frontend/src):
1. Tạo pages: Login.tsx, Register.tsx, dùng React Hook Form + Zod validate, gọi API qua axios, lưu token vào localStorage + Zustand authStore (user, token, isAuthenticated).
2. Tạo axios interceptor: tự gắn Authorization header, tự refresh token khi 401.
3. Tạo ProtectedRoute component, Header hiển thị Login/Register khi chưa đăng nhập, Avatar + Dropdown khi đã đăng nhập (Profile, My Cars, Logout). Role Admin thì hiện link /admin.

Test: Đăng ký, đăng nhập, gọi /api/auth/me phải trả về user, FE login xong chuyển hướng / và lưu token.
```

---

### PROMPT 2: DANH MỤC & CRUD XE (BACKEND NÒNG CỐT)

```
PROMPT 2 - DANH MỤC & QUẢN LÝ XE (CORE):

Backend:
1. Tạo Entities: Brand (Id, Name, Logo, Slug), CarModel (Id, BrandId, Name), Car (Id, SellerId FK User, BrandId, ModelId, Title, Description, Condition enum [New, Used], Price decimal, Year int, Mileage int, FuelType enum [Petrol, Diesel, Electric, Hybrid], Transmission enum [MT, AT, CVT], EngineCapacity, Color, Seats, Origin enum [Imported, Domestic], Status enum [Pending, Approved, Rejected, Sold], ViewCount, Location (TinhThanh), CreatedAt, UpdatedAt), CarImage (Id, CarId, ImageUrl, IsMain, PublicId)
   Cấu hình quan hệ Fluent API, tạo Migration AddCarEntities và update-database. Seed 5 Brands (Toyota, Honda, Mazda, VinFast, Kia) + 10 Models.

2. Tạo DTOs: CreateCarRequest, UpdateCarRequest, CarResponse (kèm BrandName, ModelName, SellerName, Images), PagedResult<T>, CarFilterParams (search, brandId, modelId, condition, minPrice, maxPrice, fuel, transmission, yearFrom, yearTo, sortBy, page, pageSize)
   AutoMapper Profile cho Car.

3. Tạo Service/Repository: ICarService với GetPaged, GetById (tăng ViewCount), Create (SellerId từ JWT, Status=Pending), Update (chỉ Owner hoặc Admin), Delete, UpdateStatus (Admin duyệt), GetMyCars, GetFeatured.
   Tích hợp Cloudinary (hoặc lưu local wwwroot/uploads nếu chưa có key): Upload ảnh xe (tối đa 10 ảnh), set IsMain.

4. Tạo Controllers: BrandsController (GET /api/brands, POST [Admin]), CarModelsController (GET /api/models?brandId), CarsController đủ 8 endpoint như kế hoạch: GET /api/cars (filter+paging+sort), GET /api/cars/{id}, POST /api/cars [Authorize], PUT /api/cars/{id} [Authorize], DELETE /api/cars/{id}, PATCH /api/cars/{id}/status [Admin], GET /api/cars/my-listings [Authorize], GET /api/cars/featured

Frontend:
1. Chưa cần UI đẹp, chỉ cần test API: Tạo service carService.ts (getCars, getCarById...), dùng React Query để gọi thử trong trang tạm TestCars.tsx hiển thị list JSON.

Validate kỹ FluentValidation cho CreateCarRequest (Price >0, Year 1990-now, Title min 10 chars).
Phân trang: pageSize mặc định 12, sortBy: newest, priceAsc, priceDesc, yearDesc.
```

---

### PROMPT 3: TRANG CHỦ + DANH SÁCH + CHI TIẾT XE (FE)

```
PROMPT 3 - GIAO DIỆN CHÍNH (FE):

Dùng Ant Design + Tailwind, mobile responsive.

1. Layout: Header (Logo, Menu: Trang chủ, Xe mới, Xe cũ, Bán xe, Yêu thích, Đăng nhập), Footer (thông tin liên hệ, mạng xã hội), Breadcrumb.

2. Trang chủ (/):
   - Hero Banner: Search bar (Ô tìm kiếm + Nút Tìm) + Filter nhanh (Hãng, Giá, Tình trạng)
   - Section Xe nổi bật (lấy /api/cars/featured - 8 xe ViewCount cao)
   - Section Xe mới / Xe cũ (mỗi section 4-8 xe)
   - Section Thương hiệu (grid logo Brand click -> /cars?brandId=)
   - Dùng component CarCard (Ảnh chính, Title, Price format VNĐ, Year - Mileage - Fuel - Location, Nút Yêu thích)

3. Trang danh sách (/cars):
   - Đọc query params từ URL (useSearchParams) để filter không bị mất khi reload.
   - Sidebar Filter: Brand (Select), Model (cascading theo Brand), Khoảng giá (Slider 0-5 tỷ), Năm, Nhiên liệu, Hộp số, Tình trạng, Màu sắc.
   - Toolbar: Tổng số xe, Sort (Mới nhất, Giá thấp-cao), Chế độ Grid/List, Pagination (12 xe/trang)
   - Gọi GET /api/cars với filter, hiển thị CarCard, Skeleton loading, Empty state.

4. Trang chi tiết (/cars/:id):
   - Gallery: Ảnh lớn + thumbnail, click zoom (dùng antd Image.PreviewGroup)
   - Cột trái: Title, Giá, Thông số dạng grid (Năm, Odo, Nhiên liệu, Hộp số, Động cơ, Màu, Số chỗ, Xuất xứ) + Mô tả + Badge Tình trạng (Mới/Cũ)
   - Cột phải: Card Người bán (Avatar, Tên, Phone, Location) + Nút Gọi, Chat, Đặt lịch xem xe + Nút Yêu thích/So sánh + Share
   - Tăng ViewCount khi vào trang, hiển thị ViewCount.
   - Section Xe tương tự (cùng Brand hoặc tầm giá +-20%).

Format giá: toLocaleString('vi-VN') + " VNĐ". Dùng dayjs format ngày.
```

---

### PROMPT 4: ĐĂNG TIN & QUẢN LÝ TIN & DUYỆT TIN

```
PROMPT 4 - ĐĂNG TIN & DUYỆT:

Frontend:
1. Trang Đăng tin (/post-car) [ProtectedRoute]: Form 3 bước (Steps của Ant Design)
   - Bước 1: Thông tin cơ bản (Title, Brand -> Model cascading, Condition, Price, Year, Location)
   - Bước 2: Thông số (Mileage, Fuel, Transmission, EngineCapacity, Color, Seats, Origin, Description textarea 200-2000 ký tự)
   - Bước 3: Ảnh (Upload Dragger, tối đa 10 ảnh, preview, chọn ảnh chính, validate ít nhất 3 ảnh, dung lượng <5MB/ảnh, định dạng jpg/png)
   - Bước 4: Xem trước + Submit -> POST /api/cars (hiển thị toast "Tin của bạn đang chờ duyệt")
   - Dùng React Hook Form + Zod, gọi API upload ảnh trước hoặc gửi FormData.

2. Trang Quản lý tin (/my-cars) [Authorize]: Table (Ảnh, Title, Giá, Trạng thái badge màu: Pending vàng, Approved xanh, Rejected đỏ, Sold xám, ViewCount, Ngày đăng) + Action Edit/Delete/View. Nút Edit chỉ khi Pending/Rejected, Delete confirm Popconfirm.

3. Trang Admin Duyệt tin (/admin/cars): Table tin Pending, Nút Duyệt (PATCH /api/cars/{id}/status {status: Approved}) và Từ chối (Rejected + lý do). Dùng Tag màu, Modal xác nhận.
   Thêm route /admin/brands để Admin CRUD Brand/Model (đơn giản).

Backend: Đảm bảo Policy: Chỉ Owner mới được PUT/DELETE xe của mình, Admin được duyệt. Middleware [Authorize(Roles="Admin")] cho endpoint duyệt.
```

---

### PROMPT 5: YÊU THÍCH & SO SÁNH & TÌM KIẾM NÂNG CAO

```
PROMPT 5 - YÊU THÍCH, SO SÁNH, SEARCH:

Backend:
1. Tạo bảng Favorites (UserId, CarId, CreatedAt) composite key, tạo FavoriteService + FavoritesController: GET /api/favorites [Authorize], POST /api/favorites/{carId}, DELETE /api/favorites/{carId}, check isFavorited trong CarResponse (field IsFavorited khi có token)

Frontend:
1. Yêu thích:
   - Nút tim trên CarCard và trang chi tiết: click -> gọi POST/DELETE, optimistic update, toast, đổi màu tim đỏ. Nếu chưa login -> redirect /login.
   - Trang /favorites: Grid CarCard đã thích, nút Xóa khỏi yêu thích, Empty "Chưa có xe yêu thích".

2. So sánh (Compare):
   - Nút "So sánh" trên CarCard/Detail: thêm vào Zustand compareStore (tối đa 3 xe, lưu ids vào localStorage), Header hiện badge số xe đang so sánh.
   - Trang /compare?ids=1,2,3: Lấy chi tiết 3 xe (gọi /api/cars?ids=... hoặc 3 lần getById), hiển thị Table so sánh: Hàng là thuộc tính (Giá, Năm, Odo, Nhiên liệu, Hộp số, Động cơ...), Cột là xe, highlight giá rẻ nhất/năm mới nhất. Nút Xóa khỏi so sánh, Nút Xóa tất cả.

3. Tìm kiếm nâng cao:
   - Search bar autocomplete: khi gõ 2 ký tự -> gọi /api/cars?search=... hiển thị 5 gợi ý (Title + ảnh nhỏ) trong Dropdown.
   - Lưu lịch sử tìm kiếm vào localStorage (5 từ khóa gần nhất).

Toast khi vượt quá 3 xe so sánh: "Chỉ so sánh tối đa 3 xe".
```

---

### PROMPT 6: ĐẶT LỊCH XEM XE & LIÊN HỆ (CHAT ĐƠN GIẢN)

```
PROMPT 6 - APPOINTMENT & CONTACT:

Backend:
1. Tạo Entity Appointment (Id Guid, CarId FK, BuyerId FK, SellerId FK, AppointmentDate DateTime, Status enum [Pending, Confirmed, Cancelled, Done], Note, Phone, CreatedAt)
   Tạo AppointmentsController: POST /api/appointments [Authorize] (Buyer đặt lịch, body: carId, appointmentDate, phone, note, tự lấy sellerId từ Car), GET /api/appointments/my-requests (buyer), GET /api/appointments/received (seller - xe của mình), PATCH /api/appointments/{id}/status (seller confirm/cancel)

2. (Optional) Tạo endpoint POST /api/cars/{id}/contact (gửi email/inbox): lưu vào Notifications hoặc gửi MailKit tới email Seller.

Frontend:
1. Đặt lịch:
   - Trong trang chi tiết, nút "Đặt lịch xem xe" -> Modal Form (DatePicker (chỉ cho chọn từ ngày mai), TimePicker, Phone, Note)
   - Validate: AppointmentDate > now, Phone regex VN.
   - Sau khi đặt -> toast "Đã gửi yêu cầu, người bán sẽ liên hệ".
   - Trang /appointments: 2 Tab (Yêu cầu của tôi - Buyer, Lịch hẹn nhận được - Seller). Mỗi card hiển thị thông tin xe + ngày hẹn + trạng thái badge + Nút Xác nhận/Hủy (nếu là Seller và status Pending)

2. Chat/Liên hệ:
   - Nút "Chat với người bán" -> Modal hiển thị SĐT + Nút Gọi (tel:) + Form gửi tin nhắn (lưu vào backend Messages đơn giản hoặc chỉ là mailto).
   - Nếu làm SignalR: tạo Hub ChatHub đơn giản, lưu Messages (SenderId, ReceiverId, CarId, Content).

Dùng Ant DatePicker, Tag status màu, Popconfirm cho Hủy lịch.
```

---

### PROMPT 7: ADMIN DASHBOARD & THỐNG KÊ

```
PROMPT 7 - ADMIN DASHBOARD:

Backend: Tạo AdminController GET /api/admin/stats [Admin] trả về { totalUsers, totalCars, pendingCars, approvedCars, soldCars, totalViews, carsByBrand: [{brandName, count}], carsByCondition: [...], recentCars: [...] } (dùng LINQ group by)

Frontend: Trang /admin (layout riêng AdminLayout với Sider menu: Dashboard, Duyệt tin, Quản lý User, Quản lý Hãng)
1. Dashboard:
   - 4 Card Statistic (Tổng User, Tổng Xe, Chờ duyệt, Tổng lượt xem) dùng Ant Statistic
   - Biểu đồ: Pie (Xe theo hãng), Bar (Xe theo tình trạng Mới/Cũ), Line (Xe đăng theo 7 ngày gần nhất) dùng Recharts
   - Table Xe mới nhất (5 xe) + Table Tin chờ duyệt (5 tin) có nút duyệt nhanh.

2. Quản lý User (/admin/users): Table (Avatar, Tên, Email, Phone, Role, Trạng thái, Ngày tạo) + Nút Ban/Unban (PATCH /api/users/{id}/ban) + Search + Pagination.

3. Quản lý Banner/QC (đơn giản): CRUD banner cho trang chủ (nếu không cần thì bỏ qua, chỉ cần stats).

Phân quyền FE: Nếu user.Role !== Admin thì redirect / và toast "Không có quyền".
```

---

### PROMPT 8: HOÀN THIỆN, VALIDATION, RESPONSIVE & DEPLOY

```
PROMPT 8 - FINAL POLISH & DEPLOY:

1. Hoàn thiện chung:
   - Thêm Global Loading (Spin fullscreen khi gọi API), ErrorBoundary, 404 NotFound page, Empty state cho mọi list.
   - Validation FE+BE đồng bộ, hiển thị lỗi tiếng Việt.
   - Format lại toàn bộ giá VNĐ, ngày giờ vi-VN, xử lý XSS (không render HTML thô).
   - Tối ưu ảnh: lazy loading (loading="lazy"), Cloudinary transform w_600, pagination, skeleton.
   - Responsive: Test 375px, 768px, 1024px (Tailwind breakpoints), Header thành Drawer trên mobile.

2. SEO cơ bản:
   - Dùng react-helmet-async set title/description cho /, /cars, /cars/:id (title = Car.Title + " - BanXeHoi")
   - Tạo sitemap cơ bản, thêm meta OG image (ảnh chính của xe).

3. Bảo mật & Hiệu năng:
   - Rate limiting cho login (nếu chưa có), CORS chặt, không log password.
   - Thêm index cho Car (BrandId, Price, Status), bật Response Caching cho GET /api/brands.

4. Deploy:
   - Backend: Thêm Dockerfile (mcr.microsoft.com/dotnet/aspnet:8.0, expose 5000), docker-compose với sql-server nếu cần, hướng dẫn deploy lên Railway/Azure.
   - Frontend: Build (npm run build), deploy Vercel (cấu hình VITE_API_URL env), test production.
   - Viết README.md đầy đủ: Cách chạy local (dotnet ef update, npm i), tài khoản test (admin/user), danh sách API, ảnh demo.

5. Viết file TEST_MANUAL.md liệt kê 10 luồng test chính: Đăng ký->Đăng nhập->Đăng tin->Admin duyệt->Tìm kiếm->Yêu thích->So sánh->Đặt lịch->Seller xác nhận->Admin xem stats.

Đây là prompt cuối, sau khi xong thì dự án coi như hoàn chỉnh MVP.
```

---

### PROMPT PHỤ (DÙNG KHI CẦN SỬA LỖI)

```
Nếu gặp lỗi, dán prompt này kèm log lỗi:

"Đang gặp lỗi như sau: [paste lỗi]. Hãy sửa trong dự án Ban_Xe_Hoi, giữ nguyên cấu trúc Clean Architecture và không xóa code cũ ngoài phần lỗi. Giải thích nguyên nhân và cách fix ngắn gọn."
```

