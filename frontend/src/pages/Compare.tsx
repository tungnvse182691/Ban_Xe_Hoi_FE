import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Button, Empty, Skeleton } from 'antd';
import { Helmet } from 'react-helmet-async';
import CompareTable from '@/components/car/CompareTable';
import { getCarByIdMock } from '@/services/carService';
import { useCompareStore } from '@/store/compareStore';

export default function Compare() {
  const navigate = useNavigate();
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['car', id],
      queryFn: () => getCarByIdMock(id),
    })),
  });

  const loading = queries.some((q) => q.isLoading);
  const cars = queries.map((q) => q.data).filter((c) => c != null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>So sánh xe - TommyCar</title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold m-0">So sánh xe ({ids.length}/3)</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/cars')}>+ Thêm xe</Button>
          {ids.length > 0 && <Button danger onClick={clear}>Xóa tất cả</Button>}
        </div>
      </div>
      {loading ? (
        <Skeleton active />
      ) : cars.length < 2 ? (
        <Empty description="Thêm ít nhất 2 xe để so sánh">
          <Button type="primary" onClick={() => navigate('/cars')}>
            Khám phá xe ngay
          </Button>
        </Empty>
      ) : (
        <CompareTable cars={cars} />
      )}
    </div>
  );
}
