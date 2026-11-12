export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role?: string;
}

export interface TimelineMemory {
  id: string;
  title: string;
  date: string;
  time?: string;
  coverPhoto: string;
  photos: string[];
  description: string;
  shortNote: string;
  location?: string;
  status: 'past' | 'upcoming';
  createdAt: string;
  updatedAt?: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface SpecialCard {
  id: string;
  title: string;
  quote: string;
  description: string;
  icon: string;
}

export interface AppSettings {
  partnerName: string;
  birthdayDate: string;
  heroPhotoUrl: string;
  personalLetter: string;
  musicEnabled: boolean;
  musicUrl: string;
  occasionTitle?: string;
}

export interface AppState {
  settings: AppSettings;
  specialCards: SpecialCard[];
  photos: MemoryPhoto[];
}
