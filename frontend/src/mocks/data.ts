import type { Brand, Car, CarModel } from '@/types/Car';
import type { User } from '@/types/User';

export const brandsMock: Brand[] = [
  { id: 1, name: 'Toyota', logo: 'T', slug: 'toyota' },
  { id: 2, name: 'Honda', logo: 'H', slug: 'honda' },
  { id: 3, name: 'VinFast', logo: 'V', slug: 'vinfast' },
  { id: 4, name: 'Mazda', logo: 'M', slug: 'mazda' },
  { id: 5, name: 'Kia', logo: 'K', slug: 'kia' },
];

export const modelsMock: CarModel[] = [
  { id: 1, brandId: 1, name: 'Vios' },
  { id: 2, brandId: 1, name: 'Corolla Cross' },
  { id: 3, brandId: 2, name: 'Civic' },
  { id: 4, brandId: 2, name: 'CR-V' },
  { id: 5, brandId: 3, name: 'Fadil' },
  { id: 6, brandId: 3, name: 'VF e34' },
  { id: 7, brandId: 4, name: 'Mazda3' },
  { id: 8, brandId: 4, name: 'CX-5' },
  { id: 9, brandId: 5, name: 'K3' },
  { id: 10, brandId: 5, name: 'Seltos' },
];

export const usersMock: User[] = [
  {
    id: 'u1',
    fullName: 'Nguyen Van An',
    email: 'user@test.com',
    phone: '0901234567',
    avatar: 'https://i.pravatar.cc/100?img=12',
    role: 'User',
    address: 'Hà Nội',
    createdAt: '2023-05-10T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u2',
    fullName: 'Tran Thi Bich',
    email: 'seller@test.com',
    phone: '0912345678',
    avatar: 'https://i.pravatar.cc/100?img=32',
    role: 'User',
    address: 'TP. Hồ Chí Minh',
    createdAt: '2023-06-15T08:00:00Z',
    isActive: true,
  },
  {
    id: 'admin1',
    fullName: 'Admin TommyCar',
    email: 'admin@tommycar.vn',
    phone: '0900000001',
    avatar: 'https://i.pravatar.cc/100?img=5',
    role: 'Admin',
    address: 'Hà Nội',
    createdAt: '2023-01-01T08:00:00Z',
    isActive: true,
  },
];

type SeedDef = {
  brandId: number;
  modelId: number;
  brand: string;
  model: string;
  variant: string;
  price: number;
  year: number;
  mileage: number;
  fuel: Car['fuel'];
  transmission: Car['transmission'];
  condition: Car['condition'];
  location: string;
  status: Car['status'];
  viewCount: number;
  sellerName: string;
  sellerPhone: string;
  sellerId: string;
};

