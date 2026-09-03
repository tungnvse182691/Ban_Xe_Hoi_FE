import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Empty, Popconfirm, Table, Tag } from 'antd';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { getCarsMock } from '@/services/carService';
import { useAuthStore } from '@/store/authStore';
import type { Car } from '@/types/Car';
import { formatDate, formatPrice } from '@/utils/format';

const STATUS_COLOR: Record<string, string> = {
  Pending: 'gold',
  Approved: 'green',
  Rejected: 'red',
  Sold: 'default',
};

export default function MyCars() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-cars', user?.fullName],
    queryFn: () => getCarsMock({ page: 1, pageSize: 100, sortBy: 'newest' }),
  });

  const mine = (data?.items ?? []).filter((c) => c.seller.id === user?.id || c.seller.name === user?.fullName);

  const onDelete = (car: Car) => {
    try {
      const raw = localStorage.getItem('tommycar_cars');
      const arr = raw ? (JSON.parse(raw) as Car[]) : [];
      if (arr.some((c) => c.id === car.id)) {
        localStorage.setItem('tommycar_cars', JSON.stringify(arr.filter((c) => c.id !== car.id)));
        toast.success('Đã xóa tin');
        refetch();
      } else {
        // Tin mock: lưu id đã xóa để ẩn đi (persist)
        const rawDel = localStorage.getItem('tommycar_deleted');
        const dels: string[] = rawDel ? JSON.parse(rawDel) : [];
        localStorage.setItem('tommycar_deleted', JSON.stringify([...dels, car.id]));
        toast.success('Đã xóa tin (mock)');
        refetch();
      }
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>Xe của tôi - TommyCar</title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold m-0">Xe của tôi</h1>
        <Button type="primary" onClick={() => navigate('/post-car')}>
          Đăng tin mới
        </Button>
      </div>
      {mine.length === 0 && !isLoading ? (
        <Empty description="Bạn chưa đăng tin nào">
          <Button type="primary" onClick={() => navigate('/post-car')}>
            Đăng tin ngay
          </Button>
        </Empty>
      ) : (
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={mine}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          columns={[
            {
              title: 'Ảnh',
              dataIndex: 'images',
              width: 110,
              render: (imgs: string[]) => <img src={imgs[0]} alt="" loading="lazy" className="w-24 h-16 object-cover rounded" />,
            },
            { title: 'Tiêu đề', dataIndex: 'title', ellipsis: true },
            { title: 'Giá', dataIndex: 'price', width: 150, render: (p: number) => formatPrice(p) },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              width: 120,
              render: (s: string) => <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
            },
            { title: 'Lượt xem', dataIndex: 'viewCount', width: 90 },
            { title: 'Ngày đăng', dataIndex: 'createdAt', width: 120, render: (d: string) => formatDate(d) },
            {
              title: 'Hành động',
              width: 220,
              render: (_, car: Car) => (
                <div className="flex gap-1">
                  <Button size="small" onClick={() => navigate(`/cars/${car.id}`)}>
                    Xem
                  </Button>
                  <Button
                    size="small"
                    disabled={!(car.status === 'Pending' || car.status === 'Rejected')}
                    onClick={() => navigate(`/cars/${car.id}/edit`)}
                  >
                    Sửa
                  </Button>
                  <Popconfirm title="Xóa tin này?" onConfirm={() => onDelete(car)}>
                    <Button size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
      )}
      <div className="mt-2 text-sm" style={{ color: '#8c8c8c' }}>
        Mẹo: tin mới đăng có trạng thái <Tag color="gold">Pending</Tag> và lưu vào localStorage key
        <code> tommycar_cars </code> nên reload không mất. Xem thử <Link to="/post-car">đăng tin</Link>.
      </div>
    </div>
  );
}
