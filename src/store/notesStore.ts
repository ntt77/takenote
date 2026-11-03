import { create } from 'zustand';
import dayjs from 'dayjs';

import { Folder, NotesSortKey } from '@/utils/enums';
import { NoteItem } from '@/types';
import { isDraftNote } from '@/utils/helpers';
import { getNotesSorter } from '@/utils/notesSortStrategies';
import { api } from '@/services/api';

export const scratchpadNote: NoteItem = {
  id: crypto.randomUUID(),
  text: `# Scratchpad

The easiest note to find.`,
  category: '',
  scratchpad: true,
  favorite: false,
  created: dayjs().format(),
  lastUpdated: dayjs().format(),
};

const welcomeMarkdown = `# Welcome to Takenote!

TakeNote is a free, open-source notes app for the web. It is a demo project only, and does not integrate with any database or cloud. Your notes are saved in local storage and will not be permanently persisted, but are available for download.

View the source on [Github](https://github.com/taniarascia/takenote).

## Features

- **Plain text notes** - take notes in an IDE-like environment that makes no assumptions
- **Markdown preview** - view rendered HTML
- **Linked notes** - use \`{{uuid}}\` syntax to link to notes within other notes
- **Syntax highlighting** - light and dark mode available (based on the beautiful [New Moon theme](https://taniarascia.github.io/new-moon/))
- **Keyboard shortcuts** - use the keyboard for all common tasks - creating notes and categories, toggling settings, and other options
- **Drag and drop** - drag a note or multiple notes to categories, favorites, or trash
- **Multi-cursor editing** - supports multiple cursors and other [Codemirror](https://codemirror.net/) options
- **Search notes** - easily search all notes, or notes within a category
- **Prettify notes** - use Prettier on the fly for your Markdown
- **No WYSIWYG** - made for developers, by developers
- **No database** - notes are only stored in the browser's local storage and are available for download and export to you alone
- **No tracking or analytics** - 'nuff said
- **GitHub integration** - self-hosted option is available for auto-syncing to a GitHub repository (not available in the demo)
`;

export const welcomeNote: NoteItem = {
  id: crypto.randomUUID(),
  text: welcomeMarkdown,
  category: '',
  favorite: false,
  created: dayjs().format(),
  lastUpdated: dayjs().format(),
};

export const getNewActiveNoteId = (notes: NoteItem[], oldNoteId: string, activeCategoryId: string, activeFolder: Folder): string => {
  const newActiveNotes = notes
    .filter((note) => !note.scratchpad)
    .filter((note) => (activeFolder !== Folder.TRASH ? !note.trash : note.trash))
    .filter((note) => (activeCategoryId ? note.category === activeCategoryId : true));
  const trashedNoteIndex = newActiveNotes.findIndex((note) => note.id === oldNoteId);

  if (trashedNoteIndex === 0 && newActiveNotes[1]) return newActiveNotes[1].id;
  if (newActiveNotes[trashedNoteIndex - 1]) return newActiveNotes[trashedNoteIndex - 1].id;

  return '';
};

export const getFirstNoteId = (folder: Folder, notes: NoteItem[], categoryId?: string, sortOrderKey?: NotesSortKey): string => {
  const availableNotes = !sortOrderKey ? notes.filter((note) => !note.trash) : notes.filter((note) => !note.trash).sort(getNotesSorter(sortOrderKey));

  const firstNote = {
    [Folder.ALL]: () => availableNotes.find((note) => !note.scratchpad),
    [Folder.CATEGORY]: () => availableNotes.find((note) => note.category === categoryId),
    [Folder.FAVORITES]: () => availableNotes.find((note) => note.favorite),
    [Folder.SCRATCHPAD]: () => availableNotes.find((note) => note.scratchpad),
    [Folder.TRASH]: () => notes.find((note) => note.trash),
  }[folder]();

  return firstNote ? firstNote.id : '';
};

const saveNotesToLocalStorage = (notes: NoteItem[]) => {
  try {
    localStorage.setItem('notes', JSON.stringify(notes));
  } catch {
    // Ignore storage errors
  }
};

