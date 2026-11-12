import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory cache synced with disk
let dbData = {
  users: [],
  memories: [],
  categories: [
    { id: 'special-day', label: 'Special Days', icon: 'Heart' },
    { id: 'birthday', label: 'Birthdays', icon: 'Cake' },
    { id: 'travel', label: 'Travel & Trips', icon: 'Plane' },
    { id: 'surprise', label: 'Surprises', icon: 'Gift' },
    { id: 'everyday', label: 'Everyday Moments', icon: 'Sun' },
    { id: 'upcoming', label: 'Upcoming Plans', icon: 'Sparkles' },
  ],
};

function saveDb() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(dbData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export async function initDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(raw);
    } catch (err) {
      console.warn('Could not read existing database.json, initializing fresh', err);
    }
  }

  // Ensure default couple users exist (No admin concept - equal partners)
  const commonExists = dbData.users.some((u) => u.username === 'ouruniverse');
  if (!commonExists) {
    const commonHash = await bcrypt.hash('divya2026', 10);
    dbData.users.push({
      id: 'user-common',
      username: 'ouruniverse',
      name: 'Divya & Partner',
      passwordHash: commonHash,
      role: 'partner',
      createdAt: new Date().toISOString(),
    });
  }

  const divyaExists = dbData.users.some((u) => u.username === 'divya');
  if (!divyaExists) {
    const divyaHash = await bcrypt.hash('divya2026', 10);
    dbData.users.push({
      id: 'user-divya',
      username: 'divya',
      name: 'Divya',
      passwordHash: divyaHash,
      role: 'partner',
      createdAt: new Date().toISOString(),
    });
  }

  // Seed initial memories if empty
  if (!dbData.memories || dbData.memories.length === 0) {
    dbData.memories = [
      {
        id: 'mem-1',
        title: 'The Unplanned Sunset Walk',
        date: '2024-04-18',
        time: '18:45',
        category: 'everyday',
        coverPhoto: '',
        photos: [],
        location: 'Riverside Promenade',
        description:
          'We had no plans that evening, but a sudden break in the clouds revealed the most golden, honey-colored sky. We grabbed coffee, walked for miles without checking the time, and laughed until our ribs ached. One of those ordinary evenings that turned into pure poetry.',
        shortNote: 'Proof that the best memories are never scheduled.',
        status: 'past',
        createdAt: '2024-04-18T19:00:00.000Z',
        updatedAt: '2024-04-18T19:00:00.000Z',
      },
      {
        id: 'mem-2',
        title: 'The Great Mountain Getaway',
        date: '2024-10-12',
        time: '09:30',
        category: 'travel',
        coverPhoto: '',
        photos: [],
        location: 'Misty Pines Valley',
        description:
          'Crisp mountain breeze, misty trails, and the scent of pine needles everywhere. Divya conquered the steep trail with a radiant smile, pausing at the summit overlook with eyes wide in wonder.',
        shortNote: '“The mountains were high, but her spirit was higher.”',
        status: 'past',
        createdAt: '2024-10-12T10:00:00.000Z',
        updatedAt: '2024-10-12T10:00:00.000Z',
      },
      {
        id: 'mem-3',
        title: 'Divya’s Birthday Midnight Surprise',
        date: '2025-01-15',
        time: '00:01',
        category: 'birthday',
        coverPhoto: '',
        photos: [],
        location: 'Cozy Living Room',
        description:
          'The clock struck 12:00, fairy lights flickered on, and her favorite cake appeared with flickering candles. Her stunned expression turned into the warmest, most breathtaking grin. A midnight celebration wrapped in pure warmth.',
        shortNote: 'The moment another beautiful chapter began.',
        status: 'past',
        createdAt: '2025-01-15T00:15:00.000Z',
        updatedAt: '2025-01-15T00:15:00.000Z',
      },
      {
        id: 'mem-4',
        title: 'The Secret Starlight Picnic',
        date: '2025-07-22',
        time: '20:15',
        category: 'surprise',
        coverPhoto: '',
        photos: [],
        location: 'Orchard Hill',
        description:
          'A wicker basket filled with sweet pastries, warm tea in a thermos, and cozy fleece blankets laid out under a canopy of August shooting stars. We spent hours spotting constellations and sharing our wildest dreams for the future.',
        shortNote: 'Surrounded by stars, but none shone brighter than her.',
        status: 'past',
        createdAt: '2025-07-22T21:00:00.000Z',
        updatedAt: '2025-07-22T21:00:00.000Z',
      },
      {
        id: 'mem-5',
        title: 'Celebration of Her Milestone Achievement',
        date: '2026-03-05',
        time: '14:00',
        category: 'special-day',
        coverPhoto: '',
        photos: [],
        location: 'Grand Ballroom & Terrace',
        description:
          'Months of quiet hard work, early mornings, and determination culminating in well-deserved applause and recognition. Seeing her stand tall with quiet confidence and pride was an unforgettable sight.',
        shortNote: 'Watch her conquer the world, one milestone at a time.',
        status: 'past',
        createdAt: '2026-03-05T15:00:00.000Z',
        updatedAt: '2026-03-05T15:00:00.000Z',
      },
      {
        id: 'mem-6',
        title: 'Planned Dream Voyage to the Coast',
        date: '2027-04-10',
        time: '10:00',
        category: 'upcoming',
        coverPhoto: '',
        photos: [],
        location: 'Azure Coastline & Lighthouse',
        description:
          'A seaside retreat with morning sea salt breezes, walks along sandy coves, seafood cafes, and watching the sun melt into the ocean. Something beautiful to look forward to!',
        shortNote: 'An ocean of new memories waiting to be made.',
        status: 'upcoming',
        createdAt: '2026-11-12T12:00:00.000Z',
        updatedAt: '2026-11-12T12:00:00.000Z',
      },
    ];
  }

  saveDb();
  console.log('Database initialized successfully with users and timeline memories.');
}

