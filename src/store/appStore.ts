import localforage from 'localforage';
import type { AppState, AppSettings, SpecialCard, MemoryPhoto } from '../types';

const STORE_KEY = 'divya-minimal-birthday-state';

localforage.config({
  name: 'DivyaBirthdayApp',
  storeName: 'app_data',
});

const IMAGE_STORE = localforage.createInstance({
  name: 'DivyaBirthdayApp',
  storeName: 'images',
});

export const defaultSettings: AppSettings = {
  partnerName: 'Divya',
  birthdayDate: '2027-01-15',
  heroPhotoUrl: '',
  personalLetter: `My Dearest Divya,

Today is a celebration of the wonderful human being you are.

Your quiet strength, your kind heart, and the effortless way you bring warmth into any room are qualities that make you truly rare. As you step into this new year of your life, I hope you pursue every dream with complete confidence, knowing you have everything it takes to reach it.

Never forget, Divya:
You are important.
Your dreams matter.
Your happiness matters.
Your existence makes this world a more beautiful place.

Don't ever stop smiling, dreaming or becoming the person you wish to be.

HAPPY BIRTHDAY, DIVYA! ❤️`,
  musicEnabled: true,
  musicUrl: '',
  occasionTitle: 'Happy Birthday',
};

export const defaultSpecialCards: SpecialCard[] = [
  {
    id: 'smile',
    title: 'YOUR SMILE',
    quote: 'Some smiles have the power to make an ordinary day feel extraordinary. Yours is one of them.',
    description: 'A genuine reminder of how much light and positivity you bring to everyone around you.',
    icon: 'Sun',
  },
  {
    id: 'heart',
    title: 'YOUR HEART',
    quote: 'Your kindness, your emotions and the way you care make you an incredibly beautiful person.',
    description: 'You care with honesty and empathy, and that gentleness is your greatest strength.',
    icon: 'Heart',
  },
  {
    id: 'strength',
    title: 'YOUR STRENGTH',
    quote: 'Never underestimate how strong you are. Every little step you take deserves to be celebrated.',
    description: 'You handle challenges with resilience and grace, always continuing forward.',
    icon: 'Shield',
  },
  {
    id: 'dreams',
    title: 'YOUR DREAMS',
    quote: 'You deserve every opportunity, every achievement and every beautiful thing you dream about.',
    description: 'Keep your ambitions high. You have the intellect and drive to reach every milestone.',
    icon: 'Sparkles',
  },
  {
    id: 'existence',
    title: 'YOUR EXISTENCE',
    quote: 'Not because of what you do for others, but simply because of who you are. You matter.',
    description: 'You are completely irreplaceable and inherently valued simply for being you.',
    icon: 'Star',
  },
];

export const defaultPhotos: MemoryPhoto[] = [
  {
    id: 'p1',
    url: '/radiant-life.jpg',
    caption: 'Radiant & full of life',
  },
  {
    id: 'p2',
    url: '/unstoppable-spirit.jpg',
    caption: 'Unstoppable spirit',
  },
  {
    id: 'p3',
    url: '/couple-moments.jpg',
    caption: 'Quiet moments of joy',
  },
];

export async function clearAllSpecialDayImages(): Promise<void> {
  try {
    await IMAGE_STORE.clear();
  } catch (err) {
    console.error('Error clearing images from storage', err);
  }
}

export function createBlankSpecialDayState(
  newName = '',
  newDate = '',
  occasion = 'Happy Birthday'
): AppState {
  const name = newName.trim();
  const date = newDate || new Date().toISOString().split('T')[0];
  const greetingName = name || '[Name]';
  const resolvedOccasion = occasion.trim() || 'Happy Birthday';

  return {
    settings: {
      partnerName: name,
      birthdayDate: date,
      heroPhotoUrl: '',
      occasionTitle: resolvedOccasion,
      personalLetter: `My Dearest ${greetingName},

Today is a celebration of the wonderful human being you are.

Your quiet strength, your kind heart, and the effortless way you bring warmth into any room are qualities that make you truly rare. As you step into this new milestone, I hope you pursue every dream with complete confidence, knowing you have everything it takes to reach it.

Never forget:
You are important.
Your dreams matter.
Your happiness matters.
Your existence makes this world a more beautiful place.

Don't ever stop smiling, dreaming or becoming the person you wish to be.

${resolvedOccasion.toUpperCase()}, ${greetingName.toUpperCase()}! ❤️`,
      musicEnabled: true,
      musicUrl: '',
    },
    specialCards: [...defaultSpecialCards],
    photos: [
      { id: 'p1', url: '/radiant-life.jpg', caption: 'Radiant & full of life' },
      { id: 'p2', url: '/unstoppable-spirit.jpg', caption: 'Unstoppable spirit' },
      { id: 'p3', url: '/couple-moments.jpg', caption: 'Quiet moments of joy' },
    ],
  };
}

export function getDefaultState(): AppState {
  return {
    settings: { ...defaultSettings },
    specialCards: [...defaultSpecialCards],
    photos: [...defaultPhotos],
  };
}

export async function loadState(): Promise<AppState> {
  try {
    const saved = await localforage.getItem<AppState>(STORE_KEY);
    if (!saved) return getDefaultState();
    return {
      settings: { ...defaultSettings, ...saved.settings },
      specialCards: saved.specialCards?.length ? saved.specialCards : defaultSpecialCards,
      photos: saved.photos?.length ? saved.photos : defaultPhotos,
    };
  } catch (err) {
    console.error('Error loading state', err);
    return getDefaultState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await localforage.setItem(STORE_KEY, state);
  } catch (err) {
    console.error('Error saving state', err);
  }
}

export async function saveImage(key: string, fileData: string): Promise<string> {
  try {
    await IMAGE_STORE.setItem(key, fileData);
    return key;
  } catch {
    return fileData;
  }
}

export async function loadImage(key: string): Promise<string | null> {
  try {
    return await IMAGE_STORE.getItem<string>(key);
  } catch {
    return null;
  }
}
