import { Button, InputNumber, Select, Slider } from 'antd';
import { brandsMock, modelsMock } from '@/mocks/data';
import type { CarFilterParams } from '@/types/Car';

export interface FilterValues {
  brandId?: string;
  modelId?: string;
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  fuel?: string[];
  transmission?: string[];
  condition?: string;
  search?: string;
  sortBy?: string;
}

interface Props {
  values: FilterValues;
  onChange: (patch: Partial<FilterValues>) => void;
  onReset: () => void;
}

const MAX_PRICE = 5000000000;

export default function FilterPanel({ values, onChange, onReset }: Props) {
  const models = modelsMock.filter((m) => !values.brandId || m.brandId === Number(values.brandId));
  const priceLabel = (v?: number)=> v ? `${(v/1000000000).toFixed(2)} tỷ` : '—';
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}><span className="inline-flex items-center gap-1.5">🚗 Hãng xe</span></div>
        <Select
          className="w-full"
          placeholder="Tất cả hãng"
          allowClear
          value={values.brandId || undefined}
          onChange={(v) => onChange({ brandId: v, modelId: undefined })}
          options={brandsMock.map((b) => ({ label: b.name, value: String(b.id) }))}
          style={{borderRadius:12}}
        />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>📋 Dòng xe</div>
        <Select
          className="w-full"
          placeholder="Tất cả dòng xe"
          allowClear
          disabled={!values.brandId}
          value={values.modelId || undefined}
          onChange={(v) => onChange({ modelId: v })}
          options={models.map((m) => ({ label: m.name, value: String(m.id) }))}
          style={{borderRadius:12}}
        />
      </div>

      <div className="p-3 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>💰 Khoảng giá</div>
        <div className="text-xs mb-1 flex justify-between" style={{color:'#0284c7', fontWeight:600}}><span>{priceLabel(values.minPrice)}</span><span>{priceLabel(values.maxPrice)}</span></div>
        <Slider
          range
          min={0}
          max={MAX_PRICE}
          step={50000000}
          value={[values.minPrice ?? 0, values.maxPrice ?? MAX_PRICE]}
          onChange={([min, max]) => onChange({ minPrice: min, maxPrice: max === MAX_PRICE ? undefined : max })}
          tipFormatter={(v) => `${(Number(v) / 1000000000).toFixed(1)} tỷ`}
        />
        <div className="flex gap-2 mt-1">
          <InputNumber
            className="w-full"
            placeholder="Từ"
            value={values.minPrice}
            onChange={(v) => onChange({ minPrice: v ?? undefined })}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{borderRadius:10}}
          />
          <InputNumber
            className="w-full"
            placeholder="Đến"
            value={values.maxPrice}
            onChange={(v) => onChange({ maxPrice: v ?? undefined })}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{borderRadius:10}}
          />
        </div>
      </div>

      <div className="p-3 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>
          📅 Năm: {values.yearFrom ?? 2010} - {values.yearTo ?? 2026}
        </div>
        <Slider
          range
          min={2010}
          max={2026}
          value={[values.yearFrom ?? 2010, values.yearTo ?? 2026]}
          onChange={([from, to]) => onChange({ yearFrom: from, yearTo: to })}
        />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>⛽ Nhiên liệu</div>
        <div className="flex flex-wrap gap-1.5">
          {['Petrol','Diesel','Electric','Hybrid'].map(f=>{
            const active = (values.fuel??[]).includes(f);
            return <button key={f} onClick={()=>{ const cur=new Set(values.fuel??[]); active?cur.delete(f):cur.add(f); onChange({fuel:[...cur]});}} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{background: active?'#0284c7':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0284c7':'#e2e8f0'}}>{f}</button>
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>⚙️ Hộp số</div>
        <div className="flex flex-wrap gap-1.5">
          {['MT','AT','CVT'].map(t=>{
            const active=(values.transmission??[]).includes(t);
            return <button key={t} onClick={()=>{ const cur=new Set(values.transmission??[]); active?cur.delete(t):cur.add(t); onChange({transmission:[...cur]});}} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{background: active?'#0284c7':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0284c7':'#e2e8f0'}}>{t}</button>
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'#0b1220'}}>✨ Tình trạng</div>
        <div className="flex gap-1.5">
          {[
            { label: 'Tất cả', value: '' },
            { label: 'Mới', value: 'New' },
            { label: 'Cũ', value: 'Used' },
          ].map(o=>{
            const active=(values.condition??'')===o.value;
            return <button key={o.value||'all'} onClick={()=>onChange({condition:o.value})} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{background: active?'#0b1220':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0b1220':'#e2e8f0'}}>{o.label}</button>
          })}
        </div>
      </div>

      <Button onClick={onReset} block style={{borderRadius:12, borderColor:'#e2e8f0'}}>✕ Xóa lọc</Button>
    </div>
  );
}

export function toCarFilter(v: FilterValues & { page?: number; pageSize?: number }): CarFilterParams {
  return {
    search: v.search || undefined,
    brandId: v.brandId ? Number(v.brandId) : undefined,
    modelId: v.modelId ? Number(v.modelId) : undefined,
    condition: (v.condition as 'New' | 'Used') || undefined,
    minPrice: v.minPrice,
    maxPrice: v.maxPrice,
    fuel: (v.fuel as CarFilterParams['fuel'])?.length ? (v.fuel as 'Petrol'[]) : undefined,
    transmission: (v.transmission as CarFilterParams['transmission'])?.length
      ? (v.transmission as 'AT'[])
      : undefined,
    yearFrom: v.yearFrom,
    yearTo: v.yearTo,
    sortBy: (v.sortBy as CarFilterParams['sortBy']) ?? 'newest',
    page: v.page ?? 1,
    pageSize: v.pageSize ?? 12,
  };
}
