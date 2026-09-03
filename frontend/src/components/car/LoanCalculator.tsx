import { useMemo, useState } from 'react';
import { Card, InputNumber, Slider } from 'antd';
import { formatPrice } from '@/utils/format';

function calcMonthly(principal: number, annualRate: number, months: number){
  if(principal<=0 || months<=0) return 0;
  const r = annualRate/100/12;
  if(r===0) return principal/months;
  return principal * r * Math.pow(1+r, months) / (Math.pow(1+r, months)-1);
}

export default function LoanCalculator({ price }: { price: number }){
  const [down, setDown] = useState(Math.round(price*0.2));
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(8);

  const principal = Math.max(0, price - down);
  const monthly = useMemo(()=> calcMonthly(principal, rate, term), [principal, rate, term]);
  const total = monthly*term;
  const interest = total - principal;

  return (
    <Card
      title={<span className="font-bold font-display" style={{color:'#0b1220'}}>Tính trả góp</span>}
      styles={{ body: { padding: 16 } }}
      style={{ borderRadius:16 }}
    >
      <div className="text-xs mb-1" style={{color:'#64748b'}}>Giá xe</div>
      <div className="font-bold mb-3" style={{color:'#0b1220'}}>{formatPrice(price)}</div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold mb-1"><span style={{color:'#0b1220'}}>Trả trước</span><span style={{color:'#0284c7'}}>{formatPrice(down)}</span></div>
        <Slider min={0} max={Math.round(price*0.8)} step={10000000} value={down} onChange={setDown}/>
        <InputNumber className="w-full mt-1" value={down} onChange={v=>setDown(v??0)} formatter={v=>`${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} addonAfter="VNĐ" style={{borderRadius:10}}/>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold mb-1"><span style={{color:'#0b1220'}}>Kỳ hạn</span><span style={{color:'#0284c7'}}>{term} tháng</span></div>
        <Slider min={12} max={84} step={12} marks={{12:'12',36:'36',60:'60',84:'84'}} value={term} onChange={setTerm}/>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold mb-1"><span style={{color:'#0b1220'}}>Lãi suất</span><span style={{color:'#0284c7'}}>{rate}%/năm</span></div>
        <Slider min={4} max={15} step={0.5} value={rate} onChange={setRate}/>
      </div>

      <div className="rounded-xl p-4" style={{background:'#0b1220', color:'#fff'}}>
        <div className="text-xs" style={{color:'#94a3b8'}}>Trả hàng tháng</div>
        <div className="text-2xl font-extrabold font-display">{formatPrice(Math.round(monthly))} <span className="text-sm font-normal" style={{color:'#94a3b8'}}>/tháng</span></div>
        <div className="text-xs mt-2 flex justify-between" style={{color:'#cbd5e1'}}><span>Vay {formatPrice(principal)}</span><span>{term} tháng</span></div>
        <div className="text-xs flex justify-between" style={{color:'#94a3b8'}}><span>Lãi tạm tính</span><span>{formatPrice(Math.round(interest))}</span></div>
        <div className="text-xs flex justify-between" style={{color:'#94a3b8'}}><span>Tổng trả</span><span>{formatPrice(Math.round(total))}</span></div>
      </div>
      <div className="text-xs mt-2" style={{color:'#94a3b8'}}>Công thức chuẩn amortizing, chỉ mang tính tham khảo.</div>
    </Card>
  );
}
