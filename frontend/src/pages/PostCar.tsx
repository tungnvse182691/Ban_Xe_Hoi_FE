import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, InputNumber, Radio, Select, Steps, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import CarCard from '@/components/car/CarCard';
import { brandsMock, modelsMock } from '@/mocks/data';
import { useAuthStore } from '@/store/authStore';
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
  mileage: z.number().min(0, 'Odo không âm'),
  fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
  transmission: z.enum(['MT', 'AT', 'CVT']),
  engineCapacity: z.string().min(1, 'Nhập dung tích/động cơ'),
  color: z.string().min(1, 'Nhập màu sắc'),
  seats: z.number().min(2).max(16),
  origin: z.enum(['Imported', 'Domestic']),
  description: z.string().min(20, 'Mô tả tối thiểu 20 ký tự').max(2000, 'Tối đa 2000 ký tự'),
});

type FormValues = z.infer<typeof schema>;

const LOCATIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Nghệ An', 'Quảng Ninh'];
const STEP_FIELDS: (keyof FormValues)[][] = [
  ['title', 'brandId', 'modelId', 'condition', 'price', 'year', 'location'],
  ['mileage', 'fuel', 'transmission', 'engineCapacity', 'color', 'seats', 'origin', 'description'],
  [],
];

export default function PostCar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const [mainIdx, setMainIdx] = useState(0);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition: 'Used',
      year: 2022,
      fuel: 'Petrol',
      transmission: 'AT',
      seats: 5,
      origin: 'Domestic',
      mileage: 20000,
    },
  });

  const brandId = watch('brandId');
  const models = modelsMock.filter((m) => !brandId || m.brandId === Number(brandId));
  const all = watch();

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => s + 1);
  };

  const beforeUpload = (file: File) => {
    if (files.length >= 10) {
      toast.error('Tối đa 10 ảnh');
      return false;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Chỉ nhận jpg/png/webp');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Mỗi ảnh < 5MB');
      return false;
    }
    setFiles((f) => [...f, { file, url: URL.createObjectURL(file) }]);
    return false;
  };

  const onSubmit = (v: FormValues) => {
    if (files.length < 3) {
      toast.error('Cần ít nhất 3 ảnh');
      setStep(2);
      return;
    }
    const brand = brandsMock.find((b) => b.id === Number(v.brandId))!;
    const model = modelsMock.find((m) => m.id === Number(v.modelId))!;
    const orderedUrls = [files[mainIdx]?.url, ...files.filter((_, i) => i !== mainIdx).map((f) => f.url)].filter(Boolean) as string[];
    const car: Car = {
      id: `local-${Date.now()}`,
      title: v.title,
      brand: brand.name,
      model: model.name,
      brandId: brand.id,
      modelId: model.id,
      price: v.price,
      year: v.year,
      mileage: v.mileage,
      fuel: v.fuel,
      transmission: v.transmission,
      condition: v.condition,
      location: v.location,
      images: orderedUrls,
      status: 'Pending',
      viewCount: 0,
      seller: { id: user?.id ?? 'u1', name: user?.fullName ?? 'Bạn', phone: user?.phone ?? '0900000000', avatar: user?.avatar },
      createdAt: new Date().toISOString(),
      description: v.description,
      color: v.color,
      seats: v.seats,
      engineCapacity: v.engineCapacity,
      origin: v.origin,
    };
    try {
      const raw = localStorage.getItem('tommycar_cars');
      const arr = raw ? (JSON.parse(raw) as Car[]) : [];
      localStorage.setItem('tommycar_cars', JSON.stringify([car, ...arr]));
    } catch {
      toast.error('Không lưu được localStorage');
      return;
    }
    toast.success('Tin của bạn đang chờ duyệt!');
    navigate('/my-cars');
  };

  const previewCar: Car | null =
    step === 3
      ? {
          id: 'preview',
          title: all.title || 'Tiêu đề xem trước',
          brand: brandsMock.find((b) => b.id === Number(all.brandId))?.name ?? '',
          model: modelsMock.find((m) => m.id === Number(all.modelId))?.name ?? '',
          brandId: Number(all.brandId) || 0,
          modelId: Number(all.modelId) || 0,
          price: all.price || 0,
          year: all.year || 2022,
          mileage: all.mileage || 0,
          fuel: all.fuel || 'Petrol',
          transmission: all.transmission || 'AT',
          condition: all.condition || 'Used',
          location: all.location || '',
          images: files.map((f) => f.url),
          status: 'Pending',
          viewCount: 0,
          seller: { id: user?.id ?? 'u1', name: user?.fullName ?? 'Bạn', phone: user?.phone ?? '' },
          createdAt: new Date().toISOString(),
        }
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet>
        <title>Đăng tin bán xe - TommyCar</title>
      </Helmet>
      <Card title="Đăng tin bán xe">
        <Steps
          current={step}
          items={[
            { title: 'Thông tin cơ bản' },
            { title: 'Thông số' },
            { title: 'Hình ảnh' },
            { title: 'Xem trước' },
          ]}
          className="mb-6"
        />
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item label="Tiêu đề" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message} className="md:col-span-2">
                <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="Toyota Vios 2022 1.5G CVT - Odo 25k" />} />
              </Form.Item>
              <Form.Item label="Hãng xe" validateStatus={errors.brandId ? 'error' : ''} help={errors.brandId?.message}>
                <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Chọn hãng" options={brandsMock.map((b) => ({ label: b.name, value: String(b.id) }))} />
                  )}
                />
              </Form.Item>
              <Form.Item label="Dòng xe" validateStatus={errors.modelId ? 'error' : ''} help={errors.modelId?.message}>
                <Controller
                  name="modelId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Chọn dòng xe" disabled={!brandId} options={models.map((m) => ({ label: m.name, value: String(m.id) }))} />
                  )}
                />
              </Form.Item>
              <Form.Item label="Tình trạng">
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group {...field} options={[{ label: 'Mới', value: 'New' }, { label: 'Cũ', value: 'Used' }]} />
                  )}
                />
              </Form.Item>
              <Form.Item label="Năm" validateStatus={errors.year ? 'error' : ''} help={errors.year?.message}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} options={Array.from({ length: 17 }, (_, i) => 2026 - i).map((y) => ({ label: String(y), value: y }))} />
                  )}
                />
              </Form.Item>
              <Form.Item label="Giá (VNĐ)" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
                <Controller name="price" control={control} render={({ field }) => <InputNumber {...field} className="w-full" min={0} step={1000000} placeholder="520000000" />} />
              </Form.Item>
              <Form.Item label="Tỉnh/Thành" validateStatus={errors.location ? 'error' : ''} help={errors.location?.message}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => <Select {...field} placeholder="Chọn" options={LOCATIONS.map((l) => ({ label: l, value: l }))} />}
                />
              </Form.Item>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item label="Odo (km)" validateStatus={errors.mileage ? 'error' : ''} help={errors.mileage?.message}>
                <Controller name="mileage" control={control} render={({ field }) => <InputNumber {...field} className="w-full" min={0} />} />
              </Form.Item>
              <Form.Item label="Nhiên liệu">
                <Controller name="fuel" control={control} render={({ field }) => <Select {...field} options={['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((f) => ({ label: f, value: f }))} />} />
              </Form.Item>
              <Form.Item label="Hộp số">
                <Controller name="transmission" control={control} render={({ field }) => <Select {...field} options={['MT', 'AT', 'CVT'].map((t) => ({ label: t, value: t }))} />} />
              </Form.Item>
              <Form.Item label="Động cơ" validateStatus={errors.engineCapacity ? 'error' : ''} help={errors.engineCapacity?.message}>
                <Controller name="engineCapacity" control={control} render={({ field }) => <Input {...field} placeholder="1.5L" />} />
              </Form.Item>
              <Form.Item label="Màu sắc" validateStatus={errors.color ? 'error' : ''} help={errors.color?.message}>
                <Controller name="color" control={control} render={({ field }) => <Input {...field} placeholder="Trắng" />} />
              </Form.Item>
              <Form.Item label="Số chỗ">
                <Controller name="seats" control={control} render={({ field }) => <InputNumber {...field} className="w-full" min={2} max={16} />} />
              </Form.Item>
              <Form.Item label="Xuất xứ">
                <Controller name="origin" control={control} render={({ field }) => <Radio.Group {...field} options={[{ label: 'Nhập khẩu', value: 'Imported' }, { label: 'Lắp ráp', value: 'Domestic' }]} />} />
              </Form.Item>
              <Form.Item label={`Mô tả (${watch('description')?.length ?? 0}/2000)`} validateStatus={errors.description ? 'error' : ''} help={errors.description?.message} className="md:col-span-2">
                <Controller name="description" control={control} render={({ field }) => <Input.TextArea {...field} rows={5} showCount maxLength={2000} placeholder="Mô tả chi tiết xe, lịch sử bảo dưỡng..." />} />
              </Form.Item>
            </div>
          )}

          {step === 2 && (
            <div>
              <Dragger beforeUpload={beforeUpload} multiple showUploadList={false} accept="image/*">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p>Kéo thả hoặc click để chọn ảnh (tối đa 10, mỗi ảnh &lt;5MB, ít nhất 3 ảnh)</p>
              </Dragger>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {files.map((f, i) => (
                  <div key={f.url} className="relative">
                    <img src={f.url} alt={`upload ${i}`} className="h-24 w-full object-cover rounded" style={{ border: i === mainIdx ? '2px solid #1677ff' : 'none' }} />
                    <div className="flex gap-1 mt-1">
                      <Button size="small" onClick={() => setMainIdx(i)} disabled={i === mainIdx}>
                        {i === mainIdx ? 'Ảnh chính' : 'Đặt chính'}
                      </Button>
                      <Button size="small" danger onClick={() => setFiles((arr) => arr.filter((_, j) => j !== i))}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {files.length < 3 && <p style={{ color: '#ff4d4f' }}>Cần ít nhất 3 ảnh (đang có {files.length})</p>}
            </div>
          )}

          {step === 3 && previewCar && (
            <div className="max-w-sm">
              {previewCar.images.length > 0 ? <CarCard car={previewCar} /> : <p>Chưa có ảnh xem trước</p>}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Quay lại
            </Button>
            {step < 3 ? (
              <Button type="primary" onClick={next}>
                Tiếp theo
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Đăng tin
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}
