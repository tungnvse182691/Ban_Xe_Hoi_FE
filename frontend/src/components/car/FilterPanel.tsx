import { Button, Collapse, InputNumber, Select, Slider, Tag } from 'antd';
import { brandsMock, modelsMock } from '@/mocks/data';

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
  const priceLabel = (v?: number)=> v ? `${(v/1000000000).toFixed(1)} tỷ` : '—';
  
  const activeCount = [
    values.brandId, values.modelId, values.condition,
    values.minPrice, values.maxPrice,
    values.yearFrom !== undefined && values.yearFrom !== 2010 ? 'y' : undefined,
    values.yearTo !== undefined && values.yearTo !== 2026 ? 'y' : undefined,
    (values.fuel?.length ?? 0) > 0 ? 'f' : undefined,
    (values.transmission?.length ?? 0) > 0 ? 't' : undefined,
  ].filter(Boolean).length;

  const chips: {key:string; label:string}[] = [];
  if(values.brandId) chips.push({key:'brand', label: brandsMock.find(b=>String(b.id)===values.brandId)?.name || values.brandId});
  if(values.condition) chips.push({key:'cond', label: values.condition==='New'?'Mới':'Cũ'});
  if(values.minPrice || values.maxPrice) chips.push({key:'price', label: `${priceLabel(values.minPrice)} - ${priceLabel(values.maxPrice)}`});

  return (
    <div className="flex flex-col gap-3">
      {activeCount>0 && (
        <div className="flex flex-wrap gap-1.5 items-center pb-2" style={{borderBottom:'1px solid #f1f5f9'}}>
          <span className="text-xs font-semibold" style={{color:'#0284c7'}}>{activeCount} lọc</span>
          {chips.map(c=>(
            <Tag key={c.key} closable onClose={()=> {
              if(c.key==='brand') onChange({brandId: undefined, modelId: undefined});
              else if(c.key==='cond') onChange({condition: ''});
              else if(c.key==='price') onChange({minPrice: undefined, maxPrice: undefined});
            }} style={{borderRadius:999, background:'#f1f5f9', border:'1px solid #e2e8f0', fontSize:11}}>{c.label}</Tag>
          ))}
          <button onClick={onReset} className="text-xs ml-auto" style={{color:'#64748b', textDecoration:'underline'}}>Xóa hết</button>
        </div>
      )}

      <Collapse
        defaultActiveKey={['brand','price']}
        ghost
        size="small"
        items={[
          {
            key:'brand',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Hãng & Dòng xe</span>,
            children: (
              <div className="flex flex-col gap-3">
                <Select className="w-full" placeholder="Tất cả hãng" allowClear value={values.brandId || undefined} onChange={(v) => onChange({ brandId: v, modelId: undefined })} options={brandsMock.map((b) => ({ label: b.name, value: String(b.id) }))} style={{borderRadius:12}}/>
                <Select className="w-full" placeholder="Tất cả dòng xe" allowClear disabled={!values.brandId} value={values.modelId || undefined} onChange={(v) => onChange({ modelId: v })} options={models.map((m) => ({ label: m.name, value: String(m.id) }))} style={{borderRadius:12}}/>
              </div>
            )
          },
          {
            key:'price',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Khoảng giá</span>,
            children: (
              <div>
                <div className="text-xs mb-2 flex justify-between font-semibold" style={{color:'#0284c7'}}><span>{priceLabel(values.minPrice)}</span><span>{priceLabel(values.maxPrice)}</span></div>
                <Slider range min={0} max={MAX_PRICE} step={50000000} value={[values.minPrice ?? 0, values.maxPrice ?? MAX_PRICE]} onChange={([min, max]) => onChange({ minPrice: min, maxPrice: max === MAX_PRICE ? undefined : max })} tooltip={{formatter:(v)=>`${(Number(v)/1000000000).toFixed(1)} tỷ`}}/>
                <div className="flex gap-2 mt-2">
                  <InputNumber className="w-full" placeholder="Từ" value={values.minPrice} onChange={(v) => onChange({ minPrice: v ?? undefined })} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{borderRadius:10}}/>
                  <InputNumber className="w-full" placeholder="Đến" value={values.maxPrice} onChange={(v) => onChange({ maxPrice: v ?? undefined })} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{borderRadius:10}}/>
                </div>
              </div>
            )
          },
          {
            key:'year',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Năm: {values.yearFrom ?? 2010} - {values.yearTo ?? 2026}</span>,
            children: (
              <Slider range min={2010} max={2026} value={[values.yearFrom ?? 2010, values.yearTo ?? 2026]} onChange={([from, to]) => onChange({ yearFrom: from, yearTo: to })}/>
            )
          },
          {
            key:'fuel',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Nhiên liệu</span>,
            children: (
              <div className="flex flex-wrap gap-1.5">
                {['Petrol','Diesel','Electric','Hybrid'].map(f=>{
                  const active = (values.fuel??[]).includes(f);
                  return <button key={f} onClick={()=>{ const cur=new Set(values.fuel??[]); active?cur.delete(f):cur.add(f); onChange({fuel:[...cur]});}} className="px-3 py-1.5 rounded-full text-xs font-semibold border transition" style={{background: active?'#0284c7':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0284c7':'#e2e8f0'}}>{f}</button>
                })}
              </div>
            )
          },
          {
            key:'trans',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Hộp số</span>,
            children: (
              <div className="flex flex-wrap gap-1.5">
                {['MT','AT','CVT'].map(t=>{
                  const active=(values.transmission??[]).includes(t);
                  return <button key={t} onClick={()=>{ const cur=new Set(values.transmission??[]); active?cur.delete(t):cur.add(t); onChange({transmission:[...cur]});}} className="px-3 py-1.5 rounded-full text-xs font-semibold border transition" style={{background: active?'#0284c7':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0284c7':'#e2e8f0'}}>{t}</button>
                })}
              </div>
            )
          },
          {
            key:'cond',
            label: <span className="text-xs font-bold uppercase tracking-widest" style={{color:'#0b1220'}}>Tình trạng</span>,
            children: (
              <div className="flex gap-1.5">
                {[
                  { label: 'Tất cả', value: '' },
                  { label: 'Mới', value: 'New' },
                  { label: 'Cũ', value: 'Used' },
                ].map(o=>{
                  const active=(values.condition??'')===o.value;
                  return <button key={o.value||'all'} onClick={()=>onChange({condition:o.value})} className="flex-1 py-2 rounded-xl text-xs font-bold border transition" style={{background: active?'#0b1220':'#fff', color: active?'#fff':'#334155', borderColor: active?'#0b1220':'#e2e8f0'}}>{o.label}</button>
                })}
              </div>
            )
          },
        ]}
      />

      <Button onClick={onReset} block style={{borderRadius:12, borderColor:'#e2e8f0', marginTop:4}}>✕ Xóa lọc</Button>
    </div>
  );
}

export function toCarFilter(v: FilterValues & { page?: number; pageSize?: number }): import('@/types/Car').CarFilterParams {
  return {
    search: v.search || undefined,
    brandId: v.brandId ? Number(v.brandId) : undefined,
    modelId: v.modelId ? Number(v.modelId) : undefined,
    condition: (v.condition as 'New' | 'Used') || undefined,
    minPrice: v.minPrice,
    maxPrice: v.maxPrice,
    fuel: (v.fuel as import('@/types/Car').CarFilterParams['fuel'])?.length ? (v.fuel as 'Petrol'[]) : undefined,
    transmission: (v.transmission as import('@/types/Car').CarFilterParams['transmission'])?.length
      ? (v.transmission as 'AT'[])
      : undefined,
    yearFrom: v.yearFrom,
    yearTo: v.yearTo,
    sortBy: (v.sortBy as import('@/types/Car').CarFilterParams['sortBy']) ?? 'newest',
    page: v.page ?? 1,
    pageSize: v.pageSize ?? 12,
  };
}
