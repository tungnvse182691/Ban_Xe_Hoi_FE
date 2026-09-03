import { Calendar, CarFront, Cog, Fuel, Gauge, MapPin, Palette, Armchair, Factory, Sparkles } from 'lucide-react';
import { Card } from 'antd';
import type { Car } from '@/types/Car';
import { formatMileage } from '@/utils/format';

export default function CarSpecs({ car }: { car: Car }) {
  const specs = [
    { icon: <Calendar size={18} />, label: 'Năm sản xuất', value: String(car.year) },
    { icon: <Gauge size={18} />, label: 'Odo', value: formatMileage(car.mileage) },
    { icon: <Fuel size={18} />, label: 'Nhiên liệu', value: car.fuel },
    { icon: <Cog size={18} />, label: 'Hộp số', value: car.transmission },
    { icon: <CarFront size={18} />, label: 'Động cơ', value: car.engineCapacity ?? '—' },
    { icon: <Palette size={18} />, label: 'Màu sắc', value: car.color ?? '—' },
    { icon: <Armchair size={18} />, label: 'Số chỗ', value: car.seats ? `${car.seats} chỗ` : '—' },
    { icon: <Factory size={18} />, label: 'Xuất xứ', value: car.origin === 'Imported' ? 'Nhập khẩu' : 'Lắp ráp trong nước' },
    { icon: <Sparkles size={18} />, label: 'Tình trạng', value: car.condition === 'New' ? 'Mới' : 'Đã qua sử dụng' },
    { icon: <MapPin size={18} />, label: 'Vị trí', value: car.location },
  ];

  return (
    <Card title="Thông số kỹ thuật" className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        {specs.map((s) => (
          <div key={s.label} className="flex gap-2.5 items-center p-2.5 rounded-xl" style={{ background: '#f6f8fb' }}>
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(22,119,255,.1)', color: '#1677ff' }}
            >
              {s.icon}
            </span>
            <div className="min-w-0">
              <div className="text-xs" style={{ color: '#8c8c8c' }}>{s.label}</div>
              <div className="font-semibold truncate">{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
