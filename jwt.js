const jwt = require('jsonwebtoken');
const COOKIE_NAME = 'gemora_admin'; const maxAge = 60*60*24*7;
function sign(payload){ const secret = process.env.JWT_SECRET || 'dev_secret_change_me'; return jwt.sign(payload, secret, { expiresIn:maxAge }); }
function verify(token){ try{ const secret = process.env.JWT_SECRET || 'dev_secret_change_me'; return jwt.verify(token, secret); } catch{ return null; } }
module.exports = { sign, verify, COOKIE_NAME, maxAge };
