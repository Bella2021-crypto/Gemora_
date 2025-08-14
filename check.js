import { verify, COOKIE_NAME } from '@/lib/jwt';
export default async function handler(req,res){
  const cookies = req.headers.cookie || '';
  const token = Object.fromEntries(cookies.split('; ').map(v => v.split('='))) [COOKIE_NAME];
  const payload = token ? verify(token) : null;
  if(!payload || payload.role!=='ADMIN') return res.status(401).end();
  res.json({ ok:true, role:'ADMIN' });
}
