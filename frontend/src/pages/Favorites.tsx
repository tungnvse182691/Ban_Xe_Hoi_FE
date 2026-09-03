import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Button, Skeleton } from 'antd';
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
      <Helmet><title>Xe yêu thích - TommyCar</title></Helmet>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#ff4d4f,#ff7a7a)', color:'#fff'}}>❤️</span>
        <div>
          <h1 className="text-2xl font-extrabold m-0 font-display" style={{color:'#0b1220'}}>Xe yêu thích <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{background:'rgba(255,77,79,0.12)', color:'#ff4d4f', border:'1px solid rgba(255,77,79,0.2)'}}>{ids.length}</span></h1>
          <p className="text-sm m-0" style={{color:'#64748b'}}>Lưu lại để so sánh và đặt lịch nhanh hơn</p>
        </div>
        {cars.length>0 && <Button className="ml-auto hidden md:block" onClick={()=>navigate('/compare')}>So sánh tất cả</Button>}
      </div>
      {loading ? (
        <Skeleton active />
      ) : cars.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{background:'#fff', border:'1px solid #e2e8f0'}}>
          <div className="text-5xl mb-3">💔</div>
          <h3 className="font-bold">Chưa có xe yêu thích</h3>
          <p className="text-sm" style={{color:'#64748b'}}>Bấm tim trên card xe để lưu lại</p>
          <Button type="primary" className="mt-3" style={{background:'#0284c7', borderColor:'#0284c7'}} onClick={() => navigate('/cars')}>Khám phá ngay</Button>
        </div>
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
