import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { usersMock } from '@/mocks/data';
import { useAuthStore } from '@/store/authStore';
import AuthSide from '@/components/common/AuthSide';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (v: FormValues) => {
    const found =
      usersMock.find((u) => u.email.toLowerCase() === v.email.toLowerCase()) ??
      ({
        id: `u-${Date.now()}`,
        fullName: v.email.split('@')[0],
        email: v.email,
        phone: '0900000000',
        role: v.email.toLowerCase() === 'admin@tommycar.vn' ? 'Admin' : 'User',
        createdAt: new Date().toISOString(),
        isActive: true,
      } as (typeof usersMock)[number]);
    login(found, 'mock-token');
    toast.success(`Xin chào ${found.fullName}!`);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      <Helmet>
        <title>Đăng nhập - TommyCar</title>
      </Helmet>
      <Card title="Đăng nhập" className="h-full">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="user@test.com" />}
            />
          </Form.Item>
          <Form.Item label="Mật khẩu" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} placeholder="******" />}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            Đăng nhập
          </Button>
          <Button
            block
            className="mt-2"
            onClick={() => {
              setValue('email', 'user@test.com');
              setValue('password', '123456');
            }}
          >
            Điền tài khoản Demo
          </Button>
          <div className="mt-3 text-sm flex justify-between">
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
            <Link to="/login">Quên mật khẩu?</Link>
          </div>
        </Form>
      </Card>
      <AuthSide />
    </div>
  );
}
