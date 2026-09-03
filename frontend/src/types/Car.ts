export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type Transmission = 'MT' | 'AT' | 'CVT';
export type CarCondition = 'New' | 'Used';
export type CarStatus = 'Approved' | 'Pending' | 'Rejected' | 'Sold';

export interface SellerInfo {
  id?: string;
  name: string;
  phone: string;
  avatar?: string;
  location?: string;
}

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  brandId: number;
  modelId: number;
  price: number;
  year: number;
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  condition: CarCondition;
  location: string;
  images: string[];
  status: CarStatus;
  viewCount: number;
  seller: SellerInfo;
  createdAt: string;
  description?: string;
  color?: string;
  seats?: number;
  engineCapacity?: string;
  origin?: 'Imported' | 'Domestic';
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  slug: string;
}

export interface CarModel {
  id: number;
  brandId: number;
  name: string;
}

export interface CarFilterParams {
  search?: string;
  brandId?: number;
  modelId?: number;
  condition?: CarCondition;
  minPrice?: number;
  maxPrice?: number;
  fuel?: FuelType | FuelType[];
  transmission?: Transmission | Transmission[];
  yearFrom?: number;
  yearTo?: number;
  sortBy?: 'newest' | 'priceAsc' | 'priceDesc' | 'yearDesc' | 'mostViewed';
  page?: number;
  pageSize?: number;
}

export interface PagedCars {
  items: Car[];
  total: number;
  page: number;
  pageSize: number;
}
