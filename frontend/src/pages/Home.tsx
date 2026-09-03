import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Select } from 'antd';
import { ArrowRight, BadgeDollarSign, ChevronDown, Headset, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CarCard from '@/components/car/CarCard';
import BrandBadge from '@/components/common/BrandBadge';
import { brandsMock, carsMock } from '@/mocks/data';
import { getCarsMock, getFeaturedMock } from '@/services/carService';
import { useCountUp } from '@/hooks/useCountUp';

const PRICE_RANGES = [
  { label: 'Mọi tầm giá', value: '' },
  { label: 'Dưới 500 triệu', value: '0-500000000' },
  { label: '500 - 800 triệu', value: '500000000-800000000' },
  { label: '800 triệu - 1 tỷ', value: '800000000-1000000000' },
  { label: 'Trên 1 tỷ', value: '1000000000-' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function SectionHeader({ title, sub, link }: { title: string; sub?: string; link: string }) {
  return (
    <div className="flex items-end justify-between mt-12 mb-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-7 rounded-full" style={{ background: 'linear-gradient(#0ea5e9,#0284c7)' }} />
          <h2 className="text-xl md:text-2xl font-extrabold m-0 tracking-tight font-display">{title}</h2>
        </div>
        {sub && <p className="text-sm mt-1 ml-3.5" style={{ color: '#64748b' }}>{sub}</p>}
      </div>
      <Link to={link} className="flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: '#0284c7' }}>
        Xem tất cả <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div>
      <div className="text-2xl md:text-3xl font-extrabold text-white">
        <span ref={ref}>{value.toLocaleString('vi-VN')}</span>{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest" style={{ color: '#94a3b8' }}>{label}</div>
    </div>
  );
}

/** Tiêu đề hero với từng từ bay lên so le */
function AnimatedHeadline() {
  const line1: { t: string; gold?: boolean }[] = [
    { t: 'Tìm' }, { t: 'chiếc' }, { t: 'xe' }, { t: 'mơ' }, { t: 'ước', gold: true },
  ];
  const line2: { t: string; gold?: boolean }[] = [{ t: 'của' }, { t: 'bạn' }, { t: 'hôm' }, { t: 'nay.' }];
  const renderLine = (words: { t: string; gold?: boolean }[], base: number) => (
    <span className="block overflow-hidden pb-1">
      {words.map((w, i) => (
        <motion.span
          key={w.t + i}
          className={`inline-block mr-3 ${w.gold ? 'text-gold-gradient' : ''}`}
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 + (base + i) * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w.t}
        </motion.span>
      ))}
    </span>
  );
  return (
    <h1 className="text-white font-extrabold tracking-tight mt-4" style={{ fontSize: 'clamp(30px,5vw,54px)', lineHeight: 1.15 }}>
      {renderLine(line1, 0)}
      {renderLine(line2, 5)}
    </h1>
  );
}

function CarGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} loading style={{ borderRadius: 16 }} />
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [brandId, setBrandId] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [condition, setCondition] = useState<string>('');

  const stats = useMemo(() => {
    const views = carsMock.reduce((s, c) => s + c.viewCount, 0);
    return [
      { target: carsMock.length * 128, suffix: '+', label: 'Xe đang bán' },
      { target: brandsMock.length, suffix: '', label: 'Thương hiệu' },
      { target: Math.round(views / 1000), suffix: 'K+', label: 'Lượt xem mỗi tháng' },
    ];
  }, []);

  const featured = useQuery({ queryKey: ['featured'], queryFn: () => getFeaturedMock(8) });
  const newCars = useQuery({
    queryKey: ['home-new'],
    queryFn: () => getCarsMock({ condition: 'New', page: 1, pageSize: 4, sortBy: 'newest' }),
  });
  const usedCars = useQuery({
    queryKey: ['home-used'],
    queryFn: () => getCarsMock({ condition: 'Used', page: 1, pageSize: 4, sortBy: 'mostViewed' }),
  });

  const onSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('search', keyword.trim());
    navigate(params.toString() ? `/cars?${params.toString()}` : '/cars');
  };

  const onQuickFilter = () => {
    const params = new URLSearchParams();
    if (brandId) params.set('brandId', brandId);
    if (condition) params.set('condition', condition);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    navigate(params.toString() ? `/cars?${params.toString()}` : '/cars');
  };

  return (
    <div>
      <Helmet>
        <title>TommyCar - Mua bán xe cũ & mới</title>
      </Helmet>

      {/* HERO VIDEO */}
      <div className="relative overflow-hidden" style={{ background: '#0b1220' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-night.webm"
          poster="/cars/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(11,18,32,.62) 0%, rgba(11,18,32,.42) 45%, rgba(11,18,32,.94) 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 md:pt-20 md:pb-16">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.5 }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(245,179,1,.15)', color: '#f5b301', border: '1px solid rgba(245,179,1,.35)' }}
            >
              <ShieldCheck size={13} /> Sàn xe đã kiểm định
            </span>
            <AnimatedHeadline />
            <p className="mt-3 max-w-xl" style={{ color: '#cbd5e1', fontSize: 16 }}>
              Hàng nghìn xe cũ & mới minh bạch giá, lịch sử rõ ràng — đặt lịch xem xe trong 1 phút.
            </p>
          </motion.div>

          {/* glass search */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="glass rounded-2xl p-3 md:p-4 mt-7 max-w-4xl"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                size="large"
                placeholder="Tìm Vios, Civic, CX-5..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={onSearch}
                prefix={<Search size={17} style={{ color: '#94a3b8' }} />}
                style={{ borderRadius: 12 }}
              />
              <Button
                size="large"
                type="primary"
                icon={<Search size={17} />}
                onClick={onSearch}
                style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: 12, fontWeight: 700, minWidth: 150 }}
              >
                Tìm kiếm
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <Select
                size="large"
                placeholder="Hãng xe"
                value={brandId || undefined}
                onChange={setBrandId}
                options={[
                  { label: 'Tất cả hãng', value: '' },
                  ...brandsMock.map((b) => ({ label: b.name, value: String(b.id) })),
                ]}
              />
              <Select
                size="large"
                placeholder="Tầm giá"
                value={priceRange || undefined}
                onChange={setPriceRange}
                options={PRICE_RANGES.map((p) => ({ label: p.label, value: p.value }))}
              />
              <Select
                size="large"
                placeholder="Tình trạng"
                value={condition || undefined}
                onChange={setCondition}
                options={[
                  { label: 'Tất cả', value: '' },
                  { label: 'Xe mới', value: 'New' },
                  { label: 'Xe cũ', value: 'Used' },
                ]}
              />
              <Button size="large" onClick={onQuickFilter} style={{ borderRadius: 12, fontWeight: 600 }}>
                Lọc xe
              </Button>
            </div>
          </motion.div>

          {/* stats count-up */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex gap-8 mt-7"
          >
            {stats.map((s) => (
              <StatItem key={s.label} target={s.target} suffix={s.suffix} label={s.label} />
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-8"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} style={{ color: 'rgba(255,255,255,.6)' }} />
          </motion.div>
        </div>
      </div>

      {/* brand marquee - midnight glass sync */}
      <div className="border-y midnight-section" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 marquee-mask overflow-hidden">
          <div className="marquee-track">
            {[...brandsMock, ...brandsMock, ...brandsMock, ...brandsMock].map((b, i) => (
              <button
                key={b.id + '-' + i}
                onClick={() => navigate(`/cars?brandId=${b.id}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full shrink-0 glass-card"
                style={{ cursor: 'pointer', color:'#e2e8f0' }}
              >
                <BrandBadge letter={b.logo} name={b.name} size={28} />
                <span className="text-sm font-semibold">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="midnight-section -mx-4 px-4 py-10">
        <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} transition={{ duration: 0.45 }}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-7 rounded-full" style={{ background: 'linear-gradient(#38bdf8,#0284c7)' }} />
                <h2 className="text-xl md:text-2xl font-extrabold m-0 tracking-tight font-display" style={{color:'#fff'}}>Xe nổi bật</h2>
                <span className="ml-2 text-xs font-bold px-2.5 py-1 rounded-full" style={{background:'rgba(14,165,233,0.18)', color:'#7dd3fc', border:'1px solid rgba(14,165,233,0.3)'}}>Midnight Bento</span>
              </div>
              <p className="text-sm mt-1 ml-3.5" style={{ color: '#94a3b8' }}>Được xem nhiều nhất tuần qua • Liquid Glass</p>
            </div>
            <Link to="/cars?sortBy=mostViewed" className="flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: '#7dd3fc' }}>
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>
          {featured.isLoading ? (
            <CarGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr]">
              {featured.data?.map((car, idx) => (
                <div key={car.id} className={idx===0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                  <CarCard car={car} variant="glass" large={idx===0}/>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-4">

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} transition={{ duration: 0.45 }}>
          <SectionHeader title="Xe mới chính hãng" sub="Xe mới 100%, bảo hành đầy đủ" link="/cars?condition=New" />
          {newCars.isLoading ? (
            <CarGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newCars.data?.items.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} transition={{ duration: 0.45 }}>
          <SectionHeader title="Xe cũ giá tốt" sub="Đã kiểm định 100+ hạng mục" link="/cars?condition=Used" />
          {usedCars.isLoading ? (
            <CarGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {usedCars.data?.items.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </motion.div>

        {/* CTA sell */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl mt-12"
          style={{ background: 'linear-gradient(120deg, #0b1220 0%, #0c4a6e 55%, #0284c7 130%)' }}
        >
          <div className="px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f5b301' }}>
                Dành cho người bán
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
                Bán xe trong 5 phút, tiếp cận nghìn người mua
              </h3>
              <p className="mt-2" style={{ color: '#cbd5e1' }}>
                Đăng tin miễn phí — tin được duyệt hiển thị ngay trên sàn.
              </p>
            </div>
              <Button
              size="large"
              type="primary"
              icon={<ArrowRight size={17} />}
              onClick={() => navigate('/post-car')}
              style={{ background: '#F59E0B', borderColor: '#F59E0B', color: '#0b1220', borderRadius: 12, fontWeight: 800, height: 48 }}
            >
              Đăng tin ngay
            </Button>
          </div>
        </motion.div>

        {/* why us */}
        <h2 className="text-xl md:text-2xl font-extrabold mt-12 mb-5 tracking-tight">Vì sao chọn TommyCar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <ShieldCheck size={26} />, title: 'Kiểm định 100+ hạng mục', desc: 'Mỗi xe qua kiểm tra động cơ, khung gầm, pháp lý trước khi lên sàn.' },
            { icon: <BadgeDollarSign size={26} />, title: 'Giá minh bạch', desc: 'Đối chiếu giá thị trường theo từng dòng xe, không phí ẩn.' },
            { icon: <Headset size={26} />, title: 'Hỗ trợ sang tên trọn gói', desc: 'Tư vấn thủ tục, đặt lịch xem xe và hỗ trợ tài chính 24/7.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="card-lift h-full" styles={{ body: { padding: 22 } }}>
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(2,132,199,.1)', color: '#0284c7' }}
                >
                  {f.icon}
                </span>
                <h3 className="font-bold text-base mt-3 mb-1">{f.title}</h3>
                <p className="text-sm m-0" style={{ color: '#64748b' }}>{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
