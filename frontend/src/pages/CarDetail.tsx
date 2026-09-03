import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Skeleton,
  Tag,
} from 'antd';
import { EyeOutlined, HeartFilled, HeartOutlined, PhoneOutlined, SwapOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import CarGallery from '@/components/car/CarGallery';
import CarSpecs from '@/components/car/CarSpecs';
import CarCard from '@/components/car/CarCard';
import { carsMock } from '@/mocks/data';
import { getCarByIdMock } from '@/services/carService';
import { createAppointment } from '@/services/appointmentService';
import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCompareStore } from '@/store/compareStore';
import { formatPrice } from '@/utils/format';
import LoanCalculator from '@/components/car/LoanCalculator';
import TradeInEstimator from '@/components/car/TradeInEstimator';
import Reviews from '@/components/car/Reviews';

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [apptOpen, setApptOpen] = useState(false);
  const [form] = Form.useForm();

  const user = useAuthStore(s=>s.user);
  const toggleFav = useFavoriteStore((s) => s.toggle);
  const isFav = useFavoriteStore((s) => (id ? s.isFavorite(id) : false));
  const addCompare = useCompareStore((s) => s.add);

  const { data: car, isLoading } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCarByIdMock(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton active />
        <Skeleton.Image active style={{ width: '100%', height: 400 }} className="mt-4" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Empty description="Không tìm thấy xe" />
        <div className="text-center mt-4">
          <Link to="/cars">← Về danh sách xe</Link>
        </div>
      </div>
    );
  }

  const similar = carsMock
    .filter((c) => c.id !== car.id && c.brandId === car.brandId)
    .filter((c) => Math.abs(c.price - car.price) / car.price <= 0.3)
    .slice(0, 4);

  const onBook = (values: { date: unknown; phone: string; note?: string }) => {
    if(!user){ toast.error('Vui lòng đăng nhập để đặt lịch'); return; }
    if(!car) return;
    const dateStr = (values.date as any)?.toISOString ? (values.date as any).toISOString() : String(values.date);
    createAppointment({
      carId: car.id, carTitle: car.title, carImage: car.images[0],
      buyerId: user.id, buyerName: user.fullName,
      sellerId: car.seller.id || 'u1', sellerName: car.seller.name,
      date: dateStr, phone: values.phone, note: values.note
    });
    setApptOpen(false);
    form.resetFields();
    toast.success('Đã gửi yêu cầu đặt lịch, xem tại /appointments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>{`${car.title} - TommyCar`}</title>
      </Helmet>

      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/cars">Danh sách</Link> },
          { title: car.title.slice(0, 30) + '...' },
        ]}
        className="mb-4"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trái */}
        <div className="lg:col-span-2">
          <CarGallery car={car} />
          <div className="mt-4">
            <Tag color={car.condition === 'New' ? 'blue' : 'orange'}>
              {car.condition === 'New' ? 'Xe mới' : 'Xe cũ'}
            </Tag>
            <Tag icon={<EyeOutlined />}>{car.viewCount.toLocaleString('vi-VN')} lượt xem</Tag>
          </div>
          <h1 className="text-xl md:text-2xl font-bold mt-2">{car.title}</h1>
          <div className="text-2xl font-bold font-display" style={{ color: '#0b1220' }}>
            {formatPrice(car.price)}
          </div>

          <CarSpecs car={car} />

          <Card title="Mô tả" className="mt-4" style={{borderRadius:16}}>
            <p style={{ whiteSpace: 'pre-line' }}>{car.description}</p>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <LoanCalculator price={car.price} />
            <TradeInEstimator />
          </div>

          <div className="mt-4">
            <Reviews carId={car.id} />
          </div>

          {similar.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold font-display mb-4" style={{color:'#0b1220'}}>Xe tương tự</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {similar.map((c) => (
                  <CarCard key={c.id} car={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phải */}
        <div>
          <Card
            className="lg:sticky lg:top-20"
            styles={{ body: { padding: 0 } }}
          >
            <div className="h-1.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#0ea5e9,#0284c7,#0b1220)' }} />
            <div style={{ padding: 20 }}>
            <div className="flex gap-3 items-center">
              <Avatar
                src={car.seller.avatar}
                size={52}
                style={{ border: '2px solid #f5b301', flexShrink: 0 }}
              >
                {car.seller.name[0]}
              </Avatar>
              <div className="min-w-0">
                <div className="font-bold truncate">{car.seller.name}</div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#52c41a' }}>
                  ● Đang hoạt động
                </div>
                <div className="text-sm" style={{ color: '#8c8c8c' }}>
                  {car.location} • Tham gia từ 2023
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                type="primary"
                icon={<PhoneOutlined />}
                href={`tel:${car.seller.phone}`}
                style={{ background: '#0284c7', borderColor: '#0284c7', fontWeight: 700 }}
              >
                Gọi ngay
              </Button>
              <Button onClick={() => toast('Tính năng chat sẽ có ở bản cập nhật tới')}>
                Chat
              </Button>
            </div>
            <Button block className="mt-2" type="default" onClick={() => setApptOpen(true)}>
              Đặt lịch xem xe
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                icon={isFav ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={() => {
                  toggleFav(car.id);
                  toast.success(isFav ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
                }}
              >
                Yêu thích
              </Button>
              <Button
                icon={<SwapOutlined />}
                onClick={() => {
                  const r = addCompare(car.id);
                  if (r.ok) toast.success(r.message);
                  else toast.error(r.message);
                }}
              >
                So sánh
              </Button>
            </div>
            <div className="text-sm mt-3 rounded-xl px-3 py-2.5 flex items-center justify-between" style={{ background: '#f6f8fb' }}>
              <span style={{ color: '#8c8c8c' }}>Hotline người bán</span>
              <a href={`tel:${car.seller.phone}`} className="font-extrabold text-base" style={{ color: '#1677ff' }}>
                {car.seller.phone}
              </a>
            </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal title="Đặt lịch xem xe" open={apptOpen} onCancel={() => setApptOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onBook}>
          <Form.Item
            name="date"
            label="Ngày xem xe"
            rules={[{ required: true, message: 'Chọn ngày xem xe' }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(d) => d && d < dayjs().endOf('day')}
              placeholder="Chọn ngày (từ ngày mai)"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Nhập SĐT' },
              { pattern: /^(0|\+84)(3|5|7|8|9)\d{8}$/, message: 'SĐT Việt Nam không hợp lệ' },
            ]}
          >
            <Input placeholder="09xxxxxxxx" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Thời gian, địa điểm mong muốn..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi yêu cầu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