const seeds: SeedDef[] = [
  // Toyota (6)
  { brandId: 1, modelId: 1, brand: 'Toyota', model: 'Vios', variant: '1.5G CVT', price: 520000000, year: 2022, mileage: 25000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 12500, sellerName: 'Nguyen Van An', sellerPhone: '0901234567', sellerId: 'u1' },
  { brandId: 1, modelId: 1, brand: 'Toyota', model: 'Vios', variant: '1.5E MT', price: 380000000, year: 2019, mileage: 62000, fuel: 'Petrol', transmission: 'MT', condition: 'Used', location: 'Hải Phòng', status: 'Approved', viewCount: 8300, sellerName: 'Tran Thi Bich', sellerPhone: '0912345678', sellerId: 'u2' },
  { brandId: 1, modelId: 2, brand: 'Toyota', model: 'Corolla Cross', variant: '1.8V Hybrid', price: 880000000, year: 2023, mileage: 12000, fuel: 'Hybrid', transmission: 'CVT', condition: 'Used', location: 'TP. Hồ Chí Minh', status: 'Approved', viewCount: 15200, sellerName: 'Salon Auto Phat', sellerPhone: '0923456789', sellerId: 'u2' },
  { brandId: 1, modelId: 2, brand: 'Toyota', model: 'Corolla Cross', variant: '1.8G', price: 760000000, year: 2021, mileage: 35000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Đà Nẵng', status: 'Approved', viewCount: 6400, sellerName: 'Le Van Cuong', sellerPhone: '0934567890', sellerId: 'u1' },
  { brandId: 1, modelId: 1, brand: 'Toyota', model: 'Vios', variant: '1.5G CVT Mới 100%', price: 590000000, year: 2024, mileage: 10, fuel: 'Petrol', transmission: 'CVT', condition: 'New', location: 'Hà Nội', status: 'Approved', viewCount: 9800, sellerName: 'Toyota Thai Nguyen', sellerPhone: '0945678901', sellerId: 'u2' },
  { brandId: 1, modelId: 2, brand: 'Toyota', model: 'Corolla Cross', variant: '1.8V', price: 920000000, year: 2024, mileage: 5, fuel: 'Petrol', transmission: 'CVT', condition: 'New', location: 'TP. Hồ Chí Minh', status: 'Pending', viewCount: 1200, sellerName: 'Toyota Hung Vuong', sellerPhone: '0956789012', sellerId: 'u2' },
  // Honda (6)
  { brandId: 2, modelId: 3, brand: 'Honda', model: 'Civic', variant: '1.5 RS Turbo', price: 780000000, year: 2022, mileage: 28000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 11200, sellerName: 'Pham Minh Duc', sellerPhone: '0967890123', sellerId: 'u1' },
  { brandId: 2, modelId: 3, brand: 'Honda', model: 'Civic', variant: '1.8E', price: 550000000, year: 2020, mileage: 45000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Bình Dương', status: 'Approved', viewCount: 7200, sellerName: 'Tran Thi Bich', sellerPhone: '0912345678', sellerId: 'u2' },
  { brandId: 2, modelId: 4, brand: 'Honda', model: 'CR-V', variant: '1.5L G', price: 980000000, year: 2023, mileage: 15000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'TP. Hồ Chí Minh', status: 'Approved', viewCount: 13400, sellerName: 'Honda Otos', sellerPhone: '0978901234', sellerId: 'u2' },
  { brandId: 2, modelId: 4, brand: 'Honda', model: 'CR-V', variant: '2.0E', price: 720000000, year: 2019, mileage: 58000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Nghệ An', status: 'Sold', viewCount: 9100, sellerName: 'Nguyen Van An', sellerPhone: '0901234567', sellerId: 'u1' },
  { brandId: 2, modelId: 3, brand: 'Honda', model: 'Civic', variant: '1.5 RS Mới', price: 870000000, year: 2024, mileage: 8, fuel: 'Petrol', transmission: 'CVT', condition: 'New', location: 'Hà Nội', status: 'Approved', viewCount: 5600, sellerName: 'Honda Giai Phong', sellerPhone: '0989012345', sellerId: 'u2' },
  { brandId: 2, modelId: 4, brand: 'Honda', model: 'CR-V', variant: '1.5L L AWD', price: 1250000000, year: 2024, mileage: 5, fuel: 'Petrol', transmission: 'CVT', condition: 'New', location: 'TP. Hồ Chí Minh', status: 'Pending', viewCount: 900, sellerName: 'Honda Phat Loc', sellerPhone: '0990123456', sellerId: 'u2' },
  // VinFast (6)
  { brandId: 3, modelId: 5, brand: 'VinFast', model: 'Fadil', variant: '1.4 Plus', price: 320000000, year: 2021, mileage: 40000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 14800, sellerName: 'Le Thi Hoa', sellerPhone: '0901122334', sellerId: 'u1' },
  { brandId: 3, modelId: 5, brand: 'VinFast', model: 'Fadil', variant: '1.4 Base', price: 280000000, year: 2020, mileage: 55000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Hải Phòng', status: 'Approved', viewCount: 10600, sellerName: 'Nguyen Van An', sellerPhone: '0901234567', sellerId: 'u1' },
  { brandId: 3, modelId: 6, brand: 'VinFast', model: 'VF e34', variant: 'Điện', price: 650000000, year: 2023, mileage: 18000, fuel: 'Electric', transmission: 'AT', condition: 'Used', location: 'TP. Hồ Chí Minh', status: 'Approved', viewCount: 16900, sellerName: 'VinFast Newway', sellerPhone: '0912233445', sellerId: 'u2' },
  { brandId: 3, modelId: 6, brand: 'VinFast', model: 'VF e34', variant: 'Điện Plus Pin mới', price: 710000000, year: 2024, mileage: 5000, fuel: 'Electric', transmission: 'AT', condition: 'New', location: 'Hà Nội', status: 'Approved', viewCount: 18300, sellerName: 'VinFast Thang Long', sellerPhone: '0923344556', sellerId: 'u2' },
  { brandId: 3, modelId: 5, brand: 'VinFast', model: 'Fadil', variant: '1.4 Plus Đẹp', price: 350000000, year: 2022, mileage: 30000, fuel: 'Petrol', transmission: 'CVT', condition: 'Used', location: 'Quảng Ninh', status: 'Pending', viewCount: 2100, sellerName: 'Tran Thi Bich', sellerPhone: '0912345678', sellerId: 'u2' },
  { brandId: 3, modelId: 6, brand: 'VinFast', model: 'VF e34', variant: 'Điện', price: 480000000, year: 2022, mileage: 42000, fuel: 'Electric', transmission: 'AT', condition: 'Used', location: 'Đà Nẵng', status: 'Sold', viewCount: 7700, sellerName: 'Hoang Minh', sellerPhone: '0934455667', sellerId: 'u1' },
  // Mazda (6)
  { brandId: 4, modelId: 7, brand: 'Mazda', model: 'Mazda3', variant: '1.5 Luxury', price: 620000000, year: 2022, mileage: 22000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 9900, sellerName: 'Mazda Le Van Luong', sellerPhone: '0945566778', sellerId: 'u2' },
  { brandId: 4, modelId: 7, brand: 'Mazda', model: 'Mazda3', variant: '2.0 Premium', price: 750000000, year: 2021, mileage: 33000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'TP. Hồ Chí Minh', status: 'Approved', viewCount: 8100, sellerName: 'Pham Minh Duc', sellerPhone: '0967890123', sellerId: 'u1' },
  { brandId: 4, modelId: 8, brand: 'Mazda', model: 'CX-5', variant: '2.0 Luxury', price: 820000000, year: 2022, mileage: 27000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 12100, sellerName: 'Salon Auto Phat', sellerPhone: '0923456789', sellerId: 'u2' },
  { brandId: 4, modelId: 8, brand: 'Mazda', model: 'CX-5', variant: '2.5 Signature AWD', price: 1050000000, year: 2023, mileage: 14000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Bình Dương', status: 'Approved', viewCount: 8900, sellerName: 'Le Van Cuong', sellerPhone: '0934567890', sellerId: 'u1' },
  { brandId: 4, modelId: 8, brand: 'Mazda', model: 'CX-5', variant: '2.0 Deluxe Mới', price: 949000000, year: 2024, mileage: 6, fuel: 'Petrol', transmission: 'AT', condition: 'New', location: 'Hà Nội', status: 'Pending', viewCount: 1500, sellerName: 'Mazda Giai Phong', sellerPhone: '0956677889', sellerId: 'u2' },
  { brandId: 4, modelId: 7, brand: 'Mazda', model: 'Mazda3', variant: '1.5 Base', price: 450000000, year: 2018, mileage: 75000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Thanh Hóa', status: 'Sold', viewCount: 5300, sellerName: 'Nguyen Van An', sellerPhone: '0901234567', sellerId: 'u1' },
  // Kia (6)
  { brandId: 5, modelId: 9, brand: 'Kia', model: 'K3', variant: '1.6 Luxury', price: 560000000, year: 2022, mileage: 26000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Hà Nội', status: 'Approved', viewCount: 8700, sellerName: 'Kia Giai Phong', sellerPhone: '0967788990', sellerId: 'u2' },
  { brandId: 5, modelId: 9, brand: 'Kia', model: 'K3', variant: '2.0 Premium', price: 680000000, year: 2023, mileage: 16000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'TP. Hồ Chí Minh', status: 'Approved', viewCount: 7900, sellerName: 'Tran Thi Bich', sellerPhone: '0912345678', sellerId: 'u2' },
  { brandId: 5, modelId: 10, brand: 'Kia', model: 'Seltos', variant: '1.4 DCT Premium', price: 720000000, year: 2022, mileage: 24000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Đà Nẵng', status: 'Approved', viewCount: 9300, sellerName: 'Salon Auto Phat', sellerPhone: '0923456789', sellerId: 'u2' },
  { brandId: 5, modelId: 10, brand: 'Kia', model: 'Seltos', variant: '1.6 AT Deluxe', price: 640000000, year: 2021, mileage: 38000, fuel: 'Petrol', transmission: 'AT', condition: 'Used', location: 'Cần Thơ', status: 'Approved', viewCount: 6100, sellerName: 'Hoang Minh', sellerPhone: '0934455667', sellerId: 'u1' },
  { brandId: 5, modelId: 10, brand: 'Kia', model: 'Seltos', variant: '1.4 DCT Mới 100%', price: 799000000, year: 2024, mileage: 7, fuel: 'Petrol', transmission: 'AT', condition: 'New', location: 'Hà Nội', status: 'Pending', viewCount: 1800, sellerName: 'Kia Thai Nguyen', sellerPhone: '0978899001', sellerId: 'u2' },
  { brandId: 5, modelId: 9, brand: 'Kia', model: 'K3', variant: '1.6 Deluxe', price: 2800000000 - 2310000000, year: 2019, mileage: 80000, fuel: 'Diesel', transmission: 'MT', condition: 'Used', location: 'Lào Cai', status: 'Approved', viewCount: 4200, sellerName: 'Le Van Cuong', sellerPhone: '0934567890', sellerId: 'u1' },
];

function pics(id: string, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => `/cars/${id}-${i}.jpg`);
}

const AVATARS = [
  'https://i.pravatar.cc/100?img=12',
  'https://i.pravatar.cc/100?img=32',
  'https://i.pravatar.cc/100?img=5',
  'https://i.pravatar.cc/100?img=15',
  'https://i.pravatar.cc/100?img=25',
  'https://i.pravatar.cc/100?img=47',
  'https://i.pravatar.cc/100?img=53',
  'https://i.pravatar.cc/100?img=59',
];

export const carsMock: Car[] = seeds.map((s, idx) => {
  const id = String(idx + 1);
  const odoText = s.mileage < 1000 ? `${s.mileage} km` : `${Math.round(s.mileage / 1000)}k`;
  return {
    id,
    title: `${s.brand} ${s.model} ${s.year} ${s.variant} - Odo ${odoText}`,
    brand: s.brand,
    model: s.model,
    brandId: s.brandId,
    modelId: s.modelId,
    price: s.price,
    year: s.year,
    mileage: s.mileage,
    fuel: s.fuel,
    transmission: s.transmission,
    condition: s.condition,
    location: s.location,
    images: pics(`car${id}`, 3),
    status: s.status,
    viewCount: s.viewCount,
    seller: {
      name: s.sellerName,
      phone: s.sellerPhone,
      avatar: AVATARS[idx % AVATARS.length],
    },
    createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
    description: `Bán ${s.brand} ${s.model} ${s.year} bản ${s.variant}, xe ${s.condition === 'New' ? 'mới 100%' : 'cũ đã qua sử dụng giữ gìn'}, odo ${s.mileage.toLocaleString('vi-VN')} km, ${s.fuel}, hộp số ${s.transmission}. Xe chính chủ, bảo dưỡng hãng đầy đủ, bao check hãng. Liên hệ ${s.sellerPhone} để xem xe tại ${s.location}.`,
    color: ['Trắng', 'Đen', 'Bạc', 'Đỏ', 'Xanh'][idx % 5],
    seats: s.model === 'CX-5' || s.model === 'CR-V' ? 7 : 5,
    engineCapacity: s.fuel === 'Electric' ? 'Điện' : '1.5L',
    origin: idx % 2 === 0 ? 'Domestic' : 'Imported',
  };
});