const loadInitialNotes = (sortOrderKey?: NotesSortKey) => {
  let notes: NoteItem[];
  try {
    const raw = localStorage.getItem('notes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        notes = parsed.length === 0 || !parsed.find((note: NoteItem) => note.scratchpad) ? [scratchpadNote, ...parsed] : parsed;
      } else {
        notes = [scratchpadNote, welcomeNote];
      }
    } else {
      notes = [scratchpadNote, welcomeNote];
    }
  } catch {
    notes = [scratchpadNote, welcomeNote];
  }

  const activeNoteId = getFirstNoteId(Folder.ALL, notes, undefined, sortOrderKey);
  return {
    notes,
    activeNoteId,
    selectedNotesIds: activeNoteId ? [activeNoteId] : [],
  };
};

export interface NotesStoreState {
  notes: NoteItem[];
  activeFolder: Folder;
  activeCategoryId: string;
  activeNoteId: string;
  selectedNotesIds: string[];
  searchValue: string;
  error: string;
  loading: boolean;
  syncing: boolean;

  // Actions
  addNote: (note: NoteItem) => void;
  importNotes: (notes: NoteItem[]) => void;
  updateNote: (note: NoteItem) => void;
  updateNotes: (payload: { notes: NoteItem[]; activeFolder: Folder; activeCategoryId?: string; sortOrderKey?: NotesSortKey }) => void;
  deleteNotes: (noteIds: string[]) => void;
  addCategoryToNote: (payload: { categoryId: string; noteId: string }) => void;
  removeCategoryFromNotes: (categoryId: string) => void;
  updateActiveNote: (payload: { noteId: string; multiSelect: boolean }) => void;
  updateActiveCategoryId: (categoryId: string) => void;
  swapFolder: (payload: { folder: Folder; sortOrderKey?: NotesSortKey }) => void;
  assignFavoriteToNotes: (noteId: string) => void;
  toggleFavoriteNotes: (noteId: string) => void;
  assignTrashToNotes: (noteId: string) => void;
  toggleTrashNotes: (noteId: string) => void;
  unassignTrashFromNotes: (noteId: string) => void;
  updateSelectedNotes: (payload: { noteId: string; multiSelect: boolean }) => void;
  permanentlyEmptyTrash: () => void;
  pruneNotes: () => void;
  searchNotes: (searchValue: string) => void;
  loadNotes: (sortOrderKey?: NotesSortKey) => void;
  syncNotesWithD1: () => Promise<void>;
}

const initial = loadInitialNotes();

