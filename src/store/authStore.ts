import { create } from 'zustand';
import { api } from '@/services/api';

export interface AuthStoreState {
  isConfigured: boolean | null; // null: checking, true: password protected, false: public
  isLocked: boolean;
  loading: boolean;
  error: string;

  checkAuth: () => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isConfigured: null,
  isLocked: false,
  loading: false,
  error: '',

  checkAuth: async () => {
    try {
      const required = await api.checkAuthRequired();
      if (!required) {
        set({ isConfigured: false, isLocked: false });
        return;
      }

      set({ isConfigured: true });

      const savedPass = sessionStorage.getItem('takenote_password');
      if (savedPass) {
        const ok = await api.verifyAuth(savedPass);
        if (ok) {
          set({ isLocked: false });
          return;
        } else {
          sessionStorage.removeItem('takenote_password');
        }
      }

      set({ isLocked: true });
    } catch {
      set({ isConfigured: false, isLocked: false });
    }
  },

  unlock: async (password: string) => {
    set({ loading: true, error: '' });
    try {
      const ok = await api.verifyAuth(password);
      if (ok) {
        sessionStorage.setItem('takenote_password', password);
        set({ isLocked: false, loading: false, error: '' });
        return true;
      } else {
        set({ loading: false, error: 'Incorrect password' });
        return false;
      }
    } catch {
      set({ loading: false, error: 'Failed to verify password' });
      return false;
    }
  },

  lock: () => {
    try {
      sessionStorage.removeItem('takenote_password');
    } catch {
      // ignore
    }
    set({ isLocked: true, error: '' });
  },

  clearError: () => set({ error: '' }),
}));

