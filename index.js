import { ensureReady, query } from '@/lib/db';
export default async function handler(req,res){
  await ensureReady();
  if(req.method==='GET'){ const r = await query('SELECT id,title,description,price_cents,image_url,status FROM listings ORDER BY id DESC LIMIT 100'); return res.json(r.rows); }
  if(req.method==='POST'){
    const { title, description, price_cents, image_url } = req.body || {};
    if(!title || !description || !price_cents) return res.status(400).json({error:'Missing fields'});
    const s = await query('SELECT id FROM users WHERE email=$1',['seller@gemora.test']); const sellerId = s.rows[0]?.id || null;
    const r = await query('INSERT INTO listings (title,description,price_cents,image_url,seller_id,status) VALUES ($1,$2,$3,$4,$5,'ACTIVE') RETURNING id',[title,description,price_cents,image_url,sellerId]);
    return res.json({ id: r.rows[0].id });
  }
  res.status(405).end();
}
