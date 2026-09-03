# BỘ PROMPT FE-FIRST - DÁN SANG CHAT CODE (LÀM GIAO DIỆN TRƯỚC)

> Thứ tự: F0 -> F7 là xong FE 100% với mock data. Sau đó mới làm BE.
> Mỗi prompt copy nguyên văn dán sang chat Code bên kia.

---

### PROMPT F0: SETUP FE + DESIGN SYSTEM + MOCK DATA

```
Tạo FE cho web bán xe hơi cũ & mới trong D:\Ban_Xe_Hoi\frontend (FE-first, chưa cần BE).

Yêu cầu F0 - Setup:

1. Khởi tạo: npm create vite@latest frontend -- --template react-ts (nếu đã có thì bỏ qua), cài:
   react-router-dom, zustand, @tanstack/react-query, axios, antd, tailwindcss, postcss, autoprefixer, react-hook-form, zod, @hookform/resolvers, react-hot-toast, dayjs, swiper, recharts, react-helmet-async
   Setup Tailwind (npx tailwindcss init -p, config content, thêm @tailwind directives vào index.css), setup Ant Design (ConfigProvider theme token colorPrimary #1677ff).

2. Tạo cấu trúc: src/components/common, src/components/car, src/pages, src/pages/admin, src/mocks, src/services, src/store, src/types, src/hooks, src/utils, src/routes

3. Tạo types/Car.ts, User.ts, ApiResponse.ts:
   Car { id, title, brand, model, brandId, modelId, price, year, mileage, fuel, transmission, condition, location, images, status, viewCount, seller:{name, phone}, createdAt }
   Brand { id, name, logo, slug }, CarModel { id, brandId, name }

4. Tạo mocks/data.ts: Seed 30 xe giả (5 hãng Toyota/Honda/VinFast/Mazda/Kia, mỗi hãng 6 xe, giá 280tr-2.8 tỷ, năm 2018-2024, odo 5k-80k, ảnh dùng https://picsum.photos/seed/car{id}/600/400 hoặc unsplash car), 5 brands, 10 models. Export carsMock, brandsMock.

5. Tạo services/carService.ts: export getCarsMock(filter), getCarByIdMock(id), getFeaturedMock() - filter logic FE (brandId, condition, minPrice/maxPrice, search trong title). Dùng delay 400ms giả loading.

6. Tạo store: authStore (Zustand persist - user/token/isAuthenticated), favoriteStore (ids[] persist), compareStore (ids[] max 3 persist)

7. Tạo routes/index.tsx với createBrowserRouter: / (Home), /cars, /cars/:id, /compare, /favorites, /login, /register, /post-car, /my-cars, /admin + MainLayout (Header/Footer) và AdminLayout. Header: Logo "BanXeHoi", Menu (Trang chủ, Xe mới, Xe cũ, Bán xe), Search input, Nút Yêu thích (badge), So sánh (badge), Avatar/Login.

8. Tạo utils/format.ts: formatPrice (vi-VN + VNĐ), formatMileage, formatDate (dayjs)

9. Chạy npm run dev phải hiện Header + Trang chủ rỗng "FE Setup OK" + hiển thị số lượng mock (30 xe).

Tạo .env với VITE_USE_MOCK=true
```

---

### PROMPT F1: TRANG CHỦ (HOME)

```
Tiếp tục FE BanXeHoi (F1 - Trang chủ):

1. Tạo components/car/CarCard.tsx: Props Car, UI gồm: ảnh chính (tỷ lệ 16:9, hover zoom), badge condition (Mới/Cũ) góc trái, nút tim (favorite) góc phải, title 2 dòng, price màu #ff6b00 đậm, dòng specs (Năm • Odo • Nhiên liệu • Hộp số) icon, location + viewCount. Dùng Card của Antd + Tailwind. Click card -> navigate /cars/:id. Nút tim: toggle favoriteStore, toast, stopPropagation.

2. Tạo pages/Home.tsx:
   - Hero: nền gradient #1677ff -> #0958d9, tiêu đề "Tìm xe mơ ước của bạn", Search bar (Input + Button Tìm kiếm -> navigate /cars?search=...), Filter nhanh (4 Select: Hãng, Tầm giá, Tình trạng, Nút Lọc)
   - Section Xe nổi bật: lấy getFeaturedMock() 8 xe viewCount cao, Grid 4 cột (1 col mobile), Title + Link "Xem tất cả -> /cars"
   - Section Xe mới (condition New 4 xe) + Xe cũ (Used 4 xe)
   - Section Thương hiệu: Grid 5 logo Brand (dùng emoji/icon + tên), click -> /cars?brandId=
   - Section Tại sao chọn BanXeHoi (3 card: Kiểm định, Giá tốt, Hỗ trợ 24/7)
   - Dùng Swiper cho mobile nếu muốn scroll ngang.

3. Dùng React Query: useQuery(['featured'], getFeaturedMock) + Skeleton khi loading.

Responsive: 1 col mobile, 2 col tablet, 4 col desktop.
```

