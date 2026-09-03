import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
