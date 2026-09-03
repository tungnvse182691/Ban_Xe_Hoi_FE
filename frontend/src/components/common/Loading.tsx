import { Spin } from 'antd';

export default function Loading({ tip = 'Đang tải...' }: { tip?: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '50vh' }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
}

export function FullscreenLoading() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', zIndex: 9999 }}
    >
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
}
