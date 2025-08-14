import { ensureReady, query } from '@/lib/db';
import { verify, COOKIE_NAME } from '@/lib/jwt';
export default async function handler(req,res){
  await ensureReady();
  const cookies = req.headers.cookie || '';
  const token = Object.fromEntries(cookies.split('; ').map(v => v.split('='))).gemora_admin;
  const payload = token ? verify(token) : null;
  if(!payload || payload.role!=='ADMIN') return res.status(401).end();
  const r1 = await query('SELECT COALESCE(SUM(amount_cents),0) AS total FROM orders WHERE status=$1',['PAID']);
  const r2 = await query('SELECT COUNT(*) AS c FROM orders');
  const r3 = await query('SELECT COUNT(*) AS c FROM listings');
  res.json({ total_revenue: parseInt(r1.rows[0].total||0), orders_count: parseInt(r2.rows[0].c||0), listings_count: parseInt(r3.rows[0].c||0) });
}