---

### PROMPT F2: DANH SÁCH XE + FILTER (QUAN TRỌNG NHẤT)

```
F2 - Trang danh sách /cars:

1. Tạo components/car/FilterPanel.tsx:
   - Props: filters, onChange
   - Các filter: Brand (Select), Model (Select cascading theo brand), Khoảng giá (Slider 0-5 tỷ step 50tr + 2 InputNumber), Năm (Slider 2010-2024), Nhiên liệu (Checkbox group), Hộp số (Checkbox), Tình trạng (Radio Mới/Cũ/Tất cả), Màu sắc (optional), Nút Xóa lọc, Nút Áp dụng (trên mobile là Drawer)
   - Trên desktop: sidebar 280px sticky, trên mobile: nút "Lọc" mở Drawer.

2. Tạo pages/CarList.tsx:
   - Đọc/ghi filter từ URL: useSearchParams (để reload không mất filter, share link được)
   - Gọi getCarsMock(filter) với params: search, brandId, modelId, condition, minPrice, maxPrice, fuel, transmission, yearFrom, yearTo, sortBy (newest, priceAsc, priceDesc, yearDesc), page, pageSize=12
   - Toolbar: "Tìm thấy 24 xe" + Sort Select + Grid/List toggle (Grid dùng CarCard, List dùng Card ngang ảnh trái)
   - Grid: 3 cột desktop, Pagination (Antd Pagination, showTotal), Empty state nếu 0 xe.
   - Dùng React Query với key ['cars', filters] để cache, Skeleton 12 card khi loading.
   - Debounce cho search input (useDebounce 400ms).

3. Tạo hooks/useDebounce.ts và hooks/useCars.ts (custom hook gọi carService)

Test: /cars?brandId=1&condition=Used&minPrice=500000000 phải lọc đúng từ mock.
```

---

### PROMPT F3: CHI TIẾT XE

```
F3 - Trang chi tiết /cars/:id:

1. Tạo components/car/CarGallery.tsx: Ảnh chính lớn (500px) + 4 thumbnail dưới, click thumbnail đổi ảnh chính, click ảnh chính mở preview (Image.PreviewGroup). Badge "Đã bán" nếu status Sold. Dùng Swiper cho mobile.

2. Tạo components/car/CarSpecs.tsx: Grid 2 cột hiển thị specs: Năm, Odo, Nhiên liệu, Hộp số, Động cơ (1.5L), Màu, Số chỗ, Xuất xứ, Tình trạng. Mỗi spec có icon (dùng emoji hoặc Ant icon).

3. Tạo pages/CarDetail.tsx:
   - Lấy id từ useParams, gọi getCarByIdMock(id) (tăng viewCount mock), nếu không thấy -> 404.
   - Layout 2 cột: Cột trái 2/3: Gallery + Title + Price lớn + Specs + Mô tả (Description dài, giữ line break) + Gợi ý xe tương tự (4 xe cùng brand, giá +-30%)
   - Cột phải 1/3 sticky: Card Người bán (Avatar, Tên, Phone, Location, "Tham gia từ 2023") + Nút Gọi (tel:), Nút Chat (toast "Tính năng chat sẽ có sau"), Nút Đặt lịch xem xe (mở Modal), Nút Yêu thích (toggle), Nút So sánh (add compareStore)
   - Breadcrumb: Trang chủ > Danh sách > Toyota Vios 2022
   - Dùng react-helmet-async set title = car.title

4. Tạo Modal Appointment (tạm UI chưa cần API): DatePicker + Phone + Note, nút Gửi yêu cầu -> toast success.

Responsive: 1 cột mobile, gallery full width.
```

---

### PROMPT F4: AUTH UI (MOCK)

