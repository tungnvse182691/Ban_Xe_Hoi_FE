import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Drawer, Empty, Input, Pagination, Select, Skeleton } from 'antd';
import { AppstoreOutlined, BarsOutlined, FilterOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import CarCard from '@/components/car/CarCard';
import FilterPanel, { toCarFilter, type FilterValues } from '@/components/car/FilterPanel';
import { useDebounce } from '@/hooks/useDebounce';
import { getCarsMock } from '@/services/carService';
import { formatMileage, formatPrice } from '@/utils/format';

function parseParams(sp: URLSearchParams): FilterValues & { page: number; sortBy: string } {
  return {
    search: sp.get('search') ?? '',
    brandId: sp.get('brandId') ?? '',
    modelId: sp.get('modelId') ?? '',
    condition: sp.get('condition') ?? '',
    minPrice: sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined,
    maxPrice: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
    fuel: sp.get('fuel') ? [sp.get('fuel')!] : [],
    transmission: sp.get('transmission') ? [sp.get('transmission')!] : [],
    yearFrom: sp.get('yearFrom') ? Number(sp.get('yearFrom')) : undefined,
    yearTo: sp.get('yearTo') ? Number(sp.get('yearTo')) : undefined,
    sortBy: sp.get('sortBy') ?? 'newest',
    page: sp.get('page') ? Number(sp.get('page')) : 1,
  };
}

export default function CarList() {
  const [sp, setSp] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(sp.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const parsed = useMemo(() => parseParams(sp), [sp]);

  // Debounced search -> sync lên URL (không mất filter khi reload/share link)
  const effectiveSearch = debouncedSearch ?? '';
  const queryFilter = useMemo(
    () =>
      toCarFilter({
        ...parsed,
        search: effectiveSearch || parsed.search,
        page: parsed.page,
        pageSize: 12,
      }),
    [parsed, effectiveSearch],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['cars', queryFilter],
    queryFn: () => getCarsMock(queryFilter),
  });

  const patchUrl = (patch: Partial<FilterValues & { page: number; sortBy: string }>) => {
    const next = new URLSearchParams(sp);
    const setOrDel = (k: string, v: string | number | undefined | '') => {
      if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) next.delete(k);
      else next.set(k, String(v));
    };
    if ('search' in patch) setOrDel('search', patch.search);
    if ('brandId' in patch) {
      setOrDel('brandId', patch.brandId);
      if (patch.brandId === '') next.delete('modelId');
    }
    if ('modelId' in patch) setOrDel('modelId', patch.modelId);
    if ('condition' in patch) setOrDel('condition', patch.condition);
    if ('minPrice' in patch) setOrDel('minPrice', patch.minPrice);
    if ('maxPrice' in patch) setOrDel('maxPrice', patch.maxPrice);
    if ('yearFrom' in patch) setOrDel('yearFrom', patch.yearFrom);
    if ('yearTo' in patch) setOrDel('yearTo', patch.yearTo);
    if ('fuel' in patch) setOrDel('fuel', patch.fuel?.[0] as string);
    if ('transmission' in patch) setOrDel('transmission', patch.transmission?.[0] as string);
    if ('sortBy' in patch) setOrDel('sortBy', patch.sortBy);
    if ('page' in patch) {
      if (!patch.page || patch.page === 1) next.delete('page');
      else next.set('page', String(patch.page));
    }
    setSp(next);
  };

  const onFilterChange = (patch: Partial<FilterValues>) => {
    // Đổi filter -> reset về trang 1
    const next = new URLSearchParams(sp);
    const apply = (k: string, v: unknown) => {
      if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) next.delete(k);
      else if (Array.isArray(v)) next.set(k, String(v[0]));
      else next.set(k, String(v));
    };
    Object.entries(patch).forEach(([k, v]) => {
      if (k === 'brandId' && (v === '' || v === undefined)) next.delete('modelId');
      apply(k, v);
    });
    next.delete('page');
    setSp(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>Danh sách xe - TommyCar</title>
      </Helmet>

      <div className="flex gap-2 mb-4">
        <Input.Search
          placeholder="Tìm kiếm xe..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            patchUrl({ search: e.target.value, page: 1 });
          }}
          onSearch={(v) => patchUrl({ search: v, page: 1 })}
          style={{ maxWidth: 400 }}
          allowClear
        />
        <Button icon={<FilterOutlined />} className="lg:hidden" onClick={() => setDrawerOpen(true)}>
          Lọc
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <Card title="Bộ lọc" className="sticky top-20">
            <FilterPanel
              values={parsed}
              onChange={onFilterChange}
              onReset={() => {
                setSearchInput('');
                setSp({});
              }}
            />
          </Card>
        </div>

        <div className="flex-1">
          {/* Toolbar */}
          <div
            className="flex flex-wrap items-center gap-2 mb-4 px-4 py-3 rounded-2xl"
            style={{ background: '#fff', boxShadow: '0 1px 2px rgba(16,24,40,.06), 0 8px 24px -12px rgba(16,24,40,.25)' }}
          >
            <span className="font-medium">
              {isLoading ? 'Đang tìm...' : `Tìm thấy ${data?.total ?? 0} xe`}
            </span>
            <div className="flex-1" />
            <Select
              value={parsed.sortBy}
              onChange={(v) => patchUrl({ sortBy: v })}
              options={[
                { label: 'Mới nhất', value: 'newest' },
                { label: 'Giá thấp → cao', value: 'priceAsc' },
                { label: 'Giá cao → thấp', value: 'priceDesc' },
                { label: 'Năm mới nhất', value: 'yearDesc' },
                { label: 'Xem nhiều nhất', value: 'mostViewed' },
              ]}
              style={{ width: 170 }}
            />
            <Button
              icon={<AppstoreOutlined />}
              type={view === 'grid' ? 'primary' : 'default'}
              onClick={() => setView('grid')}
            />
            <Button
              icon={<BarsOutlined />}
              type={view === 'list' ? 'primary' : 'default'}
              onClick={() => setView('list')}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton.Image active style={{ width: '100%', height: 160 }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <Empty description="Không tìm thấy xe phù hợp" />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.items.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.items.map((car) => (
                <Card key={car.id} hoverable>
                  <div className="flex gap-4">
                    <img
                      src={car.images[0]}
                      alt={car.title}
                      loading="lazy"
                      className="w-40 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">{car.title}</div>
                      <div className="font-bold font-display" style={{ color: '#0b1220' }}>
                        {formatPrice(car.price)}
                      </div>
                      <div className="text-xs" style={{ color: '#8c8c8c' }}>
                        {car.year} • {formatMileage(car.mileage)} • {car.location}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {(data?.total ?? 0) > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={parsed.page}
                pageSize={12}
                total={data?.total ?? 0}
                showTotal={(t) => `Tổng ${t} xe`}
                onChange={(p) => patchUrl({ page: p })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drawer mobile */}
      <Drawer title="Bộ lọc" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel
          values={parsed}
          onChange={onFilterChange}
          onReset={() => {
            setSearchInput('');
            setSp({});
          }}
        />
        <Button type="primary" block className="mt-4" onClick={() => setDrawerOpen(false)}>
          Áp dụng
        </Button>
      </Drawer>
    </div>
  );
}
