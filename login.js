import { ensureReady, query } from '@/lib/db';
import { sign, COOKIE_NAME, maxAge } from '@/lib/jwt';
import cookie from 'cookie';
export default async function handler(req,res){
  await ensureReady();
  if(req.method!=='POST') return res.status(405).end();
  const { email, password } = req.body || {};
  const r = await query('SELECT id,email,role FROM users WHERE email=$1 AND password=$2',[email,password]);
  if(r.rows.length===0 || r.rows[0].role!=='ADMIN'){ return res.status(401).json({error:'Invalid credentials'}); }
  const token = sign({ uid:r.rows[0].id, role:'ADMIN' });
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, { httpOnly:true, sameSite:'lax', path:'/', maxAge }));
  res.json({ ok:true });
}
