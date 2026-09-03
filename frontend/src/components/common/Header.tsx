import { Link, useNavigate } from 'react-router-dom';
import { AutoComplete, Badge, Button, Drawer, Dropdown, Input } from 'antd';
import {
  CarFront,
  GitCompareArrows,
  Heart,
  Menu,
  PlusCircle,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCompareStore } from '@/store/compareStore';
import { carsMock } from '@/mocks/data';
import { formatPrice } from '@/utils/format';
import Logo from './Logo';

const NAV = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Xe mới', to: '/cars?condition=New' },
  { label: 'Xe cũ', to: '/cars?condition=Used' },
  { label: 'Bán xe', to: '/post-car', icon: true },
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const favCount = useFavoriteStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const [keyword, setKeyword] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const saveHistory = (kw:string)=>{
    if(!kw.trim()) return;
    try{
      const raw=localStorage.getItem('tommycar_search_history');
      const arr: string[] = raw?JSON.parse(raw):[];
      const next=[kw, ...arr.filter(x=>x!==kw)].slice(0,5);
      localStorage.setItem('tommycar_search_history', JSON.stringify(next));
    }catch{}
  };
  const onSearch = (val?: string) => {
    const kw = val ?? keyword;
    if(kw.trim()) saveHistory(kw.trim());
    navigate(kw ? `/cars?search=${encodeURIComponent(kw)}` : '/cars');
  };
  const history: string[] = (()=>{ try{ return JSON.parse(localStorage.getItem('tommycar_search_history')||'[]'); }catch{ return []; } })();
  const suggestions = useMemo(()=>{
    if(keyword.trim().length<2) {
      if(history.length) return history.map(h=>({ value:h, label: <span>🕒 {h}</span> }));
      return [];
    }
    const s=keyword.toLowerCase();
    return carsMock.filter(c=>c.title.toLowerCase().includes(s)).slice(0,5).map(c=>({
      value: c.title.split(' - ')[0],
      label: (
        <div className="flex gap-2 items-center" onClick={()=>navigate(`/cars/${c.id}`)}>
          <img src={c.images[0]} className="w-10 h-8 object-cover rounded"/>
          <div className="flex-1 min-w-0"><div className="truncate text-xs font-medium">{c.title}</div><div className="text-xs" style={{color:'#0284c7'}}>{formatPrice(c.price)}</div></div>
        </div>
      )
    }));
  },[keyword]);

  const userMenu = {
    items: [
      { key: 'profile', label: <Link to="/profile">Hồ sơ</Link> },
      { key: 'my-cars', label: <Link to="/my-cars">Xe của tôi</Link> },
      { key: 'appointments', label: <Link to="/appointments">Lịch hẹn</Link> },
      { key: 'favorites', label: <Link to="/favorites">Yêu thích</Link> },
      ...(user?.role === 'Admin'
        ? [{ key: 'admin', label: <Link to="/admin">Quản trị</Link> }]
        : []),
      { type: 'divider' as const },
      {
        key: 'logout',
        label: 'Đăng xuất',
        onClick: () => {
          logout();
          navigate('/');
        },
      },
    ],
  };

  return (
    <div
      className="sticky top-0 z-50"
      style={{
        boxShadow: scrolled ? '0 4px 20px rgba(11,18,32,.12)' : 'none',
        transition: 'box-shadow .25s',
      }}
    >
      {/* main bar */}
      <div style={{ background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8edf3' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-3 h-16 px-4">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {NAV.map((n) => (
              <Button
                key={n.to + n.label}
                type="text"
                className="font-medium"
                icon={n.icon ? <PlusCircle size={16} /> : undefined}
                onClick={() => navigate(n.to)}
              >
                {n.label}
              </Button>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md ml-auto">
            <AutoComplete
              options={suggestions}
              onSelect={(v)=>onSearch(v)}
              style={{width:'100%'}}
              popupMatchSelectWidth={400}
            >
              <Input.Search
                placeholder="Tìm Vios, Civic, CX-5..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={()=>onSearch()}
                enterButton={<Search size={16} />}
                allowClear
              />
            </AutoComplete>
          </div>

          <div className="flex-1 md:hidden" />

          <Button
            type="text"
            icon={<Menu size={20} />}
            className="lg:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
          />

          <Badge count={favCount} size="small" className="hidden sm:block">
            <Button
              type="text"
              icon={<Heart size={19} />}
              onClick={() => navigate('/favorites')}
              aria-label="Yêu thích"
            />
          </Badge>
          <Badge count={compareCount} size="small" className="hidden sm:block">
            <Button
              type="text"
              icon={<GitCompareArrows size={19} />}
              onClick={() => navigate('/compare')}
              aria-label="So sánh"
            />
          </Badge>

          {isAuthenticated && user ? (
            <Dropdown menu={userMenu} placement="bottomRight">
              <Button type="text" className="font-semibold">
                {user.fullName.split(' ').slice(-1)}
              </Button>
            </Dropdown>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>

      <Drawer title={<Logo />} open={mobileOpen} onClose={() => setMobileOpen(false)} placement="left">
        <div className="flex flex-col gap-1">
          <Input.Search
            placeholder="Tìm xe..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => {
              onSearch();
              setMobileOpen(false);
            }}
            enterButton={<Search size={16} />}
            className="mb-2"
          />
          {[
            { label: 'Trang chủ', to: '/', icon: <CarFront size={17} /> },
            { label: 'Xe mới', to: '/cars?condition=New' },
            { label: 'Xe cũ', to: '/cars?condition=Used' },
            { label: 'Bán xe', to: '/post-car', icon: <PlusCircle size={17} /> },
            { label: `Yêu thích (${favCount})`, to: '/favorites', icon: <Heart size={17} /> },
            { label: `So sánh (${compareCount})`, to: '/compare', icon: <GitCompareArrows size={17} /> },
          ].map((m) => (
            <Button
              key={m.to + m.label}
              type="text"
              icon={m.icon}
              style={{ textAlign: 'left', height: 44, fontSize: 15 }}
              onClick={() => {
                navigate(m.to);
                setMobileOpen(false);
              }}
            >
              {m.label}
            </Button>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 mt-3">
              <Button block onClick={() => { navigate('/login'); setMobileOpen(false); }}>Đăng nhập</Button>
              <Button block type="primary" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Đăng ký</Button>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
