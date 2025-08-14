import Layout from '@/components/Layout';
import { useState } from 'react';

export default function Sell(){
  const [title,setTitle]=useState(''); const [description,setDescription]=useState('');
  const [price,setPrice]=useState(''); const [imageUrl,setImageUrl]=useState('');
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState('');

  async function handleUpload(e){
    const file = e.target.files?.[0]; if(!file) return;
    setLoading(true); setMsg('Getting signature...');
    const signRes = await fetch('/api/cloudinary/sign').then(r=>r.json());
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', signRes.apiKey);
    form.append('timestamp', signRes.timestamp);
    form.append('signature', signRes.signature);
    const url = `https://api.cloudinary.com/v1_1/${signRes.cloudName}/image/upload`;
    const up = await fetch(url, { method:'POST', body:form }).then(r=>r.json());
    setImageUrl(up.secure_url); setMsg('Uploaded!'); setLoading(false);
  }

  async function submitListing(e){
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/listings', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, description, price_cents: Math.round(Number(price)*100), image_url: imageUrl })
    });
    const data = await res.json();
    if(res.ok){ setMsg('Listing created!'); setTitle(''); setDescription(''); setPrice(''); setImageUrl(''); }
    else setMsg(data.error||'Error creating listing'); setLoading(false);
  }

  return (<Layout>
    <h2>Sell an item</h2>
    <form onSubmit={submitListing} className="card" style={{maxWidth:640}}>
      <label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} required />
      <label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} required rows={4} />
      <label>Price (NGN)</label><input value={price} onChange={e=>setPrice(e.target.value)} type="number" min="0" step="0.01" required />
      <label>Photo</label><input type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && <img src={imageUrl} alt="preview" style={{width:200, marginTop:10, borderRadius:8}}/>}
      <div style={{marginTop:16, display:'flex', gap:12}}>
        <button className="btn" disabled={loading}>Create listing</button><span>{msg}</span>
      </div>
    </form>
  </Layout>);
}
