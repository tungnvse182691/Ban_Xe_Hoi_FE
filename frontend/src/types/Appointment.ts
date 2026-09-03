export type ApptStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Done';
export interface Appointment {
  id: string;
  carId: string;
  carTitle: string;
  carImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  date: string; // ISO
  phone: string;
  note?: string;
  status: ApptStatus;
  createdAt: string;
}