export const useNotesStore = create<NotesStoreState>((set, get) => ({
  notes: initial.notes,
  activeFolder: Folder.ALL,
  activeCategoryId: '',
  activeNoteId: initial.activeNoteId,
  selectedNotesIds: initial.selectedNotesIds,
  searchValue: '',
  error: '',
  loading: false,
  syncing: false,

  addNote: (note) => {
    set((state) => {
      const draftNote = state.notes.find((n) => isDraftNote(n));
      if (!draftNote) {
        const updated = [...state.notes, note];
        saveNotesToLocalStorage(updated);
        api.saveNote(note);
        return { notes: updated };
      }
      return {};
    });
  },

  importNotes: (notes) => {
    set((state) => {
      const toAdd = notes.map((note) => ({
        ...note,
        id: crypto.randomUUID(),
      }));
      const updated = [...state.notes, ...toAdd];
      saveNotesToLocalStorage(updated);
      api.saveNotes(toAdd);
      return { notes: updated };
    });
  },

  updateNote: (note) => {
    set((state) => {
      const targetNote = state.notes.find((n) => n.id === note.id);
      const updatedNote = targetNote ? { ...targetNote, text: note.text, lastUpdated: note.lastUpdated } : note;
      const updated = state.notes.map((n) => (n.id === note.id ? updatedNote : n));
      saveNotesToLocalStorage(updated);
      api.debouncedSaveNote(updatedNote);
      return { notes: updated };
    });
  },

  updateNotes: ({ notes, activeFolder, activeCategoryId, sortOrderKey }) => {
    const activeNoteId = getFirstNoteId(activeFolder, notes, activeCategoryId, sortOrderKey);
    saveNotesToLocalStorage(notes);
    api.saveNotes(notes);
    set({
      notes,
      activeNoteId,
      selectedNotesIds: activeNoteId ? [activeNoteId] : [],
    });
  },

  deleteNotes: (noteIds) => {
    set((state) => {
      const updated = state.notes.filter((note) => !noteIds.includes(note.id));
      const newActiveId = getNewActiveNoteId(updated, state.activeNoteId, state.activeCategoryId, state.activeFolder);
      saveNotesToLocalStorage(updated);
      api.deleteNotes(noteIds);
      return {
        notes: updated,
        activeNoteId: newActiveId,
        selectedNotesIds: newActiveId ? [newActiveId] : [],
      };
    });
  },

  addCategoryToNote: ({ categoryId, noteId }) => {
    set((state) => {
      const isMulti = state.selectedNotesIds.includes(noteId);
      const affectedNotes: NoteItem[] = [];
      const updated = state.notes.map((note) => {
        if (isMulti) {
          if (state.selectedNotesIds.includes(note.id)) {
            const mod = { ...note, category: categoryId };
            affectedNotes.push(mod);
            return mod;
          }
          return note;
        }
        if (note.id === noteId) {
          const mod = { ...note, category: categoryId };
          affectedNotes.push(mod);
          return mod;
        }
        return note;
      });
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return { notes: updated };
    });
  },

  removeCategoryFromNotes: (categoryId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.notes.map((note) => {
        if (note.category === categoryId) {
          const mod = { ...note, category: '' };
          affectedNotes.push(mod);
          return mod;
        }
        return note;
      });
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return { notes: updated };
    });
  },

  updateActiveNote: ({ noteId, multiSelect }) => {
    set((state) => ({
      activeNoteId: multiSelect ? state.notes.filter(({ id }) => state.selectedNotesIds.includes(id)).slice(-1)[0]?.id ?? '' : noteId,
    }));
  },

  updateActiveCategoryId: (categoryId) => {
    set((state) => {
      const activeNoteId = getFirstNoteId(Folder.CATEGORY, state.notes, categoryId);
      const updatedNotes = state.notes.filter((note) => note.text !== '');
      saveNotesToLocalStorage(updatedNotes);
      return {
        activeCategoryId: categoryId,
        activeFolder: Folder.CATEGORY,
        activeNoteId,
        selectedNotesIds: activeNoteId ? [activeNoteId] : [],
        notes: updatedNotes,
      };
    });
  },

  swapFolder: ({ folder, sortOrderKey }) => {
    set((state) => {
      const activeNoteId = getFirstNoteId(folder, state.notes, undefined, sortOrderKey);
      const updatedNotes = state.notes.filter((note) => note.scratchpad || note.text !== '');
      saveNotesToLocalStorage(updatedNotes);
      return {
        activeFolder: folder,
        activeCategoryId: '',
        activeNoteId,
        selectedNotesIds: activeNoteId ? [activeNoteId] : [],
        notes: updatedNotes,
      };
    });
  },

  assignFavoriteToNotes: (noteId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.notes.map((note) => {
        if (state.selectedNotesIds.includes(noteId)) {
          if (state.selectedNotesIds.includes(note.id)) {
            const mod = { ...note, favorite: true };
            affectedNotes.push(mod);
            return mod;
          }
          return note;
        }
        if (note.id === noteId) {
          const mod = { ...note, favorite: true };
          affectedNotes.push(mod);
          return mod;
        }
        return note;
      });
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return { notes: updated };
    });
  },

  toggleFavoriteNotes: (noteId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.selectedNotesIds.includes(noteId)
        ? state.notes.map((note) => {
            if (state.selectedNotesIds.includes(note.id)) {
              const mod = { ...note, favorite: !note.favorite };
              affectedNotes.push(mod);
              return mod;
            }
            return note;
          })
        : state.notes.map((note) => {
            if (note.id === noteId) {
              const mod = { ...note, favorite: !note.favorite };
              affectedNotes.push(mod);
              return mod;
            }
            return note;
          });
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return { notes: updated };
    });
  },

  assignTrashToNotes: (noteId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.notes.map((note) => {
        if (state.selectedNotesIds.includes(noteId)) {
          if (state.selectedNotesIds.includes(note.id)) {
            const mod = { ...note, trash: true };
            affectedNotes.push(mod);
            return mod;
          }
          return note;
        }
        if (note.id === noteId) {
          const mod = { ...note, trash: true };
          affectedNotes.push(mod);
          return mod;
        }
        return note;
      });
      const newActiveId = getNewActiveNoteId(updated, noteId, state.activeCategoryId, state.activeFolder);
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return {
        notes: updated,
        activeNoteId: newActiveId,
        selectedNotesIds: newActiveId ? [newActiveId] : [],
      };
    });
  },

  toggleTrashNotes: (noteId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.selectedNotesIds.includes(noteId)
        ? state.notes.map((note) => {
            if (state.selectedNotesIds.includes(note.id)) {
              const mod = { ...note, trash: !note.trash };
              affectedNotes.push(mod);
              return mod;
            }
            return note;
          })
        : state.notes.map((note) => {
            if (note.id === noteId) {
              const mod = { ...note, trash: !note.trash };
              affectedNotes.push(mod);
              return mod;
            }
            return note;
          });
      const newActiveId = getNewActiveNoteId(updated, noteId, state.activeCategoryId, state.activeFolder);
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return {
        notes: updated,
        activeNoteId: newActiveId,
        selectedNotesIds: newActiveId ? [newActiveId] : [],
      };
    });
  },

  unassignTrashFromNotes: (noteId) => {
    set((state) => {
      const affectedNotes: NoteItem[] = [];
      const updated = state.notes.map((note) => {
        if (state.selectedNotesIds.includes(noteId)) {
          if (state.selectedNotesIds.includes(note.id) && note.trash) {
            const mod = { ...note, trash: false };
            affectedNotes.push(mod);
            return mod;
          }
          return note;
        }
        if (note.id === noteId) {
          const mod = { ...note, trash: false };
          affectedNotes.push(mod);
          return mod;
        }
        return note;
      });
      saveNotesToLocalStorage(updated);
      if (affectedNotes.length > 0) api.saveNotes(affectedNotes);
      return { notes: updated };
    });
  },

  updateSelectedNotes: ({ noteId, multiSelect }) => {
    set((state) => ({
      selectedNotesIds: multiSelect
        ? state.selectedNotesIds.length === 1 && state.selectedNotesIds[0] === noteId
          ? state.selectedNotesIds
          : state.selectedNotesIds.includes(noteId)
          ? state.selectedNotesIds.filter((selectedNoteId) => selectedNoteId !== noteId)
          : [...state.selectedNotesIds, noteId]
        : [noteId],
    }));
  },

  permanentlyEmptyTrash: () => {
    set((state) => {
      const trashedNotes = state.notes.filter((note) => note.trash);
      const updated = state.notes.filter((note) => !note.trash);
      saveNotesToLocalStorage(updated);
      if (trashedNotes.length > 0) {
        api.deleteNotes(trashedNotes.map((n) => n.id));
      }
      return { notes: updated };
    });
  },

  pruneNotes: () => {
    set((state) => {
      const toDelete = state.notes.filter((note) => !note.scratchpad && note.text === '' && !state.selectedNotesIds.includes(note.id));
      const updated = state.notes.filter((note) => note.scratchpad || note.text !== '' || state.selectedNotesIds.includes(note.id));
      saveNotesToLocalStorage(updated);
      if (toDelete.length > 0) {
        api.deleteNotes(toDelete.map((n) => n.id));
      }
      return { notes: updated };
    });
  },

  searchNotes: (searchValue) => {
    set({ searchValue });
  },

  loadNotes: (sortOrderKey) => {
    const loaded = loadInitialNotes(sortOrderKey);
    set({
      notes: loaded.notes,
      activeNoteId: loaded.activeNoteId,
      selectedNotesIds: loaded.selectedNotesIds,
      loading: false,
    });
  },

  syncNotesWithD1: async () => {
    set({ syncing: true });
    try {
      const d1Notes = await api.fetchNotes();
      if (!d1Notes) {
        set({ syncing: false });
        return;
      }

      const currentNotes = get().notes;
      if (d1Notes.length === 0) {
        if (currentNotes.length > 0) {
          await api.saveNotes(currentNotes);
        }
      } else {
        saveNotesToLocalStorage(d1Notes);
        const activeNoteId = getFirstNoteId(get().activeFolder, d1Notes, get().activeCategoryId);
        set({
          notes: d1Notes,
          activeNoteId: activeNoteId || d1Notes[0]?.id || '',
          selectedNotesIds: activeNoteId ? [activeNoteId] : d1Notes[0]?.id ? [d1Notes[0].id] : [],
        });
      }
    } catch (err) {
      console.warn('Could not sync notes with D1:', err);
    } finally {
      set({ syncing: false });
    }
  },
}));
