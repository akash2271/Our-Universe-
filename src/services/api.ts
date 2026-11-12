import localforage from 'localforage';
import type { AuthUser, TimelineMemory } from '../types';

// Client-side storage instance for private moments on static hosts like Netlify
const MEMORIES_STORE = localforage.createInstance({
  name: 'DivyaBirthdayApp',
  storeName: 'private_memories',
});

const AUTH_STORAGE_KEY = 'our_universe_auth_user';

const ACCEPTED_PASSWORDS = [
  'divya2026',
  'divyaAdmin2026!',
  'celebrate2026!',
];

import defaultMemories from './defaultMemories.json';

// Initial seeded memories so Netlify users immediately see the full scrapbook
export const INITIAL_SEEDED_MEMORIES: TimelineMemory[] = defaultMemories as TimelineMemory[];

// Helper to safely execute fetch without throwing unexpected end of JSON input
async function safeFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
    return { ok: false, status: res.status, data: null };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

// ─────────────────────────────────────────────
// Auth Functions (Works both with Backend & on Netlify)
// ─────────────────────────────────────────────

export async function fetchMe(): Promise<AuthUser | null> {
  // 1. Try backend server if available
  const result = await safeFetchJson<{ user: AuthUser | null }>('/api/auth/me', {
    credentials: 'include',
  });
  if (result.ok && result.data?.user) {
    return result.data.user;
  }

  // 2. Fallback to client session (Netlify / offline)
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AuthUser;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function loginApi(usernameOrPassword: string, passwordOptional?: string): Promise<AuthUser> {
  let username = 'ouruniverse';
  let password = '';

  if (passwordOptional !== undefined) {
    username = usernameOrPassword;
    password = passwordOptional;
  } else {
    password = usernameOrPassword;
  }

  const trimmedUsername = (username || '').trim();
  const trimmedPassword = (password || '').trim();

  // 1. Try backend server if available
  const result = await safeFetchJson<{ user?: AuthUser; error?: string }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
  });

  if (result.ok && result.data?.user) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.data.user));
    } catch {
      // ignore
    }
    return result.data.user;
  }

  // If backend responded with a deliberate 401 error, honor it
  if (result.status === 401 && result.data?.error) {
    throw new Error(result.data.error);
  }

  // 2. Client-side authentication fallback (for Netlify / static deployment)
  if (ACCEPTED_PASSWORDS.includes(trimmedPassword)) {
    const user: AuthUser = {
      id: 'user-common',
      username: trimmedUsername || 'ouruniverse',
      name: 'Divya & Partner',
      role: 'partner',
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    return user;
  }

  throw new Error('Incorrect username or password. Please try again.');
}

