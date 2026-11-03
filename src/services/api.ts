import { CategoryItem, NoteItem } from '@/types';

const API_BASE = '/api';

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const api = {
  async fetchNotes(): Promise<NoteItem[] | null> {
    try {
      const res = await fetch(`${API_BASE}/notes`);
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: noteIds }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async fetchCategories(): Promise<CategoryItem[] | null> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

