import React from 'react';

import { Folder, NotesSortKey } from '@/utils/enums';

//==============================================================================
// Items
//==============================================================================

export interface NoteItem {
  id: string;
  text: string;
  created: string;
  lastUpdated: string;
  /**
   * Refers to the category UUID and not the actual name.
   */
  category?: string;
  scratchpad?: boolean;
  trash?: boolean;
  favorite?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  draggedOver: boolean;
}

//==============================================================================
// State
//==============================================================================

export interface CategoryState {
  categories: CategoryItem[];
  error: string;
  loading: boolean;
  editingCategory: {
    id: string;
    tempName: string;
  };
}

export interface NoteState {
  notes: NoteItem[];
  activeFolder: Folder;
  activeNoteId: string;
  selectedNotesIds: string[];
  activeCategoryId: string;
  error: string;
  loading: boolean;
  searchValue: string;
}

export interface SettingsState {
  isOpen: boolean;
  previewMarkdown: boolean;
  loading: boolean;
  darkTheme: boolean;
  sidebarVisible: boolean;
  notesSortKey: NotesSortKey;
  codeMirrorOptions: { [key: string]: any };
}

export interface RootState {
  categoryState: CategoryState;
  noteState: NoteState;
  settingsState: SettingsState;
}

export interface StatePayload {
  categories: CategoryItem[];
  notes: NoteItem[];
}

//==============================================================================
// Events
//==============================================================================

export type ReactDragEvent = React.DragEvent<HTMLDivElement>;

export type ReactMouseEvent = MouseEvent | React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLSelectElement>;

export type ReactSubmitEvent = React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>;

//==============================================================================
// Default Types
//==============================================================================

// Taken from TypeScript private declared type within Actions
export type WithPayload<P, T> = T & {
  payload: P;
};
