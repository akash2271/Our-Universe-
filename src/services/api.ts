import type { AuthUser, TimelineMemory } from '../types';

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
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

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Incorrect username or password.');
  }
  return data.user;
}

export async function logoutApi(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function fetchMemories(): Promise<TimelineMemory[]> {
  const res = await fetch('/api/memories', {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to load memories.');
  }
  const data = await res.json();
  return data.memories || [];
}

export async function createMemoryApi(memoryData: Partial<TimelineMemory>): Promise<TimelineMemory> {
  const res = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(memoryData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create memory.');
  }
  return data.memory;
}

export async function updateMemoryApi(id: string, memoryData: Partial<TimelineMemory>): Promise<TimelineMemory> {
  const res = await fetch(`/api/memories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(memoryData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update memory.');
  }
  return data.memory;
}

export async function deleteMemoryApi(id: string): Promise<void> {
  const res = await fetch(`/api/memories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete memory.');
  }
}

export async function uploadPhotosApi(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const res = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload photos.');
  }
  return data.urls || [];
}

export async function attachPhotosToMemoryApi(memoryId: string, files: File[]): Promise<TimelineMemory> {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const res = await fetch(`/api/memories/${memoryId}/photos`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to attach photos.');
  }
  return data.memory;
}

