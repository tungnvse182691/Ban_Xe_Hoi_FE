import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Button, Skeleton } from 'antd';
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
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#0284c7,#0ea5e9)', color:'#fff'}}>⚖️</span>
          <h1 className="text-2xl font-extrabold m-0 font-display" style={{color:'#0b1220'}}>So sánh xe <span className="text-sm font-bold px-2 py-1 rounded-full" style={{background: ids.length===3?'#fef3c7':'#f1f5f9', color: ids.length===3?'#d97706':'#64748b'}}>{ids.length}/3</span></h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/cars')}>+ Thêm xe</Button>
          {ids.length > 0 && <Button danger onClick={clear}>Xóa tất cả</Button>}
        </div>
      </div>
      {loading ? (
        <Skeleton active />
      ) : cars.length < 2 ? (
        <div className="text-center py-16 rounded-2xl" style={{background:'#fff', border:'1px solid #e2e8f0'}}>
          <div className="text-5xl mb-3">⚖️</div>
          <h3 className="font-bold">Thêm ít nhất 2 xe để so sánh</h3>
          <p className="text-sm" style={{color:'#64748b'}}>Chọn tối đa 3 xe để xem bảng so sánh chi tiết</p>
          <Button type="primary" className="mt-3" style={{background:'#0284c7', borderColor:'#0284c7'}} onClick={() => navigate('/cars')}>Khám phá xe ngay</Button>
        </div>
      ) : (
        <CompareTable cars={cars} />
      )}
    </div>
  );
}
