import { ensureReady, query } from '@/lib/db';
export default async function handler(req,res){
  await ensureReady();
  if(req.method!=='POST') return res.status(405).end();
  const { listing_id, buyer_email } = req.body || {};
  if(!listing_id || !buyer_email) return res.status(400).json({error:'Missing fields'});
  const lr = await query('SELECT id,price_cents,title FROM listings WHERE id=$1',[listing_id]);
  if(lr.rows.length===0) return res.status(404).json({error:'Listing not found'});
  const listing = lr.rows[0];
  const initBody = {
    email: buyer_email,
    amount: listing.price_cents, // NGN kobo
    metadata: { listing_id: listing.id, title: listing.title },
    callback_url: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/paystack/return'
  };
  const r = await fetch('https://api.paystack.co/transaction/initialize',{
    method:'POST',
    headers:{ 'Authorization':'Bearer '+process.env.PAYSTACK_SECRET_KEY, 'Content-Type':'application/json' },
    body: JSON.stringify(initBody)
  });
  const data = await r.json();
  if(!data.status) return res.status(400).json({error:data.message||'Paystack init failed'});
  await query('INSERT INTO orders (listing_id,buyer_email,amount_cents,paystack_ref,status) VALUES ($1,$2,$3,$4,$5)',[listing.id,buyer_email,listing.price_cents,data.data.reference,'PENDING']);
  res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
}
