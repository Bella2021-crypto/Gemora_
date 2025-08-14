import { query } from '@/lib/db';
export default async function handler(req,res){
  const { reference } = req.query;
  if(!reference) return res.status(400).json({error:'Missing reference'});
  const r = await fetch('https://api.paystack.co/transaction/verify/'+reference,{ headers:{ 'Authorization':'Bearer '+process.env.PAYSTACK_SECRET_KEY }});
  const data = await r.json();
  if(!data.status) return res.status(400).json({error:data.message||'Verification failed'});
  if(data.data.status==='success'){ await query('UPDATE orders SET status=$1 WHERE paystack_ref=$2',['PAID',reference]); return res.json({ok:true}); }
  return res.status(400).json({error:'Payment not successful'});
}
