import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/authStore';
import AuthSide from '@/components/common/AuthSide';

const schema = z
  .object({
    fullName: z.string().min(2, 'Nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'SĐT Việt Nam không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirm: z.string(),
    agree: z.literal(true, { errorMap: () => ({ message: 'Bạn phải đồng ý điều khoản' }) }),
  })
  .refine((d) => d.password === d.confirm, { message: 'Mật khẩu nhập lại không khớp', path: ['confirm'] });

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (v: FormValues) => {
    login(
      {
        id: `u-${Date.now()}`,
        fullName: v.fullName,
        email: v.email,
        phone: v.phone,
        role: 'User',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      'mock-token',
    );
    toast.success('Đăng ký thành công!');
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Helmet>
        <title>Đăng ký - TommyCar</title>
      </Helmet>
      <Card title="Đăng ký tài khoản">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Họ tên" validateStatus={errors.fullName ? 'error' : ''} help={errors.fullName?.message}>
            <Controller name="fullName" control={control} render={({ field }) => <Input {...field} placeholder="Nguyễn Văn A" />} />
          </Form.Item>
          <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller name="email" control={control} render={({ field }) => <Input {...field} placeholder="you@email.com" />} />
          </Form.Item>
          <Form.Item label="SĐT" validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
            <Controller name="phone" control={control} render={({ field }) => <Input {...field} placeholder="09xxxxxxxx" />} />
          </Form.Item>
          <Form.Item label="Mật khẩu" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item label="Nhập lại mật khẩu" validateStatus={errors.confirm ? 'error' : ''} help={errors.confirm?.message}>
            <Controller name="confirm" control={control} render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item validateStatus={errors.agree ? 'error' : ''} help={errors.agree?.message}>
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value === true} onChange={(e) => field.onChange(e.target.checked)}>
                  Tôi đồng ý điều khoản sử dụng
                </Checkbox>
              )}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            Đăng ký
          </Button>
          <div className="mt-3 text-sm">
            <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
          </div>
        </Form>
      </Card>
      <AuthSide />
    </div>
  );
}
