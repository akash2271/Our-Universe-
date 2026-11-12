import jwt from 'jsonwebtoken';
import { findUserById } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'divya-celestial-universe-super-secret-key-2026';
const TOKEN_COOKIE = 'divya_auth_token';

// Rate Limiter tracking failed login attempts
const loginAttempts = new Map();

export function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;

  if (now > record.resetTime) {
    loginAttempts.delete(ip);
    return true;
  }

  if (record.count >= 8) {
    return false; // locked out for 5 minutes
  }

  return true;
}

export function recordFailedLogin(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetTime: now + 5 * 60 * 1000 };
  record.count += 1;
  loginAttempts.set(ip, record);
}

export function clearRateLimit(ip) {
  loginAttempts.delete(ip);
}

export function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req, res, next) {
  const token = req.cookies?.[TOKEN_COOKIE] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

// Both partners have equal access to add, edit, modify, and attach photos (no admin concept)
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

export { TOKEN_COOKIE };
