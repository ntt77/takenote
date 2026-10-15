import { create } from 'zustand';

import { GithubUser } from '@/types';

export interface AuthStoreState {
  loading: boolean;
  currentUser: GithubUser;
  isAuthenticated: boolean;
  error: string;

  // Actions
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  currentUser: { name: 'User' },
  isAuthenticated: true,
  error: '',
  loading: false,

  login: () => {
    set({
      currentUser: { name: 'User' },
      isAuthenticated: true,
      loading: false,
    });
  },

  logout: () => {
    set({
      currentUser: {},
      isAuthenticated: false,
      loading: false,
    });
  },
}));
