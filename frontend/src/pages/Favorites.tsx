import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Button, Empty, Skeleton } from 'antd';
import { Helmet } from 'react-helmet-async';
import CarCard from '@/components/car/CarCard';
import { getCarByIdMock } from '@/services/carService';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function Favorites() {
  const navigate = useNavigate();
  const ids = useFavoriteStore((s) => s.ids);
  const remove = useFavoriteStore((s) => s.remove);

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
        <title>Xe yêu thích - TommyCar</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-4">Xe yêu thích ({ids.length})</h1>
      {loading ? (
        <Skeleton active />
      ) : cars.length === 0 ? (
        <Empty description="Chưa có xe yêu thích">
          <Button type="primary" onClick={() => navigate('/cars')}>
            Khám phá ngay
          </Button>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} showRemoveFav onRemoveFav={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
