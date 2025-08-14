import { ensureReady, query } from '@/lib/db';
import { verify, COOKIE_NAME } from '@/lib/jwt';
export default async function handler(req,res){
  await ensureReady();
  const cookies = req.headers.cookie || '';
  const token = Object.fromEntries(cookies.split('; ').map(v => v.split('='))).gemora_admin;
  const payload = token ? verify(token) : null;
  if(!payload || payload.role!=='ADMIN') return res.status(401).end();
  const r = await query(`SELECT o.id,o.buyer_email,o.status,l.title FROM orders o JOIN listings l ON l.id=o.listing_id WHERE o.status='PENDING' ORDER BY o.id DESC LIMIT 50`);
  res.json(r.rows);
}
