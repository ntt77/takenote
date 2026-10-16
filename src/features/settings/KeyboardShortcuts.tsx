import React from 'react';
import prettier from 'prettier/standalone';
import parserMarkdown from 'prettier/parser-markdown';

import { Folder, Shortcuts } from '@/utils/enums';
import { downloadNotes, getActiveNote, newNoteHandlerHelper, getNoteTitle } from '@/utils/helpers';
import { useKey } from '@/utils/hooks';
import { NoteItem } from '@/types';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';
import { ConfirmationModal } from '@/features/common/ConfirmationModal';

export const KeyboardShortcuts: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { categories, addingTempCategory, setAddingTempCategory } = useCategoriesStore();
  const { activeCategoryId, activeFolder, activeNoteId, notes, selectedNotesIds, addNote, swapFolder, toggleTrashNotes, updateActiveNote, updateSelectedNotes, updateNote } =
    useNotesStore();
  const { previewMarkdown, togglePreviewMarkdown } = useSettingsStore();

  const [isTrashModalOpen, setIsTrashModalOpen] = React.useState(false);

  const activeNote = getActiveNote(notes, activeNoteId);

  const _addNote = (note: NoteItem) => addNote(note);
  const _updateActiveNote = (noteId: string, multiSelect: boolean) => updateActiveNote({ noteId, multiSelect });
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) => updateSelectedNotes({ noteId, multiSelect });
  const _swapFolder = (folder: Folder) => swapFolder({ folder });
  const _toggleTrashNotes = (noteId: string) => toggleTrashNotes(noteId);
  const _togglePreviewMarkdown = () => togglePreviewMarkdown();

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const newNoteHandler = () =>
    newNoteHandlerHelper(activeFolder, previewMarkdown, activeNote, activeCategoryId, _swapFolder, _togglePreviewMarkdown, _addNote, _updateActiveNote, _updateSelectedNotes);
  const newTempCategoryHandler = () => !addingTempCategory && setAddingTempCategory(true);
  const trashNoteHandler = () => {
    if (!activeNote) return;
    if (activeNote.trash) {
      _toggleTrashNotes(activeNote.id);
    } else {
      setIsTrashModalOpen(true);
    }
  };
  const downloadNotesHandler = () => {
    if (!activeNote || selectedNotesIds.length === 0) return;
    downloadNotes(selectedNotesIds.includes(activeNote.id) ? notes.filter((note) => selectedNotesIds.includes(note.id)) : [activeNote], categories);
  };
  const togglePreviewMarkdownHandler = () => _togglePreviewMarkdown();
  const prettifyNoteHandler = () => {
    if (activeNote && activeNote.text) {
      const formattedText = prettier.format(activeNote.text, {
        parser: 'markdown',
        plugins: [parserMarkdown],
      });

      const updatedNote = {
        ...activeNote,
        text: formattedText,
      };

      updateNote(updatedNote);
    }
  };

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useKey(Shortcuts.NEW_NOTE, () => newNoteHandler());
  useKey(Shortcuts.NEW_CATEGORY, () => newTempCategoryHandler());
  useKey(Shortcuts.DELETE_NOTE, () => trashNoteHandler());
  useKey(Shortcuts.DOWNLOAD_NOTES, () => downloadNotesHandler());
  useKey(Shortcuts.PREVIEW, () => togglePreviewMarkdownHandler());
  useKey(Shortcuts.PRETTIFY, () => prettifyNoteHandler());

  return (
    <ConfirmationModal
      opened={isTrashModalOpen}
      onClose={() => setIsTrashModalOpen(false)}
      onConfirm={() => activeNote && _toggleTrashNotes(activeNote.id)}
      title="Move note to trash"
      message={`Are you sure you want to move "${activeNote ? getNoteTitle(activeNote.text) : 'this note'}" to trash?`}
      confirmLabel="Move to trash"
      danger
    />
  );
};
