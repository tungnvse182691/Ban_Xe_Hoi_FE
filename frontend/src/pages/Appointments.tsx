import { useState } from 'react';
import { Button, Card, Empty, Popconfirm, Table, Tag, Tabs } from 'antd';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { getAppointments, updateAppointmentStatus } from '@/services/appointmentService';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';

const STATUS_COLOR: Record<string,string> = { Pending:'gold', Confirmed:'green', Cancelled:'red', Done:'blue' };

export default function Appointments(){
  const user = useAuthStore(s=>s.user);
  const [refresh,setRefresh]=useState(0); void refresh;
  const list = getAppointments();
  const myRequests = list.filter(a=>a.buyerId===user?.id);
  const received = list.filter(a=>a.sellerId===user?.id);

  const change = (id:string, status: 'Confirmed'|'Cancelled'|'Done')=>{
    updateAppointmentStatus(id,status);
    toast.success(`Đã ${status==='Confirmed'?'xác nhận':status==='Cancelled'?'hủy':'hoàn tất'}`);
    setRefresh(x=>x+1);
  };

  const cols = (isSeller:boolean)=>[
    { title:'Xe', render:(_:unknown, r:any)=><Link to={`/cars/${r.carId}`} className="flex gap-2 items-center"><img src={r.carImage} className="w-16 h-12 object-cover rounded"/>{r.carTitle}</Link> },
    { title:'Người mua', dataIndex:'buyerName', render:(v:string, r:any)=> isSeller ? v : r.sellerName },
    { title:'Ngày hẹn', dataIndex:'date', render:(d:string)=> formatDate(d) },
    { title:'SĐT', dataIndex:'phone' },
    { title:'Trạng thái', dataIndex:'status', render:(s:string)=><Tag color={STATUS_COLOR[s]}>{s}</Tag>},
    { title:'Hành động', render:(_:unknown, r:any)=>{
        if(!isSeller) return r.status==='Pending' ? <Popconfirm title="Hủy lịch?" onConfirm={()=>change(r.id,'Cancelled')}><Button size="small" danger>Hủy</Button></Popconfirm> : null;
        if(r.status==='Pending') return <div className="flex gap-1"><Button size="small" type="primary" onClick={()=>change(r.id,'Confirmed')}>Xác nhận</Button><Button size="small" danger onClick={()=>change(r.id,'Cancelled')}>Từ chối</Button></div>;
        if(r.status==='Confirmed') return <Button size="small" onClick={()=>change(r.id,'Done')}>Hoàn tất</Button>;
        return null;
      }},
  ];

  if(!user) return <div className="max-w-3xl mx-auto p-6">Vui lòng đăng nhập</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet><title>Lịch hẹn - TommyCar</title></Helmet>
      <h1 className="text-xl font-bold font-display">Lịch xem xe</h1>
      <Tabs className="mt-4" items={[
        { key:'my', label:`Yêu cầu của tôi (${myRequests.length})`, children: myRequests.length? <Table rowKey="id" dataSource={myRequests} columns={cols(false) as any} pagination={{pageSize:10}}/> : <Empty description="Chưa có lịch hẹn"/>},
        { key:'recv', label:`Lịch nhận được (${received.length})`, children: received.length? <Table rowKey="id" dataSource={received} columns={cols(true) as any} pagination={{pageSize:10}}/> : <Empty description="Chưa có ai đặt lịch xe của bạn"/>},
      ]}/>
      <Card size="small" className="mt-4" style={{background:'#f8fafc'}}>Mẹo: đặt lịch ở <Link to="/cars">chi tiết xe</Link> {'->'} Đặt lịch. Dữ liệu lưu localStorage key tommycar_appointments.</Card>
    </div>
  );
}
