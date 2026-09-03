import { Card } from 'antd';
import { useLocation } from 'react-router-dom';

function Placeholder({ title }: { title: string }) {
  const loc = useLocation();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card title={title}>
        <p>
          Trang <b>{title}</b> sẽ làm ở bước tiếp theo (F1-F7). Route hiện tại: <code>{loc.pathname}{loc.search}</code>
        </p>
      </Card>
    </div>
  );
}

export function NotFound() {
  return <Placeholder title="404 - Không tìm thấy trang" />;
}
