import { useEffect, useState } from 'react';
import { Tooltip } from '@radix-ui/themes';
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
          <Tooltip content={isToggled ? 'Edit note' : 'Preview note'}>
            <button className="note-menu-bar-button" onClick={togglePreviewHandler} data-testid={TestID.PREVIEW_MODE} aria-label={isToggled ? 'Edit note' : 'Preview note'}>
              {isToggled ? <Edit aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
              <span className="sr-only">{isToggled ? 'Edit note' : 'Preview note'}</span>
            </button>
          </Tooltip>

          {!activeNote.scratchpad && (
            <>
              <Tooltip content={activeNote.favorite ? 'Remove favorite' : 'Add to favorites'}>
                <button className="note-menu-bar-button" onClick={favoriteNoteHandler} aria-label="Add note to favorites">
                  <Star aria-hidden="true" size={18} />
                  <span className="sr-only">Add note to favorites</span>
                </button>
              </Tooltip>

              <Tooltip content="Delete note">
                <button className="note-menu-bar-button trash" onClick={trashNoteHandler} aria-label="Delete note">
                  <Trash2 aria-hidden="true" size={18} />
                  <span className="sr-only">Delete note</span>
                </button>
              </Tooltip>
            </>
          )}

          <Tooltip content="Download note">
            <button className="note-menu-bar-button" onClick={downloadNotesHandler} aria-label="Download note">
              <Download aria-hidden="true" size={18} />
              <span className="sr-only">Download note</span>
            </button>
          </Tooltip>

          <Tooltip content="Copy note reference">
            <button
              className="note-menu-bar-button uuid"
              onClick={() => {
                copyToClipboard(`{{${shortNoteUuid}}}`);
                setUuidCopiedText(successfulCopyMessage);
              }}
              aria-label="Copy note"
              data-testid={TestID.UUID_MENU_BAR_COPY_ICON}>
              {copyNoteIcon}
              {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
              <span className="sr-only">Copy note</span>
            </button>
          </Tooltip>
        </nav>
      ) : (
        <div />
      )}
      <nav>
        <Tooltip content={darkTheme ? 'Switch to light mode' : 'Switch to dark mode'}>
          <button className="note-menu-bar-button" onClick={toggleDarkThemeHandler} aria-label="Themes">
            {darkTheme ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
            <span className="sr-only">Themes</span>
          </button>
        </Tooltip>

        <Tooltip content="Settings">
          <button className="note-menu-bar-button" onClick={settingsHandler} aria-label="Settings">
            <Settings aria-hidden="true" size={18} />
            <span className="sr-only">Settings</span>
          </button>
        </Tooltip>
      </nav>
    </section>
  );
};
