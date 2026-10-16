import { useEffect, useState } from 'react';
import { Tooltip, Toolbar } from '@mantine/core';
import { MdVisibility, MdEdit, MdStar, MdStarBorder, MdDelete, MdFileDownload, MdContentCopy, MdSettings } from 'react-icons/md';

import { downloadNotes, isDraftNote, getShortUuid, copyToClipboard, getNoteTitle } from '@/utils/helpers';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';
import { ConfirmationModal } from '@/features/common/ConfirmationModal';

export const NoteMenuBar = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { notes, activeNoteId, toggleFavoriteNotes, toggleTrashNotes } = useNotesStore();
  const { categories } = useCategoriesStore();
  const { toggleSettingsModal, togglePreviewMarkdown } = useSettingsStore();

  // ===========================================================================
  // Other
  // ===========================================================================

  const copyNoteIcon = <MdContentCopy size={20} aria-hidden="true" focusable="false" />;
  const successfulCopyMessage = 'Note copied!';
  const activeNote = notes.find((note) => note.id === activeNoteId)!;
  const shortNoteUuid = getShortUuid(activeNoteId);

  // ===========================================================================
  // State
  // ===========================================================================

  const [uuidCopiedText, setUuidCopiedText] = useState<string>('');
  const [isToggled, togglePreviewIcon] = useState<boolean>(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState<boolean>(false);

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
  const trashNoteHandler = () => {
    if (activeNote?.trash) {
      toggleTrashNotes(activeNoteId);
    } else {
      setIsTrashModalOpen(true);
    }
  };
  const settingsHandler = () => toggleSettingsModal();
  const togglePreviewHandler = () => {
    togglePreviewIcon(!isToggled);
    togglePreviewMarkdown();
  };

  return (
    <>
      <ConfirmationModal
        opened={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        onConfirm={() => toggleTrashNotes(activeNoteId)}
        title="Move note to trash"
        message={`Are you sure you want to move "${activeNote ? getNoteTitle(activeNote.text) : 'this note'}" to trash?`}
        confirmLabel="Move to trash"
        danger
      />
      <Toolbar
        className="note-menu-bar"
        size="lg"
        aria-label="Note actions"
        style={{
          height: 46,
          minHeight: 46,
          borderTop: '1px solid #d8d8d8',
          backgroundColor: '#e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 99,
          padding: '0 0.5rem',
          borderRadius: 0,
        }}>
        {activeNote && !isDraftNote(activeNote) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Toolbar.Group>
              <Tooltip label={isToggled ? 'Edit note' : 'Preview note'} withArrow position="bottom">
                <Toolbar.Toggle active={isToggled} onClick={togglePreviewHandler} aria-label={isToggled ? 'Edit note' : 'Preview note'}>
                  {isToggled ? <MdEdit size={20} /> : <MdVisibility size={20} />}
                </Toolbar.Toggle>
              </Tooltip>

              {!activeNote.scratchpad && (
                <Tooltip label={activeNote.favorite ? 'Remove favorite' : 'Add to favorites'} withArrow position="bottom">
                  <Toolbar.Toggle active={activeNote.favorite} onClick={favoriteNoteHandler} aria-label="Add note to favorites">
                    {activeNote.favorite ? <MdStar size={20} color="#e67e22" /> : <MdStarBorder size={20} />}
                  </Toolbar.Toggle>
                </Tooltip>
              )}
            </Toolbar.Group>

            <Toolbar.Divider />

            <Toolbar.Group>
              {!activeNote.scratchpad && (
                <Tooltip label="Delete note" withArrow position="bottom">
                  <Toolbar.Toggle onClick={trashNoteHandler} aria-label="Delete note">
                    <MdDelete size={20} />
                  </Toolbar.Toggle>
                </Tooltip>
              )}

              <Tooltip label="Download note" withArrow position="bottom">
                <Toolbar.Toggle onClick={downloadNotesHandler} aria-label="Download note">
                  <MdFileDownload size={20} />
                </Toolbar.Toggle>
              </Tooltip>

              <Tooltip label="Copy note reference" withArrow position="bottom">
                <Toolbar.Toggle
                  onClick={() => {
                    copyToClipboard(`{{${shortNoteUuid}}}`);
                    setUuidCopiedText(successfulCopyMessage);
                  }}
                  aria-label="Copy note">
                  {copyNoteIcon}
                  {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
                </Toolbar.Toggle>
              </Tooltip>
            </Toolbar.Group>
          </div>
        ) : (
          <div />
        )}
        <Toolbar.Group>
          <Tooltip label="Settings" withArrow position="bottom">
            <Toolbar.Toggle onClick={settingsHandler} aria-label="Settings">
              <MdSettings size={20} />
            </Toolbar.Toggle>
          </Tooltip>
        </Toolbar.Group>
      </Toolbar>
    </>
  );
};
