import { create } from 'zustand';

import { CategoryItem } from '@/types';
import { api } from '@/services/api';

const _swapCategories = (categories: CategoryItem[], categoryId: number, destinationId: number) => {
  const newCategories = [...categories];
  newCategories.splice(categoryId, 1);
  newCategories.splice(destinationId, 0, categories[categoryId]);

  return newCategories;
};

const saveCategoriesToLocalStorage = (categories: CategoryItem[]) => {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch {
    // Ignore storage errors
  }
};

const loadInitialCategories = (): CategoryItem[] => {
  try {
    const raw = localStorage.getItem('categories');
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
};

export interface CategoriesStoreState {
  categories: CategoryItem[];
  editingCategory: {
    id: string;
    tempName: string;
  };
  error: string;
  loading: boolean;

  addingTempCategory: boolean;
  setAddingTempCategory: (adding: boolean) => void;
  addCategory: (category: CategoryItem) => void;
  importCategories: (categories: CategoryItem[]) => void;
  updateCategory: (category: CategoryItem) => void;
  deleteCategory: (categoryId: string) => void;
  categoryDragEnter: (category: CategoryItem) => void;
  categoryDragLeave: (category: CategoryItem) => void;
  swapCategories: (payload: { categoryId: number; destinationId: number }) => void;
  setCategoryEdit: (payload: { id: string; tempName: string }) => void;
  loadCategories: () => void;
  syncCategoriesWithD1: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesStoreState>((set, get) => ({
  categories: loadInitialCategories(),
  editingCategory: {
    id: '',
    tempName: '',
  },
  error: '',
  loading: false,
  addingTempCategory: false,

  setAddingTempCategory: (adding) => set({ addingTempCategory: adding }),

  addCategory: (category) => {
    set((state) => {
      const updated = [...state.categories, category];
      saveCategoriesToLocalStorage(updated);
      api.saveCategory(category);
      return { categories: updated };
    });
  },

  importCategories: (categories) => {
    set((state) => {
      const categoryNames = new Map<string, string>();
      state.categories.forEach(({ name }) => categoryNames.set(name, name));
      const toAdd = categories.filter(({ name }) => !categoryNames.has(name));
      const updated = [...state.categories, ...toAdd];
      saveCategoriesToLocalStorage(updated);
      if (toAdd.length > 0) api.saveCategories(toAdd);
      return { categories: updated };
    });
  },

  updateCategory: (category) => {
    set((state) => {
      const updated = state.categories.map((c) => (c.id === category.id ? { ...c, name: category.name } : c));
      saveCategoriesToLocalStorage(updated);
      api.saveCategory(category);
      return { categories: updated };
    });
  },

  deleteCategory: (categoryId) => {
    set((state) => {
      const updated = state.categories.filter((category) => category.id !== categoryId);
      saveCategoriesToLocalStorage(updated);
      api.deleteCategory(categoryId);
      return { categories: updated };
    });
  },

  categoryDragEnter: (category) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? { ...c, draggedOver: true } : c)),
    }));
  },

  categoryDragLeave: (category) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? { ...c, draggedOver: false } : c)),
    }));
  },

  swapCategories: ({ categoryId, destinationId }) => {
    set((state) => {
      const updated = _swapCategories(state.categories, categoryId, destinationId);
      saveCategoriesToLocalStorage(updated);
      api.saveCategories(updated);
      return { categories: updated };
    });
  },

  setCategoryEdit: ({ id, tempName }) => {
    set({
      editingCategory: { id, tempName },
    });
  },

  loadCategories: () => {
    set({
      categories: loadInitialCategories(),
      loading: false,
    });
  },

  syncCategoriesWithD1: async () => {
    try {
      const d1Categories = await api.fetchCategories();
      if (!d1Categories) return;

      const currentCats = get().categories;
      if (d1Categories.length === 0) {
        if (currentCats.length > 0) {
          await api.saveCategories(currentCats);
        }
      } else {
        saveCategoriesToLocalStorage(d1Categories);
        set({ categories: d1Categories });
      }
    } catch (err) {
      console.warn('Could not sync categories with D1:', err);
    }
  },
}));
