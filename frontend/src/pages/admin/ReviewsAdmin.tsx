import { useMemo, useState } from 'react';
import { Button, Card, Input, Rate, Table, Tag, Popconfirm } from 'antd';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { getAllReviews, deleteReview } from '@/components/car/Reviews';
import { carsMock } from '@/mocks/data';
import { formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';

export default function ReviewsAdmin(){
  const [q,setQ]=useState('');
  const [refresh,setRefresh]=useState(0);
  void refresh;
  const all = useMemo(()=> getAllReviews(), [refresh, q]);
  const filtered = all.filter(x=> !q || x.review.user.toLowerCase().includes(q.toLowerCase()) || x.review.comment.toLowerCase().includes(q.toLowerCase()) || x.carId.includes(q));
  const carName = (id:string)=> carsMock.find(c=>c.id===id)?.title || `Xe #${id}`;

  return (
    <Card title={<span>Quản lý Đánh giá <Tag color="blue">{all.length}</Tag></span>} extra={<span className="text-xs" style={{color:'#64748b'}}>CRUD đầy đủ • User sửa/xóa của mình, Admin xóa mọi đánh giá</span>}>
      <Helmet><title>Quản lý Đánh giá - Admin</title></Helmet>
      <div className="flex gap-2 mb-3">
        <Input placeholder="Tìm user, nội dung, carId..." value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:320}} allowClear/>
        <span className="text-xs flex items-center" style={{color:'#64748b'}}>LocalStorage tommycar_reviews_*</span>
      </div>
      <Table rowKey={r=>r.carId+'-'+r.review.id} dataSource={filtered} pagination={{pageSize:10}} scroll={{x:1000}} columns={[
        { title:'Xe', render:(_:unknown,r:any)=><Link to={`/cars/${r.carId}`}>{carName(r.carId)}</Link>, width:260, ellipsis:true },
        { title:'User', render:(_:unknown,r:any)=> <span>{r.review.user} <span className="text-xs" style={{color:'#94a3b8'}}>({r.review.userId||'-'})</span></span>, width:160 },
        { title:'Sao', render:(_:unknown,r:any)=><Rate disabled value={r.review.rating} style={{fontSize:12}}/>, width:120 },
        { title:'Nội dung', dataIndex:['review','comment'], ellipsis:true },
        { title:'Ngày', render:(_:unknown,r:any)=> formatDate(r.review.createdAt), width:110 },
        { title:'Hành động', width:100, render:(_:unknown,r:any)=>
          <Popconfirm title="Xóa đánh giá này?" onConfirm={()=>{
            deleteReview(r.carId, r.review.id);
            toast.success('Đã xóa');
            setRefresh(x=>x+1);
          }}><Button size="small" danger>Xóa</Button></Popconfirm>
        },
      ]}/>
    </Card>
  );
}
