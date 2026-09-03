import { Button, Card, Tag } from 'antd';
import { Calendar, Cog, Eye, Fuel, Gauge, GitCompareArrows, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Car } from '@/types/Car';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCompareStore } from '@/store/compareStore';
import { formatMileage, formatPrice } from '@/utils/format';

interface Props {
  car: Car;
  showRemoveFav?: boolean;
  onRemoveFav?: (id: string) => void;
}

export default function CarCard({ car, showRemoveFav, onRemoveFav }: Props) {
  const navigate = useNavigate();
  const toggle = useFavoriteStore((s) => s.toggle);
  const isFav = useFavoriteStore((s) => s.isFavorite(car.id));
  const compareIds = useCompareStore((s) => s.ids);
  const addCompare = useCompareStore((s) => s.add);
  const removeCompare = useCompareStore((s) => s.remove);
  const inCompare = compareIds.includes(car.id);

  const onToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showRemoveFav && onRemoveFav && isFav) {
      onRemoveFav(car.id);
      return;
    }
    toggle(car.id);
    toast.success(isFav ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const onToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeCompare(car.id);
      toast.success('Đã xóa khỏi so sánh');
    } else {
      const r = addCompare(car.id);
      if (r.ok) toast.success(r.message);
      else toast.error(r.message);
    }
  };

  return (
    <Card
      hoverable
      onClick={() => navigate(`/cars/${car.id}`)}
      className="card-lift img-zoom"
      styles={{ body: { padding: 14 } }}
      cover={
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <img
            src={car.images[0]}
            alt={car.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, rgba(11,18,32,.55))' }}
          />
          <Tag
            color={car.condition === 'New' ? 'blue' : 'orange'}
            className="absolute top-2.5 left-2.5 font-semibold"
            style={{ margin: 0, border: 'none' }}
          >
            {car.condition === 'New' ? 'Xe mới' : 'Xe cũ'}
          </Tag>
          <button
            onClick={onToggleFav}
            aria-label="Yêu thích"
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: isFav ? '#ff4d4f' : 'rgba(255,255,255,.92)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,.25)',
            }}
          >
            <Heart size={17} color={isFav ? '#fff' : '#0b1220'} fill={isFav ? '#fff' : 'none'} />
          </button>
          <span
            className="absolute bottom-2 right-2.5 flex items-center gap-1 text-xs font-medium"
            style={{ color: '#fff' }}
          >
            <Eye size={13} /> {car.viewCount.toLocaleString('vi-VN')}
          </span>
        </div>
      }
    >
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#0284c7' }}>
        {car.brand} • {car.model}
      </div>
      <div className="line-clamp-2 font-semibold mt-1 font-display" style={{ minHeight: 44, fontSize: 15 }} title={car.title}>
        {car.title}
      </div>
      <div className="font-extrabold text-lg mt-1" style={{ color: '#0b1220' }}>
        {formatPrice(car.price)}
      </div>
      <div className="grid grid-cols-4 gap-1 mt-2 text-xs" style={{ color: '#64748b' }}>
        <span className="flex items-center gap-1"><Calendar size={13} />{car.year}</span>
        <span className="flex items-center gap-1"><Gauge size={13} />{formatMileage(car.mileage)}</span>
        <span className="flex items-center gap-1"><Fuel size={13} />{car.fuel}</span>
        <span className="flex items-center gap-1"><Cog size={13} />{car.transmission}</span>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 text-xs" style={{ borderTop: '1px solid #f1f5f9', color: '#64748b' }}>
        <span className="flex items-center gap-1"><MapPin size={13} />{car.location}</span>
        <Button
          size="small"
          type={inCompare ? 'primary' : 'link'}
          icon={<GitCompareArrows size={14} />}
          onClick={onToggleCompare}
          style={{ padding: 0, height: 'auto', fontSize: 12 }}
        >
          {inCompare ? 'Đang so sánh' : 'So sánh'}
        </Button>
      </div>
    </Card>
  );
}