```
F4 - Giao diện Đăng nhập/Đăng ký (mock, chưa cần BE):

1. Tạo pages/Login.tsx và Register.tsx:
   - Layout 2 cột: trái là form, phải là ảnh xe đẹp (dùng picsum).
   - Login: Form (Email, Password) + validate Zod (email, password min 6), nút Đăng nhập, link "Chưa có tài khoản? Đăng ký", "Quên mật khẩu", nút Demo (điền sẵn user@test.com / 123456)
   - Register: Form (FullName, Email, Phone, Password, ConfirmPassword) + Zod validate (confirm khớp, phone regex VN), checkbox Đồng ý điều khoản
   - Dùng React Hook Form + zodResolver, Ant Form + Input, Button loading.

2. Logic mock: Khi submit Login -> kiểm tra trong usersMock hoặc tạo user giả, lưu vào authStore (user, token="mock-token"), toast success, navigate /. Register tương tự. Logout trong Header clear store.

3. Tạo components/ProtectedRoute.tsx: nếu !isAuthenticated -> redirect /login, nếu route /admin mà role !== Admin -> redirect /.

4. Tạo pages/Profile.tsx (tạm): Hiển thị thông tin user từ authStore, form đổi mật khẩu (mock).

Header cập nhật: Nếu đã login hiện Avatar + Dropdown (Hồ sơ, Xe của tôi, Yêu thích, Đăng xuất), nếu chưa thì nút Đăng nhập/Đăng ký.
```

---

### PROMPT F5: ĐĂNG TIN & QUẢN LÝ TIN (MOCK)

```
F5 - Đăng tin bán xe:

1. Tạo pages/PostCar.tsx [ProtectedRoute]:
   - Dùng Ant Steps (3 bước):
     Bước 1 - Thông tin cơ bản: Title (Input), Brand (Select từ brandsMock), Model (cascading), Condition (Radio), Price (InputNumber VNĐ), Year (Select 2010-2024), Location (Select Tỉnh/Thành)
     Bước 2 - Thông số: Mileage, Fuel, Transmission, EngineCapacity, Color, Seats, Origin, Description (TextArea 200 ký tự min, đếm ký tự)
     Bước 3 - Hình ảnh: Upload.Dragger (tối đa 10 ảnh, preview, chọn ảnh chính, validate ít nhất 3 ảnh, dùng URL.createObjectURL preview, chưa cần upload thật)
   - Bước 4: Preview Card + Nút Đăng tin -> tạo Car mới (id = Date.now()), push vào carsMock (lưu vào localStorage để persist), status Pending, toast "Tin đang chờ duyệt", navigate /my-cars
   - Dùng RHF + Zod cho mỗi bước, nút Tiếp theo validate bước hiện tại.

2. Tạo pages/MyCars.tsx [ProtectedRoute]:
   - Lấy cars của user hiện tại (filter seller.name === authStore.user.name hoặc lưu sellerId mock)
   - Table (Antd Table): Cột Ảnh, Title, Giá, Trạng thái (Tag màu: Pending vàng, Approved xanh, Rejected đỏ), Lượt xem, Ngày đăng, Hành động (Xem, Sửa, Xóa Popconfirm). Nút Sửa chỉ khi Pending/Rejected.
   - Empty: "Bạn chưa đăng tin nào" + nút Đăng tin ngay.

3. Lưu cars mới vào localStorage key "banxehoi_cars" để reload không mất, khi getCarsMock thì merge với localStorage.
```

---

### PROMPT F6: YÊU THÍCH & SO SÁNH

```
F6 - Yêu thích & So sánh:

1. Yêu thích:
   - Đã có favoriteStore (persist localStorage)
   - Trang pages/Favorites.tsx: Grid CarCard đã thích (filter carsMock where favoriteStore.ids includes car.id), mỗi card có nút Xóa (X icon), Empty "Chưa có xe yêu thích" + nút Khám phá ngay -> /cars. Header badge số lượng.

2. So sánh:
   - components/car/CompareTable.tsx: Nhận 2-3 car, render Table so sánh:
     Hàng đầu: Ảnh + Title + Giá + Nút Xóa
     Các hàng: Hãng, Dòng xe, Năm, Odo, Nhiên liệu, Hộp số, Động cơ, Màu, Số chỗ, Tình trạng, Vị trí
     Highlight giá rẻ nhất (màu xanh), năm mới nhất.
   - pages/Compare.tsx: Đọc ids từ compareStore hoặc query ?ids=1,2,3, gọi getCarByIdMock cho từng id, hiển thị CompareTable, nếu <2 xe thì Empty "Thêm ít nhất 2 xe để so sánh", nút Xóa tất cả, nút Thêm xe (navigate /cars)
   - Logic: Nút So sánh trên CarCard/Detail -> addCompare(id), nếu đã 3 xe thì toast "Tối đa 3 xe" và không thêm, nếu đã có thì toast "Đã có trong so sánh"

3. Cập nhật CarCard: Hiển thị trạng thái đã thích (tim đỏ) và đã trong so sánh (icon scale).

Dùng Zustand persist nên reload vẫn giữ.
```

