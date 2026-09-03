import { useState } from 'react';
import { Avatar, Button, Card, Input, Rate } from 'antd';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export interface Review { id:string; user:string; userId?:string; avatar?:string; rating:number; comment:string; createdAt:string; }

const KEY = (carId:string)=> `tommycar_reviews_${carId}`;

export function getReviews(carId:string): Review[]{
  try{
    const raw=localStorage.getItem(KEY(carId));
    if(raw) return JSON.parse(raw);
  }catch{}
  // mock default
  return [
    { id:'r1', user:'Minh Anh', userId:'u_demo1', rating:5, comment:'Xe đúng mô tả, salon hỗ trợ nhiệt tình, thủ tục nhanh.', createdAt: new Date(Date.now()-86400000*2).toISOString() },
    { id:'r2', user:'Thu Hà', userId:'u_demo2', rating:4, comment:'Giá hợp lý, xe chạy êm, sẽ giới thiệu bạn bè.', createdAt: new Date(Date.now()-86400000*5).toISOString() },
  ];
}
function saveReviews(carId:string, list:Review[]){ localStorage.setItem(KEY(carId), JSON.stringify(list)); }
export function getAllReviews(): {carId:string; review:Review}[]{
  const res: {carId:string; review:Review}[] = [];
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k && k.startsWith('tommycar_reviews_')){
        const carId=k.replace('tommycar_reviews_','');
        const list: Review[] = JSON.parse(localStorage.getItem(k) || '[]');
        list.forEach(r=> res.push({carId, review:r}));
      }
    }
  }catch{}
  if(res.length===0){
    // fallback from default mocks if no storage yet
    ['1','2'].forEach(carId=>{
      getReviews(carId).forEach(r=> res.push({carId, review:r}));
    });
  }
  return res;
}
export function deleteReview(carId:string, reviewId:string){
  const list=getReviews(carId);
  saveReviews(carId, list.filter(r=>r.id!==reviewId));
}

export default function Reviews({ carId }:{ carId:string }){
  const user=useAuthStore(s=>s.user);
  const [list,setList]=useState<Review[]>(()=>getReviews(carId));
  const [rating,setRating]=useState(5);
  const [comment,setComment]=useState('');
  const avg = list.length ? (list.reduce((s,r)=>s+r.rating,0)/list.length).toFixed(1) : '0';

  const submit=()=>{
    if(!user){ toast.error('Đăng nhập để đánh giá'); return; }
    if(!comment.trim() || comment.trim().length<10){ toast.error('Viết ít nhất 10 ký tự'); return; }
    const r: Review = { id:`r-${Date.now()}`, user:user.fullName, userId:user.id, avatar:user.avatar, rating, comment:comment.trim(), createdAt: new Date().toISOString() };
    const next=[r,...list];
    setList(next); saveReviews(carId,next); setComment(''); toast.success('Đã gửi đánh giá');
  };
  const remove=(reviewId:string)=>{
    const next=list.filter(r=>r.id!==reviewId);
    setList(next); saveReviews(carId,next); toast.success('Đã xóa đánh giá');
  };
  const edit=(reviewId:string)=>{
    const r=list.find(x=>x.id===reviewId);
    if(!r) return;
    const nv = window.prompt('Sửa đánh giá:', r.comment);
    if(nv===null) return;
    if(nv.trim().length<10){ toast.error('Ít nhất 10 ký tự'); return; }
    const next=list.map(x=> x.id===reviewId ? {...x, comment:nv.trim()} : x);
    setList(next); saveReviews(carId,next); toast.success('Đã cập nhật');
  };

  return (
    <Card title={<span className="font-bold font-display" style={{color:'#0b1220'}}>Đánh giá <span className="font-normal text-sm" style={{color:'#64748b'}}>({list.length}) • {avg}/5</span></span>} style={{borderRadius:16}}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-extrabold" style={{color:'#0b1220'}}>{avg}</div>
        <Rate disabled value={Number(avg)} allowHalf style={{fontSize:16}}/>
        <span className="text-xs" style={{color:'#64748b'}}>{list.length} đánh giá</span>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-auto nice-scroll pr-1">
        {list.map(r=>{
          const canManage = user && (r.userId===user.id || user.role==='Admin');
          return (
          <div key={r.id} className="p-3 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
            <div className="flex gap-2 items-center">
              <Avatar size={28} src={r.avatar}>{r.user[0]}</Avatar>
              <div className="font-semibold text-sm">{r.user}</div>
              <Rate disabled value={r.rating} style={{fontSize:12, marginLeft:8}}/>
              <span className="text-xs ml-auto" style={{color:'#94a3b8'}}>{formatDate(r.createdAt)}</span>
            </div>
            <div className="text-sm mt-2" style={{color:'#334155'}}>{r.comment}</div>
            {canManage && (
              <div className="flex gap-2 mt-2">
                <button onClick={()=>edit(r.id)} className="text-xs px-2 py-1 rounded" style={{border:'1px solid #e2e8f0', background:'#fff'}}>Sửa</button>
                <button onClick={()=>{ if(confirm('Xóa đánh giá này?')) remove(r.id); }} className="text-xs px-2 py-1 rounded" style={{border:'1px solid #fecaca', background:'#fff', color:'#ef4444'}}>Xóa</button>
              </div>
            )}
          </div>
        )})}
      </div>

      <div className="mt-4 p-3 rounded-xl" style={{background:'#fff', border:'1px solid #e2e8f0'}}>
        <div className="text-xs font-bold mb-2" style={{color:'#0b1220'}}>Viết đánh giá</div>
        <Rate value={rating} onChange={setRating}/>
        <Input.TextArea className="mt-2" rows={3} placeholder="Chia sẻ trải nghiệm..." value={comment} onChange={e=>setComment(e.target.value)} maxLength={500} showCount/>
        <Button type="primary" className="mt-2" style={{background:'#0284c7', borderColor:'#0284c7', borderRadius:10}} onClick={submit}>Gửi đánh giá</Button>
      </div>
    </Card>
  );
}
