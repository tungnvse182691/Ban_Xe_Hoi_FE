import { useState } from 'react';
import { Image, Tag } from 'antd';
import type { Car } from '@/types/Car';

interface Props {
  car: Car;
}

export default function CarGallery({ car }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 12px 32px -12px rgba(11,18,32,.35)' }}>
        {car.status === 'Sold' && (
          <Tag color="red" className="absolute top-3 left-3 z-10" style={{ fontSize: 14 }}>
            Đã bán
          </Tag>
        )}
        <Image.PreviewGroup>
          {car.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${car.title} - ${i + 1}`}
              style={{ display: i === active ? 'block' : 'none', width: '100%', height: 500, objectFit: 'cover', borderRadius: 8 }}
            />
          ))}
        </Image.PreviewGroup>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {car.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`thumb ${i + 1}`}
            loading="lazy"
            onClick={() => setActive(i)}
            className="h-20 object-cover rounded-xl cursor-pointer"
            style={{
              border: i === active ? '2px solid #0284c7' : '2px solid transparent',
              width: '100%',
              boxShadow: i === active ? '0 4px 12px rgba(2,132,199,.35)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
