import { useEffect, useState } from 'react';
import { Eye, Edit, Star, Trash2, Download, Settings, Sun, Moon, Clipboard as ClipboardCmp } from '@/icons';

import { TestID } from '@/constants/TestID';
import { downloadNotes, isDraftNote, getShortUuid, copyToClipboard } from '@/utils/helpers';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';

export const NoteMenuBar = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { notes, activeNoteId, toggleFavoriteNotes, toggleTrashNotes } = useNotesStore();
  const { categories } = useCategoriesStore();
  const { darkTheme, toggleSettingsModal, togglePreviewMarkdown, toggleDarkTheme, updateCodeMirrorOption } = useSettingsStore();

  // ===========================================================================
  // Other
  // ===========================================================================

  const copyNoteIcon = <ClipboardCmp size={18} aria-hidden="true" focusable="false" />;
  const successfulCopyMessage = 'Note copied!';
  const activeNote = notes.find((note) => note.id === activeNoteId)!;
  const shortNoteUuid = getShortUuid(activeNoteId);

  // ===========================================================================
  // State
  // ===========================================================================

  const [uuidCopiedText, setUuidCopiedText] = useState<string>('');
  const [isToggled, togglePreviewIcon] = useState<boolean>(false);

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (uuidCopiedText === successfulCopyMessage) {
      const timer = setTimeout(() => {
        setUuidCopiedText('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [uuidCopiedText]);

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const downloadNotesHandler = () => downloadNotes([activeNote], categories);
  const favoriteNoteHandler = () => toggleFavoriteNotes(activeNoteId);
  const trashNoteHandler = () => toggleTrashNotes(activeNoteId);
  const settingsHandler = () => toggleSettingsModal();
  const toggleDarkThemeHandler = () => {
    toggleDarkTheme();
    updateCodeMirrorOption({
      key: 'theme',
      value: darkTheme ? 'base16-light' : 'new-moon',
    });
  };
  const togglePreviewHandler = () => {
    togglePreviewIcon(!isToggled);
    togglePreviewMarkdown();
  };

  return (
    <section className="note-menu-bar">
      {activeNote && !isDraftNote(activeNote) ? (
        <nav>
          <button className="note-menu-bar-button" onClick={togglePreviewHandler} data-testid={TestID.PREVIEW_MODE}>
            {isToggled ? <Edit aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
            <span className="sr-only">{isToggled ? 'Edit note' : 'Preview note'}</span>
          </button>
          {!activeNote.scratchpad && (
            <>
              <button className="note-menu-bar-button" onClick={favoriteNoteHandler}>
                <Star aria-hidden="true" size={18} />
                <span className="sr-only">Add note to favorites</span>
              </button>
              <button className="note-menu-bar-button trash" onClick={trashNoteHandler}>
                <Trash2 aria-hidden="true" size={18} />
                <span className="sr-only">Delete note</span>
              </button>
            </>
          )}
          <button className="note-menu-bar-button">
            <Download aria-hidden="true" size={18} onClick={downloadNotesHandler} />
            <span className="sr-only">Download note</span>
          </button>
          <button
            className="note-menu-bar-button uuid"
            onClick={() => {
              copyToClipboard(`{{${shortNoteUuid}}}`);
              setUuidCopiedText(successfulCopyMessage);
            }}
            data-testid={TestID.UUID_MENU_BAR_COPY_ICON}>
            {copyNoteIcon}
            {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
            <span className="sr-only">Copy note</span>
          </button>
        </nav>
      ) : (
        <div />
      )}
      <nav>
        <button className="note-menu-bar-button" onClick={toggleDarkThemeHandler}>
          {darkTheme ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          <span className="sr-only">Themes</span>
        </button>

        <button className="note-menu-bar-button" onClick={settingsHandler}>
          <Settings aria-hidden="true" size={18} />
          <span className="sr-only">Settings</span>
        </button>
      </nav>
    </section>
  );
};
