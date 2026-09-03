import { useState } from 'react';
import { Button, Card, InputNumber, Select } from 'antd';
import { formatPrice } from '@/utils/format';
import { brandsMock } from '@/mocks/data';

export default function TradeInEstimator(){
  const [brandId,setBrandId]=useState<string>();
  const [year,setYear]=useState<number>(2020);
  const [odo,setOdo]=useState<number>(40000);
  const [estimate,setEstimate]=useState<number|null>(null);

  const calc=()=>{
    // simple mock: base 500tr depreciate 7%/year + 3% per 20k km
    const age = 2026 - year;
    const base = 600000000;
    const dep = base * (0.07*age) + (odo/20000)*0.03*base;
    const val = Math.max(80000000, Math.round(base - dep));
    setEstimate(val);
  };

  return (
    <Card title={<span className="font-bold font-display" style={{color:'#0b1220'}}>Định giá xe cũ đổi</span>} style={{borderRadius:16}}>
      <div className="grid grid-cols-2 gap-3">
        <Select placeholder="Hãng xe cũ" value={brandId} onChange={setBrandId} options={brandsMock.map(b=>({label:b.name, value:String(b.id)}))} style={{borderRadius:10}} allowClear/>
        <Select placeholder="Năm" value={year} onChange={setYear} options={Array.from({length:17},(_,i)=>2026-i).map(y=>({label:String(y), value:y}))}/>
        <div className="col-span-2">
          <div className="text-xs font-semibold mb-1" style={{color:'#0b1220'}}>Odo (km)</div>
          <InputNumber className="w-full" value={odo} onChange={v=>setOdo(v??0)} min={0} step={5000} style={{borderRadius:10}}/>
        </div>
      </div>
      <Button type="primary" block className="mt-3" style={{background:'#0b1220', borderColor:'#0b1220', borderRadius:10}} onClick={calc}>Định giá</Button>
      {estimate!==null && (
        <div className="mt-3 p-3 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
          <div className="text-xs" style={{color:'#64748b'}}>Giá thu ước tính</div>
          <div className="font-extrabold" style={{color:'#0b1220'}}>{formatPrice(estimate)}</div>
          <div className="text-xs" style={{color:'#64748b'}}>Dùng làm credit trừ thẳng vào giá xe mới.</div>
        </div>
      )}
    </Card>
  );
}
