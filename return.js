import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PaystackReturn(){
  const router = useRouter(); const { reference } = router.query; const [status,setStatus]=useState('Verifying payment...');
  useEffect(()=>{ if(!reference) return; (async()=>{ const res=await fetch('/api/paystack/verify?reference='+reference); const data=await res.json(); if(res.ok) setStatus('Payment verified ✅ — Thank you!'); else setStatus('Verification failed: '+(data.error||'Unknown error')); })(); },[reference]);
  return <Layout><div className="card"><h3>{status}</h3></div></Layout>;
}
