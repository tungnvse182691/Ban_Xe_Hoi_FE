import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, InputNumber, Radio, Select, Steps, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { brandsMock, modelsMock } from '@/mocks/data';
import { useAuthStore } from '@/store/authStore';
import { getCarByIdMock } from '@/services/carService';
import type { Car } from '@/types/Car';

const { Dragger } = Upload;
const schema = z.object({
  title: z.string().min(10, 'Tiêu đề tối thiểu 10 ký tự'),
  brandId: z.string().min(1, 'Chọn hãng xe'),
  modelId: z.string().min(1, 'Chọn dòng xe'),
  condition: z.enum(['New', 'Used']),
  price: z.number({ invalid_type_error: 'Nhập giá' }).positive('Giá phải > 0'),
  year: z.number().min(2010).max(2026),
  location: z.string().min(1, 'Chọn tỉnh/thành'),
  mileage: z.number().min(0),
  fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
  transmission: z.enum(['MT', 'AT', 'CVT']),
  engineCapacity: z.string().min(1, 'Nhập dung tích'),
  color: z.string().min(1, 'Nhập màu'),
  seats: z.number().min(2).max(16),
  origin: z.enum(['Imported', 'Domestic']),
  description: z.string().min(20, 'Tối thiểu 20 ký tự').max(2000),
});
type FormValues = z.infer<typeof schema>;
const LOCATIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Nghệ An', 'Quảng Ninh'];
const STEP_FIELDS: (keyof FormValues)[][] = [['title','brandId','modelId','condition','price','year','location'], ['mileage','fuel','transmission','engineCapacity','color','seats','origin','description'], []];