export async function logoutApi(): Promise<void> {
  // Try backend logout
  await safeFetchJson('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  // Clear client session
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────
// Memories Functions (Works both with Backend & on Netlify)
// ─────────────────────────────────────────────

export async function fetchMemories(): Promise<TimelineMemory[]> {
  // 1. Try backend server if available
  const result = await safeFetchJson<{ memories: TimelineMemory[] }>('/api/memories', {
    credentials: 'include',
  });
  if (result.ok && Array.isArray(result.data?.memories)) {
    return result.data.memories;
  }

  // 2. Client-side storage fallback (Netlify / static)
  try {
    const stored = await MEMORIES_STORE.getItem<TimelineMemory[]>('memories_list');
    if (stored && Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    // Seed initial memories if first time on Netlify
    await MEMORIES_STORE.setItem('memories_list', INITIAL_SEEDED_MEMORIES);
    return INITIAL_SEEDED_MEMORIES;
  } catch {
    return INITIAL_SEEDED_MEMORIES;
  }
}

export async function createMemoryApi(memoryData: Partial<TimelineMemory>): Promise<TimelineMemory> {
  // 1. Try backend server if available
  const result = await safeFetchJson<{ memory: TimelineMemory; error?: string }>('/api/memories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(memoryData),
  });

  if (result.ok && result.data?.memory) {
    return result.data.memory;
  }

  // 2. Client-side storage fallback (Netlify / static)
  const current = await fetchMemories();
  const newMemory: TimelineMemory = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: memoryData.title || 'Special Memory',
    date: memoryData.date || new Date().toISOString().split('T')[0],
    time: memoryData.time,
    coverPhoto: memoryData.coverPhoto || memoryData.photos?.[0] || '',
    photos: memoryData.photos || [],
    location: memoryData.location,
    description: memoryData.description || '',
    shortNote: memoryData.shortNote || '',
    status: memoryData.status || 'past',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...current, newMemory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  await MEMORIES_STORE.setItem('memories_list', updated);
  return newMemory;
}

export async function updateMemoryApi(id: string, memoryData: Partial<TimelineMemory>): Promise<TimelineMemory> {
  // 1. Try backend server if available
  const result = await safeFetchJson<{ memory: TimelineMemory; error?: string }>(`/api/memories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(memoryData),
  });

  if (result.ok && result.data?.memory) {
    return result.data.memory;
  }

  // 2. Client-side storage fallback (Netlify / static)
  const current = await fetchMemories();
  let updatedMemory: TimelineMemory | null = null;
  const updatedList = current.map((m) => {
    if (m.id === id) {
      updatedMemory = {
        ...m,
        ...memoryData,
        updatedAt: new Date().toISOString(),
      };
      return updatedMemory;
    }
    return m;
  });

  if (!updatedMemory) {
    throw new Error('Memory not found.');
  }

  await MEMORIES_STORE.setItem('memories_list', updatedList);
  return updatedMemory;
}

export async function deleteMemoryApi(id: string): Promise<void> {
  // 1. Try backend server if available
  const result = await safeFetchJson<{ success: boolean; error?: string }>(`/api/memories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (result.ok) {
    return;
  }

  // 2. Client-side storage fallback (Netlify / static)
  const current = await fetchMemories();
  const filtered = current.filter((m) => m.id !== id);
  await MEMORIES_STORE.setItem('memories_list', filtered);
}

// Helper to convert files to Base64 URLs for client-side storage
async function filesToBase64(files: File[]): Promise<string[]> {
  const promises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });
  return Promise.all(promises);
}

export async function uploadPhotosApi(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];

  // 1. Try backend server if available
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const result = await safeFetchJson<{ urls: string[]; error?: string }>('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (result.ok && Array.isArray(result.data?.urls)) {
    return result.data.urls;
  }

  // 2. Client-side storage fallback (Netlify / static): convert to Base64
  return filesToBase64(files);
}

export async function attachPhotosToMemoryApi(memoryId: string, files: File[]): Promise<TimelineMemory> {
  if (!files || files.length === 0) {
    const list = await fetchMemories();
    const mem = list.find((m) => m.id === memoryId);
    if (!mem) throw new Error('Memory not found.');
    return mem;
  }

  // 1. Try backend server if available
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const result = await safeFetchJson<{ memory: TimelineMemory; error?: string }>(
    `/api/memories/${memoryId}/photos`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }
  );

  if (result.ok && result.data?.memory) {
    return result.data.memory;
  }

  // 2. Client-side storage fallback (Netlify / static)
  const base64Photos = await filesToBase64(files);
  const current = await fetchMemories();
  let updatedMemory: TimelineMemory | null = null;

  const updatedList = current.map((m) => {
    if (m.id === memoryId) {
      const existing = Array.isArray(m.photos) ? m.photos : [];
      const newPhotos = [...existing, ...base64Photos];
      updatedMemory = {
        ...m,
        photos: newPhotos,
        coverPhoto: m.coverPhoto || newPhotos[0] || '',
        updatedAt: new Date().toISOString(),
      };
      return updatedMemory;
    }
    return m;
  });

  if (!updatedMemory) {
    throw new Error('Memory not found.');
  }

  await MEMORIES_STORE.setItem('memories_list', updatedList);
  return updatedMemory;
}
