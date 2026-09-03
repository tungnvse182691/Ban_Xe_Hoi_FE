import { Button, Table } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Car } from '@/types/Car';
import { useCompareStore } from '@/store/compareStore';
import { formatMileage, formatPrice } from '@/utils/format';

export default function CompareTable({ cars }: { cars: Car[] }) {
  const navigate = useNavigate();
  const remove = useCompareStore((s) => s.remove);

  const minPrice = Math.min(...cars.map((c) => c.price));
  const maxYear = Math.max(...cars.map((c) => c.year));

  const rows: { label: string; render: (c: Car) => React.ReactNode }[] = [
    { label: 'Hãng', render: (c) => c.brand },
    { label: 'Dòng xe', render: (c) => c.model },
    {
      label: 'Giá',
      render: (c) => (
        <span style={{ color: c.price === minPrice ? '#52c41a' : undefined, fontWeight: c.price === minPrice ? 700 : 400 }}>
          {formatPrice(c.price)}{c.price === minPrice ? ' ★ rẻ nhất' : ''}
        </span>
      ),
    },
    {
      label: 'Năm',
      render: (c) => (
        <span style={{ color: c.year === maxYear ? '#1677ff' : undefined, fontWeight: c.year === maxYear ? 700 : 400 }}>
          {c.year}{c.year === maxYear ? ' ★ mới nhất' : ''}
        </span>
      ),
    },
    { label: 'Odo', render: (c) => formatMileage(c.mileage) },
    { label: 'Nhiên liệu', render: (c) => c.fuel },
    { label: 'Hộp số', render: (c) => c.transmission },
    { label: 'Động cơ', render: (c) => c.engineCapacity ?? '—' },
    { label: 'Màu', render: (c) => c.color ?? '—' },
    { label: 'Số chỗ', render: (c) => (c.seats ? `${c.seats} chỗ` : '—') },
    { label: 'Tình trạng', render: (c) => (c.condition === 'New' ? 'Mới' : 'Cũ') },
    { label: 'Vị trí', render: (c) => c.location },
  ];

  const columns = [
    { title: 'Thuộc tính', dataIndex: 'label', key: 'label', width: 140, fixed: 'left' as const },
    ...cars.map((car) => ({
      title: (
        <div style={{ minWidth: 200 }}>
          <img src={car.images[0]} alt={car.title} loading="lazy" className="w-full h-28 object-cover rounded mb-2" />
          <div className="line-clamp-2 font-medium" style={{ whiteSpace: 'normal' }}>{car.title}</div>
          <div className="font-bold" style={{ color: '#ff6b00' }}>{formatPrice(car.price)}</div>
          <div className="flex gap-1 mt-1">
            <Button size="small" onClick={() => navigate(`/cars/${car.id}`)}>Xem</Button>
            <Button size="small" icon={<CloseOutlined />} onClick={() => remove(car.id)}>Xóa</Button>
          </div>
        </div>
      ),
      dataIndex: car.id,
      key: car.id,
    })),
  ];

  const dataSource = rows.map((r, i) => ({
    key: i,
    label: r.label,
    ...Object.fromEntries(cars.map((c) => [c.id, r.render(c)])),
  }));

  return <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 600 }} bordered />;
}
