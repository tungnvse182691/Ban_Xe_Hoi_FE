import { useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Table, Tag } from 'antd';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { brandsMock, modelsMock } from '@/mocks/data';

type Brand = typeof brandsMock[number];
const STORAGE_BRANDS = 'tommycar_brands';
const STORAGE_MODELS = 'tommycar_models';

function loadBrands(): Brand[] {
  try { const raw=localStorage.getItem(STORAGE_BRANDS); if(raw) return JSON.parse(raw); } catch {}
  return [...brandsMock];
}
function loadModels(){ try{ const raw=localStorage.getItem(STORAGE_MODELS); if(raw) return JSON.parse(raw);}catch{} return [...modelsMock]; }

export default function AdminBrands(){
  const [brands,setBrands]=useState<Brand[]>(loadBrands());
  const [models,setModels]=useState(loadModels());
  const [openBrand,setOpenBrand]=useState(false);
  const [openModel,setOpenModel]=useState(false);
  const [formBrand]=Form.useForm();
  const [formModel]=Form.useForm();

  const saveBrands=(list: Brand[])=>{ setBrands(list); localStorage.setItem(STORAGE_BRANDS, JSON.stringify(list)); };
  const saveModels=(list: any)=>{ setModels(list); localStorage.setItem(STORAGE_MODELS, JSON.stringify(list)); };

  const addBrand=(v:{name:string;logo:string})=>{
    const b: Brand = { id: Date.now(), name: v.name.trim(), logo: v.logo.trim()||v.name[0].toUpperCase(), slug: v.name.toLowerCase().replace(/\s+/g,'-') };
    saveBrands([b,...brands]); toast.success('Đã thêm hãng'); setOpenBrand(false); formBrand.resetFields();
  };
  const delBrand=(id:number)=>{
    saveBrands(brands.filter(b=>b.id!==id));
    saveModels(models.filter((m:any)=>m.brandId!==id));
    toast.success('Đã xóa hãng + models');
  };
  const addModel=(v:{brandId:number; name:string})=>{
    const m={ id: Date.now(), brandId: Number(v.brandId), name: v.name.trim() };
    saveModels([...models,m]); toast.success('Đã thêm dòng xe'); setOpenModel(false); formModel.resetFields();
  };

  return (
    <div>
      <Helmet><title>Quản lý hãng xe - Admin</title></Helmet>
      <Card title={<span>Quản lý Hãng <Tag color="blue">{brands.length}</Tag></span>} extra={<Button type="primary" onClick={()=>setOpenBrand(true)}>Thêm hãng</Button>}>
        <Table rowKey="id" dataSource={brands} pagination={false} columns={[
          { title:'Logo', dataIndex:'logo', width:80, render:(v:string)=><span className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{background:'#f1f5f9'}}>{v}</span>},
          { title:'Tên hãng', dataIndex:'name'},
          { title:'Slug', dataIndex:'slug'},
          { title:'Hành động', width:100, render:(_:unknown,r:Brand)=><Popconfirm title="Xóa hãng này?" onConfirm={()=>delBrand(r.id)}><Button size="small" danger>Xóa</Button></Popconfirm>},
        ]}/>
      </Card>

      <Card title={<span>Quản lý Dòng xe <Tag color="blue">{models.length}</Tag></span>} extra={<Button type="primary" onClick={()=>setOpenModel(true)}>Thêm dòng</Button>} className="mt-4">
        <Table rowKey="id" dataSource={models} pagination={{pageSize:10}} columns={[
          { title:'Hãng', dataIndex:'brandId', render:(id:number)=> brands.find(b=>b.id===id)?.name || id },
          { title:'Tên dòng', dataIndex:'name'},
          { title:'Hành động', width:100, render:(_:unknown,r:any)=><Popconfirm title="Xóa?" onConfirm={()=>saveModels(models.filter((m:any)=>m.id!==r.id))}><Button size="small" danger>Xóa</Button></Popconfirm>},
        ]}/>
      </Card>

      <Modal title="Thêm hãng xe" open={openBrand} onCancel={()=>setOpenBrand(false)} footer={null}>
        <Form form={formBrand} layout="vertical" onFinish={addBrand}>
          <Form.Item name="name" label="Tên hãng" rules={[{required:true, message:'Nhập tên'}]}><Input placeholder="VinFast"/></Form.Item>
          <Form.Item name="logo" label="Logo (1 ký tự/emoji)" rules={[{required:true, message:'Nhập logo'}]}><Input placeholder="V" maxLength={2}/></Form.Item>
          <Button type="primary" htmlType="submit" block>Thêm</Button>
        </Form>
      </Modal>
      <Modal title="Thêm dòng xe" open={openModel} onCancel={()=>setOpenModel(false)} footer={null}>
        <Form form={formModel} layout="vertical" onFinish={addModel}>
          <Form.Item name="brandId" label="Hãng" rules={[{required:true}]}><select className="w-full border rounded p-2" onChange={e=>formModel.setFieldsValue({brandId:Number(e.target.value)})}><option value="">-- Chọn --</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></Form.Item>
          <Form.Item name="name" label="Tên dòng" rules={[{required:true}]}><Input placeholder="VF 8"/></Form.Item>
          <Button type="primary" htmlType="submit" block>Thêm</Button>
        </Form>
      </Modal>
      <div className="mt-2 text-sm" style={{color:'#64748b'}}>Lưu localStorage {STORAGE_BRANDS} - reload không mất.</div>
    </div>
  );
}
