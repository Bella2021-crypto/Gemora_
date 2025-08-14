import { query } from '@/lib/db';
export const config = { api: { bodyParser: false } };
function readBody(req){ return new Promise((resolve)=>{ let data=''; req.on('data',c=>data+=c); req.on('end',()=>resolve(data)); }); }
export default async function handler(req,res){
  const raw = await readBody(req);
  try{ const evt = JSON.parse(raw); if(evt.event==='charge.success' && evt.data?.reference){ await query('UPDATE orders SET status=$1 WHERE paystack_ref=$2',['PAID',evt.data.reference]); } }catch(e){}
  res.json({received:true});
}
