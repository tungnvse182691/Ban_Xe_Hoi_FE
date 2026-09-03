# TommyCar - Frontend (FE-first, Mock Data)

## Cách chạy

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
npm run build # build production
npm run preview
```

## Env

| Biến | Giá trị | Ý nghĩa |
|---|---|---|
| `VITE_USE_MOCK` | `true` | Dùng mock data (mặc định, chưa cần BE) |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL BE khi nối thật |

File `.env` mẫu xem tại `.env.example`.

## Routes

| Route | Page | Ghi chú |
|---|---|---|
| `/` | Home | Hero + featured/mới/cũ + brands |
| `/cars` | CarList | Filter sidebar + URL params + sort + grid/list |
| `/cars/:id` | CarDetail | Gallery + specs + seller + đặt lịch (mock) |
| `/compare` | Compare | Tối đa 3 xe (Zustand persist) |
| `/favorites` | Favorites | Tim yêu thích (persist) |
| `/login`, `/register` | Auth | Mock, token `mock-token`, demo `user@test.com / 123456` |
| `/post-car`, `/my-cars`, `/profile` | Protected | Đăng tin 4 bước, lưu localStorage |
| `/admin`, `/admin/cars`, `/admin/users` | Admin | Role Admin, Recharts + duyệt tin mock |

Tài khoản Admin mock: `admin@tommycar.vn` (đăng nhập mock sẽ gán role Admin).

## Mock data

- `src/mocks/data.ts`: 30 xe (5 hãng × 6), 5 brands, 10 models, 3 users
- Ảnh xe: `public/cars/` (91 ảnh ô tô thật tải từ Flickr CC, đặt tên `car{id}-{0,1,2}.jpg` theo body type sedan/suv/hatchback + `hero.jpg` cho hero/auth). Không phụ thuộc mạng lúc chạy.
- Avatar: `i.pravatar.cc` (fallback hiện chữ cái đầu nếu offline)
- `carService.getCarsMock(filter)`: lọc brandId/modelId/condition/giá/fuel/transmission/năm/search + sort + paging
- Persist localStorage:
  - `tommycar_cars`: tin tự đăng (F5)
  - `tommycar_deleted`: id mock đã xóa (MyCars)
  - `tommycar_status`: override Approved/Rejected (Admin duyệt)
  - `tommycar-auth / -favorites / -compare`: Zustand persist

## Chuyển sang BE thật

1. BE làm đúng contract: `GET /api/cars?search=&brandId=&modelId=&condition=&minPrice=&maxPrice=&fuel=&transmission=&yearFrom=&yearTo=&sortBy=&page=&pageSize=`, `GET /api/cars/{id}`, `GET /api/cars/featured`, `POST /api/cars`, favorites/appointments/admin stats.
2. Đổi `.env`: `VITE_USE_MOCK=false`, `VITE_API_URL=<url BE>`.
3. Trong pages thay import `getCarsMock/getCarByIdMock/getFeaturedMock` → `getCars/getCarById/getFeatured` (đã viết sẵn switch trong `carService.ts`, dùng `services/api.ts` axios + gắn token + auto-logout 401).

## Test thủ công (10 luồng)

1. `/` hiện hero + 8 nổi bật + 4 mới + 4 cũ + 5 hãng
2. `/cars?brandId=1&condition=Used&minPrice=500000000` lọc đúng
3. `/cars/1` gallery + specs + seller + đặt lịch → toast
4. Register → login → Header hiện Avatar
5. `/post-car` 4 bước (thiếu 3 ảnh thì chặn) → `/my-cars` thấy tin Pending
6. Tim yêu thích trên card → `/favorites` giữ sau reload
7. So sánh 3 xe → `/compare` highlight rẻ nhất/mới nhất, xe thứ 4 bị chặn toast
8. `/admin` (login admin) xem stats + charts + duyệt nhanh
9. `/admin/cars` duyệt/từ chối → status đổi, reload giữ
10. `npm run build` pass, resize 375/768/1024 không vỡ layout, menu mobile thành Drawer
