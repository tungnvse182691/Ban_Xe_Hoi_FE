import { Avatar, Button, Card, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/format';

const schema = z
  .object({
    password: z.string().min(6, 'Tối thiểu 6 ký tự'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: 'Không khớp', path: ['confirm'] });

export default function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Card title="Hồ sơ cá nhân">
        <div className="flex gap-4 items-center">
          <Avatar src={user.avatar} size={64}>
            {user.fullName[0]}
          </Avatar>
          <div>
            <div className="font-bold text-lg">{user.fullName}</div>
            <div className="text-sm" style={{ color: '#8c8c8c' }}>
              {user.email} • {user.phone} • {user.role}
            </div>
            <div className="text-sm" style={{ color: '#8c8c8c' }}>
              Tham gia: {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </Card>
      <Card title="Đổi mật khẩu (mock)" className="mt-4">
        <Form
          layout="vertical"
          onFinish={() => {
            toast.success('Đã đổi mật khẩu (mock)');
            reset();
          }}
        >
          <Form.Item label="Mật khẩu mới" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item label="Nhập lại" validateStatus={errors.confirm ? 'error' : ''} help={errors.confirm?.message}>
            <Controller name="confirm" control={control} render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
