import { Folder, NotesSortKey } from '@/utils/enums';

export const folderMap: Record<Folder, string> = {
  [Folder.ALL]: 'All Notes',
  [Folder.FAVORITES]: 'Favorites',
  [Folder.SCRATCHPAD]: 'Scratchpad',
  [Folder.TRASH]: 'Trash',
  [Folder.CATEGORY]: 'Category',
};

export const iconColor = 'rgba(255, 255, 255, 0.25)';

export const shortcutMap = [
  { action: 'Create a new note', key: 'N' },
  { action: 'Delete a note', key: 'U' },
  { action: 'Create a category', key: 'C' },
  { action: 'Download a note', key: 'O' },
  { action: 'Markdown preview', key: 'P' },
  { action: 'Search notes', key: 'F' },
  { action: 'Prettify a note', key: 'I' },
  { action: 'Toggle sidebar', key: 'S' },
];

export const notesSortOptions = [
  { value: NotesSortKey.TITLE, label: 'Title' },
  { value: NotesSortKey.CREATED_DATE, label: 'Date Created' },
  { value: NotesSortKey.LAST_UPDATED, label: 'Last Updated' },
];

export const fontSizeOptions = [
  { value: '12px', label: '12px (Small)' },
  { value: '14px', label: '14px (Default)' },
  { value: '16px', label: '16px (Medium)' },
  { value: '18px', label: '18px (Large)' },
  { value: '20px', label: '20px (Extra Large)' },
];

export const tabSizeOptions = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces (Default)' },
];
