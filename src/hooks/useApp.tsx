import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { AppState, AppSettings, MemoryPhoto } from '../types';
import {
  loadState,
  saveState,
  getDefaultState,
  clearAllSpecialDayImages,
  createBlankSpecialDayState,
} from '../store/appStore';

interface AppContextType {
  state: AppState;
  loading: boolean;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updatePhoto: (id: string, updates: Partial<MemoryPhoto>) => void;
  resetState: () => void;
  deleteTodaySpecialDay: (newDetails?: {
    partnerName?: string;
    birthdayDate?: string;
    occasionTitle?: string;
    personalLetter?: string;
  }) => Promise<AppState>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getDefaultState());
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveState(newState), 300);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setState((prev) => {
        const next = { ...prev, settings: { ...prev.settings, ...updates } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updatePhoto = useCallback(
    (id: string, updates: Partial<MemoryPhoto>) => {
      setState((prev) => {
        const next = {
          ...prev,
          photos: prev.photos.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetState = useCallback(() => {
    const def = getDefaultState();
    persist(def);
  }, [persist]);

  const deleteTodaySpecialDay = useCallback(
    async (newDetails?: {
      partnerName?: string;
      birthdayDate?: string;
      occasionTitle?: string;
      personalLetter?: string;
    }) => {
      await clearAllSpecialDayImages();
      const fresh = createBlankSpecialDayState(
        newDetails?.partnerName ?? '',
        newDetails?.birthdayDate ?? '',
        newDetails?.occasionTitle ?? 'Happy Birthday'
      );
      if (newDetails?.personalLetter) {
        fresh.settings.personalLetter = newDetails.personalLetter;
      }
      persist(fresh);
      return fresh;
    },
    [persist]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        loading,
        updateSettings,
        updatePhoto,
        resetState,
        deleteTodaySpecialDay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
