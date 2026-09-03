import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export function formatPrice(price: number): string {
  return `${price.toLocaleString('vi-VN')} VNĐ`;
}

export function formatMileage(mileage: number): string {
  if (mileage < 1000) return `${mileage} km`;
  return `${(mileage / 1000).toFixed(mileage % 1000 === 0 ? 0 : 1)} vạn km`.replace('.0 vạn', ' vạn');
}

export function formatDate(date: string | Date): string {
  return dayjs(date).format('DD/MM/YYYY');
}

export function formatRelative(date: string | Date): string {
  return dayjs(date).fromNow();
}