---

### PROMPT F7: ADMIN DASHBOARD (MOCK)

```
F7 - Admin Dashboard (mock):

1. Tạo layouts/AdminLayout.tsx: Sider (Logo Admin, Menu: Dashboard, Duyệt tin, Quản lý User, Quản lý Hãng), Header (Avatar admin, Logout), Content. Chỉ cho role Admin, nếu không phải Admin -> redirect /.

2. Tạo pages/admin/Dashboard.tsx:
   - 4 Card Statistic: Tổng xe (30), Chờ duyệt (5), Đã bán (3), Tổng lượt xem (tính sum viewCount), dùng Ant Statistic + icon
   - Biểu đồ: Pie (Xe theo hãng - dùng Recharts PieChart từ carsMock group by brand), Bar (Xe theo tình trạng Mới/Cũ), Line (Xe đăng 7 ngày gần nhất - mock data 7 ngày)
   - 2 Table: Xe mới nhất (5 xe sort createdAt desc) + Tin chờ duyệt (5 xe status Pending) có nút Duyệt nhanh (đổi status Approved trong mock + toast)

3. Tạo pages/admin/PendingCars.tsx: Table toàn bộ xe Pending, cột Ảnh, Title, Người bán, Giá, Ngày đăng, Hành động Duyệt (xanh) / Từ chối (đỏ) -> Modal xác nhận, update mock.

4. Tạo pages/admin/Users.tsx: Table usersMock (Avatar, Tên, Email, Phone, Role Tag, Trạng thái, Ngày tạo) + Search + Nút Ban/Unban (toggle).

Dùng Tag màu cho status, Popconfirm cho hành động.
```

---

### PROMPT F8: POLISH & CHUẨN BỊ NỐI BE

```
F8 - Hoàn thiện FE trước khi nối BE:

1. Polish:
   - Thêm Loading (Spin fullscreen), 404 NotFound page, Empty cho mọi list, ErrorBoundary
   - Responsive: Test 375px, 768px, 1024px, Header thành Drawer trên mobile (nút hamburger)
   - Thêm Skeleton cho CarCard khi loading, lazy loading ảnh (loading="lazy")
   - Toast đồng bộ (react-hot-toast), confirm trước khi xóa
   - Format lại toàn bộ giá, ngày, số liệu

2. Chuẩn bị nối BE:
   - Tạo services/api.ts (axios instance baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api', interceptors gắn token từ authStore)
   - Trong carService.ts tạo switch: if (import.meta.env.VITE_USE_MOCK === 'true') return mock else gọi api.get('/cars', {params})
   - Tạo file .env.example: VITE_USE_MOCK=true (FE-first) và VITE_API_URL=http://localhost:5000/api
   - Viết README_FE.md: Cách chạy (npm i, npm run dev), danh sách route, mock data, cách chuyển sang BE (đổi VITE_USE_MOCK=false)

3. Build test: npm run build phải pass không lỗi TS, preview ok.

Sau bước này FE coi như xong 100%, chỉ cần BE làm đúng contract API là nối được ngay.
```

---

### SAU KHI XONG FE (F0-F8) - MỚI LÀM BE

```
Khi FE đã xong, dán prompt sau để bắt đầu BE:

"FE đã xong với mock data (VITE_USE_MOCK=true). Bây giờ tạo BE ASP.NET Core 8 Clean Architecture trong D:\Ban_Xe_Hoi:
- Solution BanXeHoi.sln với 4 project Domain/Application/Infrastructure/API
- Entities: User, Brand, CarModel, Car, CarImage, Favorite, Appointment (như kế hoạch)
- DbContext + Migration + Seed Brands/Models + Admin user
- JWT Auth (register/login/refresh), Car CRUD + Filter/Paging/Sort, Favorites, Appointments, Admin Stats
- API phải khớp contract FE đã dùng: GET /api/cars?search=&brandId=&...&page=&pageSize=, GET /api/cars/{id}, POST /api/cars, v.v.
- Swagger + CORS cho http://localhost:5173
- Sau khi xong, hướng dẫn đổi VITE_USE_MOCK=false và test nối FE-BE"
```