// Memory Operations
export function getAllMemories() {
  const todayStr = new Date().toISOString().split('T')[0];

  // Dynamically ensure status: if memory date is in the future, mark as upcoming; if today or past, mark as past
  return dbData.memories
    .map((m) => {
      const isFuture = m.date > todayStr;
      return {
        ...m,
        status: isFuture ? 'upcoming' : 'past',
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getMemoryById(id) {
  return dbData.memories.find((m) => m.id === id);
}

export function createMemory(data) {
  const todayStr = new Date().toISOString().split('T')[0];
  const isFuture = data.date > todayStr;

  const newMem = {
    id: data.id || `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: data.title || 'Untitled Memory',
    date: data.date,
    time: data.time || '',
    coverPhoto: data.coverPhoto || '',
    photos: Array.isArray(data.photos) ? data.photos : [],
    location: data.location || '',
    description: data.description || '',
    shortNote: data.shortNote || '',
    status: isFuture ? 'upcoming' : 'past',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbData.memories.push(newMem);
  saveDb();
  return newMem;
}

export function updateMemory(id, updates) {
  const index = dbData.memories.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const updatedDate = updates.date || dbData.memories[index].date;
  const isFuture = updatedDate > todayStr;

  dbData.memories[index] = {
    ...dbData.memories[index],
    ...updates,
    status: isFuture ? 'upcoming' : 'past',
    updatedAt: new Date().toISOString(),
  };

  saveDb();
  return dbData.memories[index];
}

export function deleteMemory(id) {
  const index = dbData.memories.findIndex((m) => m.id === id);
  if (index === -1) return false;

  dbData.memories.splice(index, 1);
  saveDb();
  return true;
}

// User Operations
export function findUserByUsername(username) {
  return dbData.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function findUserById(id) {
  const u = dbData.users.find((user) => user.id === id);
  if (!u) return null;
  const { passwordHash, ...safeUser } = u;
  return safeUser;
}
