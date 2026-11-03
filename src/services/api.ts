import { CategoryItem, NoteItem } from '@/types';

const API_BASE = '/api';

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

const getHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  try {
    const pass = sessionStorage.getItem('takenote_password');
    if (pass) {
      headers['x-app-password'] = pass;
    }
  } catch {
    // sessionStorage not available
  }
  return headers;
};

export const api = {
  async checkAuthRequired(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth`);
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.required);
    } catch {
      return false;
    }
  },

  async verifyAuth(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async fetchNotes(): Promise<NoteItem[] | null> {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data.notes) ? data.notes : null;
    } catch {
      return null;
    }
  },

  async saveNotes(notes: NoteItem[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async saveNote(note: NoteItem): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(note),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  debouncedSaveNote(note: NoteItem, delayMs = 600) {
    const existing = debounceTimers.get(note.id);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      debounceTimers.delete(note.id);
      api.saveNote(note);
    }, delayMs);

    debounceTimers.set(note.id, timer);
  },

  async deleteNotes(noteIds: string[]): Promise<boolean> {
    if (noteIds.length === 0) return true;
    try {
      // Clear any pending debounced saves for deleted notes
      noteIds.forEach((id) => {
        const timer = debounceTimers.get(id);
        if (timer) {
          clearTimeout(timer);
          debounceTimers.delete(id);
        }
      });

      const res = await fetch(`${API_BASE}/notes`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ ids: noteIds }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async fetchCategories(): Promise<CategoryItem[] | null> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data.categories) ? data.categories : null;
    } catch {
      return null;
    }
  },

  async saveCategories(categories: CategoryItem[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ categories }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async saveCategory(category: CategoryItem): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(category),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/categories?id=${encodeURIComponent(categoryId)}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
