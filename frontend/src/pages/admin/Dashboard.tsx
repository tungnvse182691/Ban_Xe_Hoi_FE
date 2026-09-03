import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, Row, Table, Tag, Timeline } from 'antd';
import { CarOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCarsMock, setCarStatusMock } from '@/services/carService';
import { formatRelative } from '@/utils/format';

const PIE_COLORS = ['#0284c7', '#0ea5e9', '#52c41a', '#38bdf8', '#0369a1'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-all'],
    queryFn: () => getCarsMock({ page: 1, pageSize: 200, sortBy: 'newest' }),
  });

  const cars = data?.items ?? [];
  const totalViews = cars.reduce((s, c) => s + c.viewCount, 0);
  const pending = cars.filter((c) => c.status === 'Pending');
  const sold = cars.filter((c) => c.status === 'Sold');

  const byBrand = Object.entries(
    cars.reduce<Record<string, number>>((acc, c) => {
      acc[c.brand] = (acc[c.brand] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const byCondition = [
    { name: 'Mới', value: cars.filter((c) => c.condition === 'New').length },
    { name: 'Cũ', value: cars.filter((c) => c.condition === 'Used').length },
  ];

  // Mock line: xe đăng 7 ngày gần nhất (gom theo createdAt, fill ngày thiếu = 0)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const count = cars.filter((c) => c.createdAt.slice(0, 10) === key).length;
    return { date: `${d.getDate()}/${d.getMonth() + 1}`, count };
  });

  const quickApprove = (id: string) => {
    setCarStatusMock(id, 'Approved');
    toast.success('Đã duyệt tin');
    queryClient.invalidateQueries({ queryKey: ['admin-all'] });
  };

  const newest5 = [...cars]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Tổng xe trên sàn',
      value: cars.length,
      sub: `${cars.filter((c) => c.condition === 'New').length} xe mới • ${cars.filter((c) => c.condition === 'Used').length} xe cũ`,
      icon: <CarOutlined />,
      bg: 'linear-gradient(135deg,#1677ff,#0958d9)',
    },
    {
      title: 'Tin chờ duyệt',
      value: pending.length,
      sub: 'Cần xử lý hôm nay',
      icon: <ClockCircleOutlined />,
      bg: 'linear-gradient(135deg,#f5b301,#ff6b00)',
    },
    {
      title: 'Xe đã bán',
      value: sold.length,
      sub: 'Giao dịch thành công',
      icon: <CheckCircleOutlined />,
      bg: 'linear-gradient(135deg,#52c41a,#237804)',
    },
    {
      title: 'Tổng lượt xem',
      value: totalViews,
      sub: 'Mọi tin đăng cộng lại',
      icon: <EyeOutlined />,
      bg: 'linear-gradient(135deg,#722ed1,#391085)',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard - TommyCar</title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold m-0 tracking-tight">Tổng quan sàn xe</h1>
          <p className="text-sm m-0" style={{ color: '#64748b' }}>
            Số liệu cập nhật theo thời gian thực từ mock data
          </p>
        </div>
        <Tag color="blue" style={{ fontWeight: 600 }}>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</Tag>
      </div>
      <Row gutter={16}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card loading={isLoading} styles={{ body: { padding: 18 } }} className="card-lift">
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: s.bg, color: '#fff' }}
                >
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-2xl font-extrabold leading-none">
                    {s.value.toLocaleString('vi-VN')}
                  </div>
                  <div className="font-semibold text-sm mt-1">{s.title}</div>
                </div>
              </div>
              <div className="text-xs mt-2" style={{ color: '#8c8c8c' }}>{s.sub}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} className="mt-4">
        <Col xs={24} lg={8}>
          <Card title="Xe theo hãng">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byBrand} dataKey="value" nameKey="name" outerRadius={90} label>
                  {byBrand.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Xe theo tình trạng">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byCondition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Xe đăng 7 ngày gần nhất">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={last7}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ff6b00" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Dải cảnh báo hành động */}
      {pending.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(90deg, rgba(255,107,0,.12), rgba(245,179,1,.12))', border: '1px solid rgba(255,107,0,.35)' }}
        >
          <ClockCircleOutlined style={{ color: '#ff6b00', fontSize: 20 }} />
          <span className="font-bold">Có {pending.length} tin đang chờ duyệt</span>
          <span className="text-sm" style={{ color: '#8c8c8c' }}>Duyệt sớm để xe sớm lên sàn</span>
          <div className="flex-1" />
          <Button type="primary" onClick={() => navigate('/admin/cars')} style={{ background: '#ff6b00', borderColor: '#ff6b00', fontWeight: 700 }}>
            Duyệt ngay →
          </Button>
        </div>
      )}

      <Row gutter={16} className="mt-4">
        <Col xs={24} lg={14}>
          <Card
            title={<span>Tin chờ duyệt <Tag color="gold" style={{ fontWeight: 700 }}>{pending.length}</Tag></span>}
            extra={<Link to="/admin/cars">Duyệt tin</Link>}
          >
            <Table
              rowKey="id"
              loading={isLoading}
              dataSource={pending.slice(0, 5)}
              pagination={false}
              locale={{ emptyText: 'Tuyệt vời — không còn tin chờ duyệt!' }}
              columns={[
                {
                  title: '',
                  dataIndex: 'images',
                  width: 76,
                  render: (imgs: string[]) => (
                    <img src={imgs[0]} alt="" loading="lazy" className="object-cover rounded-lg" style={{ width: 60, height: 42 }} />
                  ),
                },
                { title: 'Tiêu đề', dataIndex: 'title', ellipsis: true },
                { title: 'Người bán', dataIndex: ['seller', 'name'], width: 120, ellipsis: true },
                {
                  title: '',
                  width: 96,
                  render: (_, r) => (
                    <Button size="small" type="primary" onClick={() => quickApprove(r.id)}>
                      Duyệt
                    </Button>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Hành động nhanh" className="mb-4">
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => navigate('/admin/cars')}>Duyệt tin</Button>
              <Button onClick={() => navigate('/admin/users')}>Quản lý user</Button>
              <Button onClick={() => navigate('/cars')}>Xem sàn xe</Button>
            </div>
          </Card>
          <Card title="Hoạt động gần đây">
            <Timeline
              items={newest5.map((c) => ({
                color: c.status === 'Pending' ? 'orange' : 'green',
                children: (
                  <div key={c.id}>
                    <div className="text-sm font-medium line-clamp-2">{c.title}</div>
                    <div className="text-xs" style={{ color: '#8c8c8c' }}>
                      {c.seller.name} • {formatRelative(c.createdAt)}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
      <div className="mt-2">
        <Tag color="blue">Mẹo F7</Tag> Duyệt nhanh ở đây đổi status trong mock (localStorage
        <code> tommycar_status </code>) + toast, reload vẫn giữ.
      </div>
    </div>
  );
}
