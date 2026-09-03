import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Empty, Modal, Table, Tabs, Tag } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { getCarsMock, setCarStatusMock } from '@/services/carService';
import type { Car } from '@/types/Car';
import { formatDate, formatPrice, formatRelative } from '@/utils/format';

const STATUS_META: Record<string, { color: string; label: string }> = {
  Pending: { color: 'gold', label: 'Chờ duyệt' },
  Approved: { color: 'green', label: 'Đã duyệt' },
  Rejected: { color: 'red', label: 'Từ chối' },
  Sold: { color: 'default', label: 'Đã bán' },
};

export default function PendingCars() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('Pending');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-all'],
    queryFn: () => getCarsMock({ page: 1, pageSize: 200, sortBy: 'newest' }),
  });

  const cars = data?.items ?? [];
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: cars.length, Pending: 0, Approved: 0, Rejected: 0, Sold: 0 };
    cars.forEach((car) => {
      c[car.status] = (c[car.status] ?? 0) + 1;
    });
    return c;
  }, [cars]);

  const rows = tab === 'All' ? cars : cars.filter((c) => c.status === tab);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-all'] });

  const act = (car: Car, status: Car['status'], title: string, okMsg: string) => {
    Modal.confirm({
      title,
      content: car.title,
      okText: status === 'Approved' ? 'Duyệt' : 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        setCarStatusMock(car.id, status);
        toast.success(okMsg);
        refresh();
      },
    });
  };

  return (
    <Card
      title={
        <span>
          Kiểm duyệt tin đăng <Tag color="gold" style={{ fontWeight: 700 }}>{counts.Pending} chờ</Tag>
        </span>
      }
    >
      <Helmet>
        <title>Duyệt tin - Admin</title>
      </Helmet>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={['Pending', 'Approved', 'Rejected', 'Sold', 'All'].map((k) => ({
          key: k,
          label: (
            <span>
              {k === 'All' ? 'Tất cả' : STATUS_META[k].label} ({counts[k] ?? 0})
            </span>
          ),
        }))}
      />
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 950 }}
        locale={{ emptyText: <Empty description="Không có tin nào trong mục này" /> }}
        columns={[
          {
            title: '',
            dataIndex: 'images',
            width: 92,
            render: (imgs: string[]) => (
              <img src={imgs[0]} alt="" loading="lazy" className="object-cover rounded-lg" style={{ width: 76, height: 52 }} />
            ),
          },
          {
            title: 'Tin đăng',
            ellipsis: true,
            render: (_, r: Car) => (
              <div>
                <div className="font-medium line-clamp-2">{r.title}</div>
                <div className="text-xs" style={{ color: '#8c8c8c' }}>
                  {r.seller.name} • {formatRelative(r.createdAt)} • {formatDate(r.createdAt)}
                </div>
              </div>
            ),
          },
          { title: 'Giá', dataIndex: 'price', width: 140, render: (p: number) => <b style={{ color: '#ff6b00' }}>{formatPrice(p)}</b> },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 110,
            render: (s: string) => <Tag color={STATUS_META[s]?.color}>{STATUS_META[s]?.label ?? s}</Tag>,
          },
          {
            title: 'Hành động',
            width: 190,
            render: (_, r: Car) => (
              <div className="flex gap-1">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckOutlined />}
                  disabled={r.status === 'Approved'}
                  onClick={() => act(r, 'Approved', 'Duyệt tin này?', 'Đã duyệt tin')}
                >
                  Duyệt
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  disabled={r.status === 'Rejected'}
                  onClick={() => act(r, 'Rejected', 'Từ chối tin này?', 'Đã từ chối tin')}
                >
                  Từ chối
                </Button>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
