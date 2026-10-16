import { create } from 'zustand';

import { NotesSortKey, DirectionText } from '@/utils/enums';

const defaultSettings = {
  previewMarkdown: false,
  sidebarVisible: true,
  notesSortKey: NotesSortKey.LAST_UPDATED,
  codeMirrorOptions: {
    mode: 'gfm',
    theme: 'bbedit',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
    keyMap: 'default',
    dragDrop: false,
    direction: DirectionText.LEFT_TO_RIGHT,
    scrollPastEnd: false,
  },
};

const loadInitialSettings = () => {
  try {
    const raw = localStorage.getItem('settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
        codeMirrorOptions: {
          ...defaultSettings.codeMirrorOptions,
          ...(parsed.codeMirrorOptions || {}),
        },
      };
    }
  } catch {
    // Ignore error
  }
  return defaultSettings;
};

const saveSettingsToLocalStorage = (settings: { previewMarkdown: boolean; sidebarVisible: boolean; notesSortKey: NotesSortKey; codeMirrorOptions: { [key: string]: any } }) => {
  try {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        previewMarkdown: settings.previewMarkdown,
        sidebarVisible: settings.sidebarVisible,
        notesSortKey: settings.notesSortKey,
        codeMirrorOptions: settings.codeMirrorOptions,
      })
    );
  } catch {
    // Ignore storage errors
  }
};

export interface SettingsStoreState {
  isOpen: boolean;
  previewMarkdown: boolean;
  loading: boolean;
  sidebarVisible: boolean;
  notesSortKey: NotesSortKey;
  codeMirrorOptions: { [key: string]: any };

  // Actions
  toggleSettingsModal: () => void;
  updateCodeMirrorOption: (payload: { key: string; value: any }) => void;
  togglePreviewMarkdown: () => void;
  updateNotesSortStrategy: (sortBy: NotesSortKey) => void;
  loadSettings: () => void;
}

const initial = loadInitialSettings();

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  isOpen: false,
  previewMarkdown: initial.previewMarkdown,
  loading: false,
  sidebarVisible: initial.sidebarVisible,
  notesSortKey: initial.notesSortKey,
  codeMirrorOptions: initial.codeMirrorOptions,

  toggleSettingsModal: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  updateCodeMirrorOption: ({ key, value }) => {
    set((state) => {
      const updatedOptions = { ...state.codeMirrorOptions, [key]: value };
      saveSettingsToLocalStorage({
        ...state,
        codeMirrorOptions: updatedOptions,
      });
      return { codeMirrorOptions: updatedOptions };
    });
  },

  togglePreviewMarkdown: () => {
    set((state) => {
      const next = !state.previewMarkdown;
      saveSettingsToLocalStorage({
        ...state,
        previewMarkdown: next,
      });
      return { previewMarkdown: next };
    });
  },

  updateNotesSortStrategy: (sortBy) => {
    set((state) => {
      saveSettingsToLocalStorage({
        ...state,
        notesSortKey: sortBy,
      });
      return { notesSortKey: sortBy };
    });
  },

  loadSettings: () => {
    const loaded = loadInitialSettings();
    set({
      previewMarkdown: loaded.previewMarkdown,
      sidebarVisible: loaded.sidebarVisible,
      notesSortKey: loaded.notesSortKey,
      codeMirrorOptions: loaded.codeMirrorOptions,
      loading: false,
    });
  },
}));
