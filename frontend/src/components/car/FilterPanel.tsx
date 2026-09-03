import { Button, Checkbox, InputNumber, Radio, Select, Slider } from 'antd';
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

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="font-medium mb-1">Hãng xe</div>
        <Select
          className="w-full"
          placeholder="Tất cả hãng"
          allowClear
          value={values.brandId || undefined}
          onChange={(v) => onChange({ brandId: v, modelId: undefined })}
          options={brandsMock.map((b) => ({ label: b.name, value: String(b.id) }))}
        />
      </div>

      <div>
        <div className="font-medium mb-1">Dòng xe</div>
        <Select
          className="w-full"
          placeholder="Tất cả dòng xe"
          allowClear
          disabled={!values.brandId}
          value={values.modelId || undefined}
          onChange={(v) => onChange({ modelId: v })}
          options={models.map((m) => ({ label: m.name, value: String(m.id) }))}
        />
      </div>

      <div>
        <div className="font-medium mb-1">Khoảng giá</div>
        <Slider
          range
          min={0}
          max={MAX_PRICE}
          step={50000000}
          value={[values.minPrice ?? 0, values.maxPrice ?? MAX_PRICE]}
          onChange={([min, max]) => onChange({ minPrice: min, maxPrice: max === MAX_PRICE ? undefined : max })}
          tipFormatter={(v) => `${(Number(v) / 1000000000).toFixed(1)} tỷ`}
        />
        <div className="flex gap-2">
          <InputNumber
            className="w-full"
            placeholder="Từ"
            value={values.minPrice}
            onChange={(v) => onChange({ minPrice: v ?? undefined })}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
          <InputNumber
            className="w-full"
            placeholder="Đến"
            value={values.maxPrice}
            onChange={(v) => onChange({ maxPrice: v ?? undefined })}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </div>
      </div>

      <div>
        <div className="font-medium mb-1">
          Năm: {values.yearFrom ?? 2010} - {values.yearTo ?? 2024}
        </div>
        <Slider
          range
          min={2010}
          max={2024}
          value={[values.yearFrom ?? 2010, values.yearTo ?? 2024]}
          onChange={([from, to]) => onChange({ yearFrom: from, yearTo: to })}
        />
      </div>

      <div>
        <div className="font-medium mb-1">Nhiên liệu</div>
        <Checkbox.Group
          value={values.fuel ?? []}
          onChange={(v) => onChange({ fuel: v as string[] })}
          options={['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((f) => ({ label: f, value: f }))}
        />
      </div>

      <div>
        <div className="font-medium mb-1">Hộp số</div>
        <Checkbox.Group
          value={values.transmission ?? []}
          onChange={(v) => onChange({ transmission: v as string[] })}
          options={['MT', 'AT', 'CVT'].map((t) => ({ label: t, value: t }))}
        />
      </div>

      <div>
        <div className="font-medium mb-1">Tình trạng</div>
        <Radio.Group
          value={values.condition ?? ''}
          onChange={(e) => onChange({ condition: e.target.value })}
          options={[
            { label: 'Tất cả', value: '' },
            { label: 'Mới', value: 'New' },
            { label: 'Cũ', value: 'Used' },
          ]}
        />
      </div>

      <Button onClick={onReset}>Xóa lọc</Button>
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