export default function EditCar(){
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(s=>s.user);
  const [step,setStep]=useState(0);
  const [files,setFiles]=useState<{url:string}[]>([]);
  const [mainIdx,setMainIdx]=useState(0);
  const [loading,setLoading]=useState(true);
  const [car,setCar]=useState<Car|null>(null);
  const { control, handleSubmit, trigger, watch, reset, formState:{errors} } = useForm<FormValues>({resolver: zodResolver(schema)});
  const brandId = watch('brandId');
  const models = modelsMock.filter(m=>!brandId || m.brandId===Number(brandId));

  useEffect(()=>{
    if(!id) return;
    getCarByIdMock(id).then(c=>{
      if(!c){ toast.error('Không tìm thấy xe'); navigate('/my-cars'); return; }
      if(c.seller.id && c.seller.id!==user?.id && c.seller.name!==user?.fullName){ toast.error('Không có quyền sửa tin này'); navigate('/my-cars'); return; }
      if(c.status==='Approved' || c.status==='Sold'){ toast.error('Chỉ sửa được tin Pending/Rejected'); navigate('/my-cars'); return; }
      setCar(c);
      reset({ title:c.title, brandId:String(c.brandId), modelId:String(c.modelId), condition:c.condition, price:c.price, year:c.year, location:c.location, mileage:c.mileage, fuel:c.fuel, transmission:c.transmission, engineCapacity:c.engineCapacity||'1.5L', color:c.color||'Trắng', seats:c.seats||5, origin:c.origin||'Domestic', description:c.description||'' });
      setFiles(c.images.map(url=>({url})));
      setMainIdx(0);
      setLoading(false);
    });
  },[id]);

  const next = async ()=>{ const ok=await trigger(STEP_FIELDS[step]); if(ok) setStep(s=>s+1); };
  const beforeUpload = (file: File)=>{
    if(files.length>=10){ toast.error('Tối đa 10 ảnh'); return false; }
    if(file.size>5*1024*1024){ toast.error('<5MB'); return false; }
    setFiles(f=>[...f,{url:URL.createObjectURL(file)}]);
    return false;
  };
  const onSubmit=(v:FormValues)=>{
    if(files.length<3){ toast.error('Cần ít nhất 3 ảnh'); setStep(2); return; }
    const brand=brandsMock.find(b=>b.id===Number(v.brandId))!;
    const model=modelsMock.find(m=>m.id===Number(v.modelId))!;
    const ordered=[files[mainIdx]?.url, ...files.filter((_,i)=>i!==mainIdx).map(f=>f.url)].filter(Boolean) as string[];
    const updated: Car = {...car!, title:v.title, brand:brand.name, model:model.name, brandId:brand.id, modelId:model.id, price:v.price, year:v.year, mileage:v.mileage, fuel:v.fuel, transmission:v.transmission, condition:v.condition, location:v.location, images:ordered, description:v.description, color:v.color, seats:v.seats, engineCapacity:v.engineCapacity, origin:v.origin, status:'Pending' as const };
    // update localStorage
    try{
      const raw=localStorage.getItem('tommycar_cars');
      const arr: Car[] = raw?JSON.parse(raw):[];
      const idx=arr.findIndex(c=>c.id===id);
      if(idx>=0){ arr[idx]=updated; localStorage.setItem('tommycar_cars', JSON.stringify(arr)); }
      else {
        // if mock car, save as local override
        const cur=arr; cur.unshift(updated); localStorage.setItem('tommycar_cars', JSON.stringify(cur));
        // mark deleted? no, keep original but local will shadow? Use status override + also hide? Simpler: add to local and mark deleted original
        void localStorage.getItem('tommycar_deleted');
        // don't delete, just override via local (allCars puts local first, but mock still exists duplicate id). Change id to keep unique? Keep same id, allCars will return local first, mock duplicate but filter by id in detail will find local first.
      }
      // reset status override
      const rawSt=localStorage.getItem('tommycar_status');
      const st = rawSt?JSON.parse(rawSt):{};
      if(st[id!]){ delete st[id!]; localStorage.setItem('tommycar_status', JSON.stringify(st)); }
      toast.success('Đã cập nhật, tin chờ duyệt lại');
      navigate('/my-cars');
    }catch{ toast.error('Lưu thất bại'); }
  };

  if(loading) return <div className="max-w-4xl mx-auto p-6">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet><title>Sửa tin - TommyCar</title></Helmet>
      <Card title={`Sửa tin: ${car?.title}`}>
        <Steps current={step} items={[{title:'Cơ bản'},{title:'Thông số'},{title:'Ảnh'},{title:'Xem lại'}]} className="mb-6"/>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {step===0 && (
            <div className="grid md:grid-cols-2 gap-x-4">
              <Form.Item label="Tiêu đề" validateStatus={errors.title?'error':''} help={errors.title?.message} className="md:col-span-2">
                <Controller name="title" control={control} render={({field})=><Input {...field}/>}/>
              </Form.Item>
              <Form.Item label="Hãng xe" validateStatus={errors.brandId?'error':''} help={errors.brandId?.message}>
                <Controller name="brandId" control={control} render={({field})=><Select {...field} options={brandsMock.map(b=>({label:b.name,value:String(b.id)}))}/> }/>
              </Form.Item>
              <Form.Item label="Dòng xe" validateStatus={errors.modelId?'error':''} help={errors.modelId?.message}>
                <Controller name="modelId" control={control} render={({field})=><Select {...field} disabled={!brandId} options={models.map(m=>({label:m.name,value:String(m.id)}))}/> }/>
              </Form.Item>
              <Form.Item label="Tình trạng"><Controller name="condition" control={control} render={({field})=><Radio.Group {...field} options={[{label:'Mới',value:'New'},{label:'Cũ',value:'Used'}]}/>}/></Form.Item>
              <Form.Item label="Năm" validateStatus={errors.year?'error':''} help={errors.year?.message}><Controller name="year" control={control} render={({field})=><Select {...field} options={Array.from({length:17},(_,i)=>2026-i).map(y=>({label:String(y),value:y}))}/>}/></Form.Item>
              <Form.Item label="Giá" validateStatus={errors.price?'error':''} help={errors.price?.message}><Controller name="price" control={control} render={({field})=><InputNumber {...field} className="w-full" min={0} step={1000000}/>}/></Form.Item>
              <Form.Item label="Khu vực" validateStatus={errors.location?'error':''} help={errors.location?.message}><Controller name="location" control={control} render={({field})=><Select {...field} options={LOCATIONS.map(l=>({label:l,value:l}))}/>}/></Form.Item>
            </div>
          )}
          {step===1 && (
            <div className="grid md:grid-cols-2 gap-x-4">
              <Form.Item label="Odo"><Controller name="mileage" control={control} render={({field})=><InputNumber {...field} className="w-full"/>}/></Form.Item>
              <Form.Item label="Nhiên liệu"><Controller name="fuel" control={control} render={({field})=><Select {...field} options={['Petrol','Diesel','Electric','Hybrid'].map(f=>({label:f,value:f}))}/>}/></Form.Item>
              <Form.Item label="Hộp số"><Controller name="transmission" control={control} render={({field})=><Select {...field} options={['MT','AT','CVT'].map(t=>({label:t,value:t}))}/>}/></Form.Item>
              <Form.Item label="Động cơ" validateStatus={errors.engineCapacity?'error':''} help={errors.engineCapacity?.message}><Controller name="engineCapacity" control={control} render={({field})=><Input {...field}/>}/></Form.Item>
              <Form.Item label="Màu" validateStatus={errors.color?'error':''} help={errors.color?.message}><Controller name="color" control={control} render={({field})=><Input {...field}/>}/></Form.Item>
              <Form.Item label="Số chỗ"><Controller name="seats" control={control} render={({field})=><InputNumber {...field} className="w-full"/>}/></Form.Item>
              <Form.Item label="Xuất xứ"><Controller name="origin" control={control} render={({field})=><Radio.Group {...field} options={[{label:'Nhập khẩu',value:'Imported'},{label:'Lắp ráp',value:'Domestic'}]}/>}/></Form.Item>
              <Form.Item label="Mô tả" className="md:col-span-2" validateStatus={errors.description?'error':''} help={errors.description?.message}><Controller name="description" control={control} render={({field})=><Input.TextArea {...field} rows={4}/>}/></Form.Item>
            </div>
          )}
          {step===2 && (
            <div>
              <Dragger beforeUpload={beforeUpload} multiple showUploadList={false} accept="image/*"><p className="ant-upload-drag-icon"><InboxOutlined/></p><p>Thêm ảnh (tối đa 10, ít nhất 3)</p></Dragger>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {files.map((f,i)=><div key={f.url} className="relative"><img src={f.url} className="h-24 w-full object-cover rounded" style={{border:i===mainIdx?'2px solid #0284c7':'none'}}/><div className="flex gap-1 mt-1"><Button size="small" onClick={()=>setMainIdx(i)} disabled={i===mainIdx}>{i===mainIdx?'Chính':'Đặt chính'}</Button><Button size="small" danger onClick={()=>setFiles(a=>a.filter((_,j)=>j!==i))}>Xóa</Button></div></div>)}
              </div>
            </div>
          )}
          {step===3 && <div className="text-sm" style={{color:'#64748b'}}>Xem lại thông tin và bấm Cập nhật. Tin sẽ về Pending để admin duyệt lại.</div>}
          <div className="flex justify-between mt-6">
            <Button disabled={step===0} onClick={()=>setStep(s=>s-1)}>Quay lại</Button>
            {step<3 ? <Button type="primary" onClick={next}>Tiếp theo</Button> : <Button type="primary" htmlType="submit">Cập nhật</Button>}
          </div>
        </Form>
      </Card>
    </div>
  );
}
