import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-16" style={{ background: '#0b1220', color: '#cbd5e1' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12">
        <div>
          <Logo dark />
          <p className="mt-3 text-sm leading-relaxed">
            Sàn mua bán xe cũ & mới đã kiểm định. Minh bạch giá, hỗ trợ sang tên trọn gói.
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'rgba(245,179,1,.12)', color: '#f5b301' }}
          >
            <Phone size={15} /> 1900 1234 (24/7)
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Mua xe</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/cars?condition=New" style={{ color: 'inherit' }}>Xe mới</Link></li>
            <li><Link to="/cars?condition=Used" style={{ color: 'inherit' }}>Xe cũ</Link></li>
            <li><Link to="/compare" style={{ color: 'inherit' }}>So sánh xe</Link></li>
            <li><Link to="/favorites" style={{ color: 'inherit' }}>Xe yêu thích</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Bán xe</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/post-car" style={{ color: 'inherit' }}>Đăng tin bán xe</Link></li>
            <li><Link to="/my-cars" style={{ color: 'inherit' }}>Quản lý tin đăng</Link></li>
            <li><Link to="/register" style={{ color: 'inherit' }}>Mở salon online</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /> hello@tommycar.vn</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Hà Nội — TP. Hồ Chí Minh</li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs flex flex-wrap gap-2 justify-between" style={{ color: '#64748b' }}>
          <span>© 2026 TommyCar. Ảnh minh họa từ Flickr (CC).</span>
          <span>Điều khoản • Bảo mật • Quy chế sàn</span>
        </div>
      </div>
    </footer>
  );
}
