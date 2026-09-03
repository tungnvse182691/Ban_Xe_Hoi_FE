import { carsMock } from '@/mocks/data';
import type { Car, CarFilterParams, PagedCars } from '@/types/Car';
import api from './api';

export const isMockMode = () => import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

function getLocalCars(): Car[] {
  try {
    const raw = localStorage.getItem('tommycar_cars');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Car[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem('tommycar_deleted');
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getStatusOverrides(): Record<string, Car['status']> {
  try {
    const raw = localStorage.getItem('tommycar_status');
    const parsed = raw ? (JSON.parse(raw) as Record<string, Car['status']>) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function setCarStatusMock(id: string, status: Car['status']) {
  const cur = getStatusOverrides();
  localStorage.setItem('tommycar_status', JSON.stringify({ ...cur, [id]: status }));
}

function allCars(): Car[] {
  // localStorage cars (F5 tạo) merge lên đầu, sau đó là mock gốc (trừ id đã xóa + override status)
  const deleted = new Set(getDeletedIds());
  const overrides = getStatusOverrides();
  const applyOverride = (c: Car): Car => (overrides[c.id] ? { ...c, status: overrides[c.id] } : c);
  return [
    ...getLocalCars().map(applyOverride),
    ...carsMock.filter((c) => !deleted.has(c.id)).map(applyOverride),
  ];
}

export async function getCarsMock(filter: CarFilterParams = {}): Promise<PagedCars> {
  await delay(400);
  const {
    search,
    brandId,
    modelId,
    condition,
    minPrice,
    maxPrice,
    fuel,
    transmission,
    yearFrom,
    yearTo,
    sortBy = 'newest',
    page = 1,
    pageSize = 12,
  } = filter;

  let list = allCars();

  if (search) {
    const s = search.toLowerCase();
    list = list.filter((c) => c.title.toLowerCase().includes(s));
  }
  if (brandId) list = list.filter((c) => c.brandId === Number(brandId));
  if (modelId) list = list.filter((c) => c.modelId === Number(modelId));
  if (condition) list = list.filter((c) => c.condition === condition);
  if (minPrice) list = list.filter((c) => c.price >= Number(minPrice));
  if (maxPrice) list = list.filter((c) => c.price <= Number(maxPrice));
  if (fuel) {
    const fuels = Array.isArray(fuel) ? fuel : [fuel];
    list = list.filter((c) => fuels.includes(c.fuel));
  }
  if (transmission) {
    const trs = Array.isArray(transmission) ? transmission : [transmission];
    list = list.filter((c) => trs.includes(c.transmission));
  }
  if (yearFrom) list = list.filter((c) => c.year >= Number(yearFrom));
  if (yearTo) list = list.filter((c) => c.year <= Number(yearTo));

  switch (sortBy) {
    case 'priceAsc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'yearDesc':
      list = [...list].sort((a, b) => b.year - a.year);
      break;
    case 'mostViewed':
      list = [...list].sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'newest':
    default:
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const items = list.slice(start, start + Number(pageSize));

  return { items, total, page: Number(page), pageSize: Number(pageSize) };
}

export async function getCarByIdMock(id: string): Promise<Car | null> {
  await delay(300);
  const car = allCars().find((c) => c.id === id) ?? null;
  return car;
}

export async function getFeaturedMock(limit = 8): Promise<Car[]> {
  await delay(300);
  return [...allCars()].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit);
}

// ---- Unified API (tự switch mock/BE theo VITE_USE_MOCK) ----
// Hiện các pages đang gọi trực tiếp get*Mock (FE-first).
// Khi BE sẵn sàng: đổi VITE_USE_MOCK=false và thay import sang 3 hàm dưới.

export async function getCars(filter: CarFilterParams = {}): Promise<PagedCars> {
  if (isMockMode()) return getCarsMock(filter);
  const { data } = await api.get('/cars', { params: filter });
  return data.data ?? data;
}

export async function getCarById(id: string): Promise<Car | null> {
  if (isMockMode()) return getCarByIdMock(id);
  const { data } = await api.get(`/cars/${id}`);
  return data.data ?? data ?? null;
}

export async function getFeatured(limit = 8): Promise<Car[]> {
  if (isMockMode()) return getFeaturedMock(limit);
  const { data } = await api.get('/cars/featured', { params: { limit } });
  return data.data ?? data ?? [];
}
