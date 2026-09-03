import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>404 - Không tìm thấy trang</title>
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm không tồn tại hoặc đã bị xóa."
        extra={
          <div className="flex gap-2 justify-center">
            <Button type="primary">
              <Link to="/">Về trang chủ</Link>
            </Button>
            <Button>
              <Link to="/cars">Xem danh sách xe</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
