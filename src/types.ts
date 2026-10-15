import type { DragEvent, SyntheticEvent } from 'react';

//==============================================================================
// Domain Models
//==============================================================================

export interface NoteItem {
  id: string;
  text: string;
  created: string;
  lastUpdated: string;
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
// React Event Helpers
//==============================================================================

export type ReactDragEvent = DragEvent<HTMLDivElement>;
export type ReactSubmitEvent = SyntheticEvent;
