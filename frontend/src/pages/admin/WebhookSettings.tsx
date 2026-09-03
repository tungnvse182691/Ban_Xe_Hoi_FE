import { useState } from 'react';
import { Button, Card, Input, Tag, Alert } from 'antd';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const KEY = 'tommycar_discord_webhook';

export function getWebhook(): string {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}

export async function sendDiscordWebhook(title:string, desc:string){
  const url = getWebhook();
  if(!url) return;
  try {
    await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        embeds:[{
          title,
          description: desc,
          color: 0x0284c7,
          timestamp: new Date().toISOString(),
          footer:{ text:'TommyCar • Lịch hẹn' }
        }]
      })
    });
  } catch {}
}

export default function WebhookSettings(){
  const [url,setUrl]=useState(getWebhook());
  const [testing,setTesting]=useState(false);
  const save=()=>{
    if(url && !url.startsWith('https://discord.com/api/webhooks/') && !url.startsWith('https://discordapp.com/api/webhooks/')){
      toast.error('Webhook phải bắt đầu https://discord.com/api/webhooks/...');
      return;
    }
    localStorage.setItem(KEY, url.trim());
    toast.success('Đã lưu webhook');
  };
  const test=async()=>{
    if(!url) { toast.error('Dán webhook trước'); return; }
    setTesting(true);
    try{
      await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: `🔔 Test webhook TommyCar - ${new Date().toLocaleString('vi-VN')}`, embeds:[{ title:'Test OK', description:'Webhook hoạt động', color:0x52c41a }] }) });
      toast.success('Đã gửi test, check Discord');
    } catch{ toast.error('Gửi thất bại, check URL/CORS'); }
    setTesting(false);
  };
  return (
    <Card title={<span>Discord Webhook <Tag color="blue">Admin</Tag></span>}>
      <Helmet><title>Webhook - Admin</title></Helmet>
      <Alert type="info" showIcon message="Dán Webhook URL của kênh Discord (Server Settings -> Integrations -> Webhooks -> New Webhook -> Copy URL). Khi có lịch hẹn mới, hệ thống sẽ push embed vào Discord." className="mb-4"/>
      <div className="flex gap-2">
        <Input placeholder="https://discord.com/api/webhooks/..." value={url} onChange={e=>setUrl(e.target.value)} allowClear/>
        <Button type="primary" onClick={save} style={{background:'#0284c7', borderColor:'#0284c7'}}>Lưu</Button>
        <Button onClick={test} loading={testing}>Test</Button>
      </div>
      {url && <div className="mt-3 text-xs" style={{color:'#64748b'}}>Đã lưu: {url.slice(0,60)}... • Khi buyer đặt lịch ở CarDetail, BE mock sẽ gọi sendDiscordWebhook().</div>}
      <div className="mt-4 p-3 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
        <div className="text-xs font-bold">Hướng dẫn:</div>
        <ol className="text-xs list-decimal ml-4 mt-1" style={{color:'#64748b'}}>
          <li>Mở Discord {'->'} Server của bạn {'->'} Server Settings {'->'} Integrations {'->'} Webhooks</li>
          <li>Create Webhook {'->'} chọn kênh {'->'} Copy Webhook URL</li>
          <li>Dán vào ô trên {'->'} Lưu {'->'} Bấm Test</li>
        </ol>
      </div>
    </Card>
  );
}
