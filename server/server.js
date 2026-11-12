import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';

import {
  initDb,
  getAllMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
  findUserByUsername,
  findUserById,
} from './db.js';

import {
  checkRateLimit,
  recordFailedLogin,
  clearRateLimit,
  signToken,
  authenticate,
  requireAuth,
  TOKEN_COOKIE,
} from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const unique = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP, GIF) are allowed.'));
    }
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Attach user if valid cookie exists
app.use(authenticate);

// Static serve uploaded photos
app.use('/api/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// ─────────────────────────────────────────────
// Common Username & Password Auth Endpoints
// (Shared for both partners - no admin concept)
// ─────────────────────────────────────────────

const ACCEPTED_PASSWORDS = [
  'divya2026',
  'divyaAdmin2026!',
  'celebrate2026!',
];

const ACCEPTED_USERNAMES = [
  'ouruniverse',
  'divya',
  'us',
  'together',
  'love',
  'admin',
];

// Login with Common Username & Password
app.post('/api/auth/login', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const { password, username } = req.body;

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please wait 5 minutes before trying again.',
    });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const trimmedPassword = password.trim();
  const trimmedUsername = (username || '').trim().toLowerCase();
  let authenticatedUser = null;

  // 1. Check against accepted common passwords & usernames
  if (ACCEPTED_PASSWORDS.includes(trimmedPassword)) {
    // If username provided, allow standard common usernames or partner usernames
    const resolvedUsername = trimmedUsername || 'ouruniverse';
    authenticatedUser = {
      id: 'user-common',
      username: resolvedUsername,
      name: 'Divya & Partner',
      role: 'partner', // Equal couple access - no admin concept
    };
  } else if (username) {
    // 2. Fallback check for hashed user in DB
    const dbUser = findUserByUsername(username);
    if (dbUser && dbUser.passwordHash) {
      const match = await bcrypt.compare(trimmedPassword, dbUser.passwordHash);
      if (match) {
        authenticatedUser = {
          id: dbUser.id,
          username: dbUser.username,
          name: dbUser.name,
          role: 'partner', // Equal couple access - no admin concept
        };
      }
    }
  }

  if (!authenticatedUser) {
    recordFailedLogin(ip);
    return res.status(401).json({ error: 'Incorrect username or password. Please try again.' });
  }

  clearRateLimit(ip);
  const token = signToken(authenticatedUser);

  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    user: authenticatedUser,
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Get Current User (Session)
app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  const fullUser = findUserById(req.user.userId);
  return res.json({ user: fullUser || req.user });
});

// ─────────────────────────────────────────────
// Memory Timeline Endpoints (No Categories)
// ─────────────────────────────────────────────

// Get all memories
app.get('/api/memories', (req, res) => {
  const memories = getAllMemories();
  return res.json({ memories });
});

// Get single memory
app.get('/api/memories/:id', (req, res) => {
  const memory = getMemoryById(req.params.id);
  if (!memory) {
    return res.status(404).json({ error: 'Memory not found.' });
  }
  return res.json({ memory });
});

// Create new memory (Authenticated)
app.post('/api/memories', requireAuth, (req, res) => {
  const { title, date, time, coverPhoto, photos, location, description, shortNote } =
    req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required.' });
  }

  const created = createMemory({
    title,
    date,
    time,
    coverPhoto,
    photos,
    location,
    description,
    shortNote,
  });

  return res.status(201).json({ memory: created });
});

// Update memory (Authenticated)
app.put('/api/memories/:id', requireAuth, (req, res) => {
  const updated = updateMemory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Memory not found.' });
  }
  return res.json({ memory: updated });
});

// Delete memory (Authenticated)
app.delete('/api/memories/:id', requireAuth, (req, res) => {
  const success = deleteMemory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Memory not found or could not be deleted.' });
  }
  return res.json({ success: true, message: 'Memory deleted.' });
});

// Multi-photo upload endpoint (Authenticated)
app.post('/api/upload', requireAuth, upload.array('photos', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const urls = req.files.map((file) => `/api/uploads/${file.filename}`);
  return res.json({ urls });
});

// Direct attach photos to existing memory (Authenticated)
app.post('/api/memories/:id/photos', requireAuth, upload.array('photos', 10), (req, res) => {
  const memory = getMemoryById(req.params.id);
  if (!memory) {
    return res.status(404).json({ error: 'Memory not found.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const newUrls = req.files.map((file) => `/api/uploads/${file.filename}`);
  const existingPhotos = Array.isArray(memory.photos) ? memory.photos : [];
  const updatedPhotos = [...existingPhotos, ...newUrls];
  const updatedCover = memory.coverPhoto || newUrls[0];

  const updated = updateMemory(req.params.id, {
    photos: updatedPhotos,
    coverPhoto: updatedCover,
  });

  return res.json({ memory: updated, addedUrls: newUrls });
});

// Initialize DB and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend memory timeline server listening on http://localhost:${PORT}`);
  });
});
