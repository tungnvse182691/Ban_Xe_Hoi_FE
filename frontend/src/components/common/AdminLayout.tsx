import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, Button, Layout, Menu, Tag } from 'antd';
import {
  CarOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        style={{ background: '#0b1220' }}
      >
        <div style={{ padding: '18px 16px 12px', background: '#0b1220' }}>
          <Logo dark size={32} />
          <div className="mt-2">
            <Tag color="gold" style={{ border: 'none', fontWeight: 700, letterSpacing: 1 }}>
              ADMIN CONSOLE
            </Tag>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ background: '#0b1220', fontWeight: 500 }}
          onClick={({ key }) => navigate(key === 'dashboard' ? '/admin' : `/admin/${key}`)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'cars', icon: <CarOutlined />, label: 'Duyệt tin' },
            { key: 'users', icon: <UserOutlined />, label: 'Quản lý User' },
            { key: 'brands', icon: <CarOutlined />, label: 'Hãng & Dòng xe' },
            { key: 'appointments', icon: <CarOutlined />, label: 'Lịch hẹn' },
            { key: 'reviews', icon: <DashboardOutlined />, label: 'Đánh giá' },
            { key: 'webhook', icon: <DashboardOutlined />, label: 'Discord Webhook' },
          ]}
        />
      </Sider>
      <Layout style={{ background: '#eef2f7' }}>
        <Header
          style={{
            background: '#0b1220',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              ghost
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              style={{ borderColor: 'rgba(245,179,1,.6)', color: '#f5b301', fontWeight: 700 }}
            >
              Về trang chủ
            </Button>
            <span className="font-bold hidden md:block" style={{ color: '#fff', fontSize: 15 }}>
              Khu vực quản trị <span style={{ color: '#f5b301' }}>• TommyCar</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} style={{ background: '#0284c7' }}>
              {user?.fullName?.[0] ?? 'A'}
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-bold" style={{ color: '#fff' }}>{user?.fullName}</div>
              <Tag color="red" style={{ border: 'none', fontSize: 10 }}>ADMINISTRATOR</Tag>
            </div>
            <Button
              type="text"
              icon={<LogoutOutlined style={{ color: '#fff' }} />}
              onClick={() => {
                logout();
                navigate('/');
              }}
              aria-label="Đăng xuất"
            />
          </div>
        </Header>
        <Content style={{ margin: 24 }} className="animate-fadeUp">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
