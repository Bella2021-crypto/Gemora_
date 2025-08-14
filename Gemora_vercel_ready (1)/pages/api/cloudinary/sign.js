import crypto from 'crypto';
export default async function handler(req,res){
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now()/1000);
  const toSign = `timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
  res.json({ cloudName, apiKey, timestamp, signature });
}
