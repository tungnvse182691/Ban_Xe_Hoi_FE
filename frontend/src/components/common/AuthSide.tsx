import { BadgeCheck } from 'lucide-react';
import Logo from './Logo';

/** Panel ảnh split-screen cho Login/Register - premium dark */
export default function AuthSide() {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-full" style={{ background: '#0b1220' }}>
      <img
        src="/cars/hero.jpg"
        alt="Showroom TommyCar"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(200deg, rgba(11,18,32,.1) 0%, rgba(11,18,32,.55) 55%, rgba(11,18,32,.92) 100%)' }}
      />
      <div className="relative p-7 flex flex-col justify-end h-full min-h-[320px] md:min-h-[560px]">
        <Logo dark />
        <h2 className="text-white text-2xl font-extrabold mt-5 tracking-tight leading-snug">
          Mua bán xe <span className="text-gold-gradient">minh bạch</span>,
          <br />sang tên trọn gói
        </h2>
        <div className="flex gap-6 mt-5">
          {[
            { v: '3.800+', l: 'Xe đang bán' },
            { v: '100+', l: 'Hạng mục kiểm định' },
            { v: '24/7', l: 'Hỗ trợ' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-white font-extrabold text-lg">{s.v}</div>
              <div className="text-xs uppercase tracking-widest" style={{ color: '#94a3b8' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div
          className="flex items-center gap-2 mt-5 text-xs font-semibold px-3 py-2 rounded-lg self-start"
          style={{ background: 'rgba(255,255,255,.12)', color: '#e2e8f0' }}
        >
          <BadgeCheck size={14} style={{ color: '#f5b301' }} /> Đăng tin miễn phí • Duyệt nhanh trong 24h
        </div>
      </div>
    </div>
  );
}
