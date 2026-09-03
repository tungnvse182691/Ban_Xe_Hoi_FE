import { useState } from 'react';
import { Avatar, Button, Card, Input, Table, Tag } from 'antd';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { usersMock } from '@/mocks/data';
import { formatDate } from '@/utils/format';

export default function Users() {
  const [search, setSearch] = useState('');
  const [banned, setBanned] = useState<string[]>([]);

  const rows = usersMock
    .map((u) => ({ ...u, isActive: !banned.includes(u.id) }))
    .filter(
      (u) =>
        !search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  const admins = usersMock.filter((u) => u.role === 'Admin').length;

  return (
    <>
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[
        { label: 'Tổng tài khoản', value: usersMock.length, bg: 'linear-gradient(135deg,#1677ff,#0958d9)' },
        { label: 'Quản trị viên', value: admins, bg: 'linear-gradient(135deg,#722ed1,#391085)' },
        { label: 'Đang bị ban', value: banned.length, bg: 'linear-gradient(135deg,#ff4d4f,#a8071a)' },
      ].map((s) => (
        <Card key={s.label} styles={{ body: { padding: 14 } }}>
          <div className="flex items-center gap-3">
            <span className="rounded-xl font-extrabold text-white text-lg flex items-center justify-center shrink-0" style={{ width: 44, height: 44, background: s.bg }}>
              {s.value}
            </span>
            <span className="font-semibold text-sm">{s.label}</span>
          </div>
        </Card>
      ))}
    </div>
    <Card
      title={
        <span>
          Quản lý User <Tag color="blue" style={{ fontWeight: 700 }}>{usersMock.length} tài khoản</Tag>
        </span>
      }
    >
      <Helmet>
        <title>Quản lý User - Admin</title>
      </Helmet>
      <Input.Search
        placeholder="Tìm tên/email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: 16 }}
        allowClear
      />
      <Table
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
        columns={[
          {
            title: 'User', render: (_, r) => (
              <div className="flex gap-2 items-center">
                <Avatar src={r.avatar}>{r.fullName[0]}</Avatar>
                <div>
                  <div className="font-medium">{r.fullName}</div>
                  <div className="text-xs" style={{ color: '#8c8c8c' }}>{r.email}</div>
                </div>
              </div>
            ),
          },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Role', dataIndex: 'role', width: 90, render: (r: string) => <Tag color={r === 'Admin' ? 'red' : 'blue'}>{r}</Tag> },
          { title: 'Trạng thái', width: 120, render: (_, r) => (r.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Banned</Tag>) },
          { title: 'Ngày tạo', dataIndex: 'createdAt', width: 110, render: (d: string) => formatDate(d) },
          {
            title: 'Hành động', width: 130,
            render: (_, r) => (
              <Button
                size="small"
                danger={r.isActive}
                onClick={() => {
                  setBanned((b) => (b.includes(r.id) ? b.filter((x) => x !== r.id) : [...b, r.id]));
                  toast.success(r.isActive ? 'Đã ban user (mock)' : 'Đã unban user (mock)');
                }}
              >
                {r.isActive ? 'Ban' : 'Unban'}
              </Button>
            ),
          },
        ]}
      />
    </Card>
    </>
  );
}
