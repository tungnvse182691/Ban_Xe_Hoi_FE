import { useState } from 'react';
import { Button, Card, Select, Table, Tag } from 'antd';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { getAppointments, updateAppointmentStatus } from '@/services/appointmentService';
import { formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';
import type { ApptStatus } from '@/types/Appointment';

const COLOR: Record<string,string> = { Pending:'gold', Confirmed:'green', Cancelled:'red', Done:'blue' };

export default function AppointmentsAdmin(){
  const [filter,setFilter]=useState<string>('All');
  const [refresh,setRefresh]=useState(0);
  void refresh;
  const all = getAppointments();
  const data = filter==='All' ? all : all.filter(a=>a.status===filter);
  const change = (id:string, s:ApptStatus)=>{ updateAppointmentStatus(id,s); toast.success(`Đã ${s}`); setRefresh(x=>x+1); };
  return (
    <Card title={<span>Tất cả lịch hẹn <Tag color="blue">{all.length}</Tag> <Tag color="gold">{all.filter(a=>a.status==='Pending').length} Pending</Tag></span>} extra={
      <Select value={filter} onChange={setFilter} style={{width:160}} options={[{label:'Tất cả',value:'All'},{label:'Pending',value:'Pending'},{label:'Confirmed',value:'Confirmed'},{label:'Cancelled',value:'Cancelled'},{label:'Done',value:'Done'}]}/>
    }>
      <Helmet><title>Lịch hẹn - Admin</title></Helmet>
      <Table rowKey="id" dataSource={data} pagination={{pageSize:10}} scroll={{x:1100}} columns={[
        { title:'Xe', render:(_:unknown,r:any)=><Link to={`/cars/${r.carId}`}>{r.carTitle}</Link> },
        { title:'Người mua', dataIndex:'buyerName' },
        { title:'Người bán', dataIndex:'sellerName' },
        { title:'Ngày hẹn', dataIndex:'date', render:(d:string)=>formatDate(d) },
        { title:'SĐT', dataIndex:'phone' },
        { title:'Trạng thái', dataIndex:'status', render:(s:string)=><Tag color={COLOR[s]}>{s}</Tag> },
        { title:'Hành động', render:(_:unknown,r:any)=>(
          <div className="flex gap-1">
            {r.status==='Pending' && <><Button size="small" type="primary" onClick={()=>change(r.id,'Confirmed')}>Duyệt</Button><Button size="small" danger onClick={()=>change(r.id,'Cancelled')}>Hủy</Button></>}
            {r.status==='Confirmed' && <Button size="small" onClick={()=>change(r.id,'Done')}>Done</Button>}
          </div>
        )},
      ]}/>
      <div className="text-xs mt-2" style={{color:'#64748b'}}>Dữ liệu localStorage tommycar_appointments - admin thấy tất cả, seller chỉ thấy của mình ở /appointments.</div>
    </Card>
  );
}
