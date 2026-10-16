import React from 'react';
import { Menu, ScrollArea, VisuallyHidden } from '@mantine/core';
import { FcRating, FcFolder, FcBookmark } from 'react-icons/fc';
import { MdMoreVert, MdDelete, MdRestore, MdClose, MdFileDownload, MdContentCopy } from 'react-icons/md';

import { Folder, Shortcuts } from '@/utils/enums';
import { NoteListButton } from '@/features/notes/components/NoteListButton';
import { SearchBar } from '@/features/notes/components/SearchBar';
import { getNoteTitle, debounceEvent, isDraftNote, downloadNotes, getShortUuid, copyToClipboard } from '@/utils/helpers';
import { useKey } from '@/utils/hooks';
import { NoteItem, ReactDragEvent } from '@/types';
import { getNotesSorter } from '@/utils/notesSortStrategies';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';
import { ConfirmationModal } from '@/features/common/ConfirmationModal';

export const NoteList: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { notesSortKey } = useSettingsStore();
  const {
    activeCategoryId,
    activeFolder,
    selectedNotesIds,
    notes,
    searchValue,
    updateSelectedNotes,
    permanentlyEmptyTrash,
    pruneNotes,
    updateActiveNote,
    searchNotes,
    deleteNotes,
    toggleTrashNotes,
    toggleFavoriteNotes,
    addCategoryToNote,
    updateActiveCategoryId,
  } = useNotesStore();
  const { categories } = useCategoriesStore();

  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) => updateSelectedNotes({ noteId, multiSelect });
  const _permanentlyEmptyTrash = () => permanentlyEmptyTrash();
  const _pruneNotes = () => pruneNotes();
  const _updateActiveNote = (noteId: string, multiSelect: boolean) => updateActiveNote({ noteId, multiSelect });
  const _searchNotes = debounceEvent((val: string) => searchNotes(val), 100);
  const _deleteNotes = (noteIds: string[]) => deleteNotes(noteIds);
  const _toggleTrashNotes = (noteId: string) => toggleTrashNotes(noteId);
  const _toggleFavoriteNotes = (noteId: string) => toggleFavoriteNotes(noteId);
  const _addCategoryToNote = (categoryId: string, noteId: string) => addCategoryToNote({ categoryId, noteId });
  const _updateActiveCategoryId = (categoryId: string) => updateActiveCategoryId(categoryId);

  // ===========================================================================
  // Refs
  // ===========================================================================

  const searchRef = React.useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

  // ===========================================================================
  // State & Computed
  // ===========================================================================

  const re = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const isMatch = (result: NoteItem) => re.test(result.text);

  const filter: Record<Folder, (note: NoteItem) => boolean> = {
    [Folder.CATEGORY]: (note) => !note.trash && note.category === activeCategoryId,
    [Folder.SCRATCHPAD]: (note) => !!note.scratchpad,
    [Folder.FAVORITES]: (note) => !note.trash && !!note.favorite,
    [Folder.TRASH]: (note) => !!note.trash,
    [Folder.ALL]: (note) => !note.trash && !note.scratchpad,
  };

  const filteredNotes: NoteItem[] = notes.filter(filter[activeFolder]).filter(isMatch).sort(getNotesSorter(notesSortKey));
  const selectedNotes = notes.filter((n) => selectedNotesIds.includes(n.id));
  const isSelectedNotesDiffFavor = Boolean(selectedNotes.find((n) => n.favorite) && selectedNotes.find((n) => !n.favorite));

  // ===========================================================================
  // Handlers & Confirmations
  // ===========================================================================

  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
  });

  const focusSearchHandler = () => searchRef.current.focus();

  const handleDragStart = (event: ReactDragEvent, noteId: string = '') => {
    event.stopPropagation();
    event.dataTransfer.setData('text/plain', noteId);
  };

  const handleEmptyTrash = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Empty Trash',
      message: 'Are you sure you want to permanently delete all notes in Trash? This action cannot be undone.',
      confirmLabel: 'Empty Trash',
      onConfirm: () => _permanentlyEmptyTrash(),
    });
  };

  const handleDeletePermanently = (note: NoteItem) => {
    const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
    const count = targetIds.length;
    const title = getNoteTitle(note.text);
    const message =
      count > 1
        ? `Are you sure you want to permanently delete ${count} selected notes? This action cannot be undone.`
        : `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete permanently',
      message,
      confirmLabel: 'Delete permanently',
      onConfirm: () => _deleteNotes(targetIds),
    });
  };

  const handleMoveToTrash = (note: NoteItem) => {
    const title = getNoteTitle(note.text);
    setConfirmDialog({
      isOpen: true,
      title: 'Move note to trash',
      message: `Are you sure you want to move "${title}" to trash?`,
      confirmLabel: 'Move to trash',
      onConfirm: () => _toggleTrashNotes(note.id),
    });
  };

  const showEmptyTrash = activeFolder === Folder.TRASH && filteredNotes.length > 0;

  useKey(Shortcuts.SEARCH, () => focusSearchHandler());

  return (
    <aside className="note-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="note-sidebar-header">
        <SearchBar searchRef={searchRef} searchNotes={_searchNotes} />
        {showEmptyTrash && <NoteListButton label="Empty Trash" handler={handleEmptyTrash} />}
      </div>
      <ScrollArea className="note-list" style={{ flex: 1 }} type="hover">
        {filteredNotes.map((note: NoteItem) => {
          let noteTitle: string | React.ReactElement = getNoteTitle(note.text);
          const noteCategory = categories.find((category) => category.id === note.category);

          if (searchValue) {
            const highlightStart = noteTitle.search(re);

            if (highlightStart !== -1) {
              const highlightEnd = highlightStart + searchValue.length;

              noteTitle = (
                <>
                  {noteTitle.slice(0, highlightStart)}
                  <strong className="highlighted">{noteTitle.slice(highlightStart, highlightEnd)}</strong>
                  {noteTitle.slice(highlightEnd)}
                </>
              );
            }
          }

          const hasCategory = Boolean(note.category);

          return (
            <Menu key={note.id} shadow="md" width={220} withinPortal position="bottom-end">
              <Menu.ContextMenu>
                <div
                  className={selectedNotesIds.includes(note.id) ? 'note-list-each selected' : 'note-list-each'}
                  onClick={(event) => {
                    event.stopPropagation();
                    _updateSelectedNotes(note.id, event.metaKey);
                    _updateActiveNote(note.id, event.metaKey);
                    _pruneNotes();
                  }}
                  onContextMenu={() => {
                    if (!selectedNotesIds.includes(note.id)) {
                      _updateSelectedNotes(note.id, false);
                      _updateActiveNote(note.id, false);
                    }
                  }}
                  draggable={note.text !== ''}
                  onDragStart={(event) => handleDragStart(event, note.id)}>
                  <div className="note-list-outer">
                    <div className="note-title">
                      {note.favorite ? (
                        <>
                          <div className="icon">
                            <FcRating aria-hidden="true" className="note-favorite" size={16} />
                            <VisuallyHidden>Favorite note</VisuallyHidden>
                          </div>
                          <div className="truncate-text">{noteTitle}</div>
                        </>
                      ) : (
                        <>
                          <div className="icon" />
                          <div className="truncate-text"> {noteTitle}</div>
                        </>
                      )}
                    </div>
                    {!isDraftNote(note) ? (
                      <Menu.Target>
                        <div
                          className="note-options"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}>
                          <MdMoreVert aria-hidden="true" size={16} className="context-menu-action" />
                          <VisuallyHidden>Note options</VisuallyHidden>
                        </div>
                      </Menu.Target>
                    ) : (
                      <div className="note-options">&nbsp;</div>
                    )}
                  </div>
                  {(activeFolder === Folder.ALL || activeFolder === Folder.FAVORITES) && (
                    <div className="note-category">
                      {noteCategory ? (
                        <>
                          <FcFolder size={16} className="context-menu-action" />
                          {noteCategory?.name}
                        </>
                      ) : (
                        <>
                          <FcBookmark size={16} className="context-menu-action" />
                          Notes
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Menu.ContextMenu>

              {!isDraftNote(note) && (
                <Menu.Dropdown>
                  {note.trash ? (
                    <>
                      <Menu.Item color="red" leftSection={<MdDelete size={16} />} onClick={() => handleDeletePermanently(note)}>
                        Delete permanently
                      </Menu.Item>
                      <Menu.Item leftSection={<MdRestore size={16} />} onClick={() => _toggleTrashNotes(note.id)}>
                        Restore from trash
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      {!note.scratchpad && (
                        <>
                          <Menu.Item leftSection={<FcRating size={15} />} onClick={() => _toggleFavoriteNotes(note.id)}>
                            {isSelectedNotesDiffFavor ? 'Toggle favorite' : note.favorite ? 'Remove favorite' : 'Mark as favorite'}
                          </Menu.Item>

                          {categories.length > 0 && (
                            <Menu.Sub>
                              <Menu.Sub.Target>
                                <Menu.Item leftSection={<FcFolder size={15} />}>Move to category...</Menu.Item>
                              </Menu.Sub.Target>
                              <Menu.Sub.Dropdown>
                                {categories.map((cat) => (
                                  <Menu.Item
                                    key={cat.id}
                                    disabled={cat.id === note.category}
                                    leftSection={<FcFolder size={16} />}
                                    onClick={() => {
                                      _addCategoryToNote(cat.id, note.id);
                                      if (cat.id !== activeCategoryId) {
                                        _updateActiveCategoryId(cat.id);
                                        _updateActiveNote(note.id, false);
                                      }
                                    }}>
                                    {cat.name}
                                  </Menu.Item>
                                ))}
                              </Menu.Sub.Dropdown>
                            </Menu.Sub>
                          )}

                          {hasCategory && (
                            <Menu.Item
                              leftSection={<MdClose size={16} />}
                              onClick={() => {
                                _addCategoryToNote('', note.id);
                                _updateActiveNote(note.id, false);
                              }}>
                              Remove category
                            </Menu.Item>
                          )}

                          <Menu.Item color="red" leftSection={<MdDelete size={16} />} onClick={() => handleMoveToTrash(note)}>
                            Move to trash
                          </Menu.Item>
                        </>
                      )}

                      <Menu.Item leftSection={<MdFileDownload size={16} />} onClick={() => downloadNotes(selectedNotesIds.includes(note.id) ? selectedNotes : [note], categories)}>
                        Download
                      </Menu.Item>

                      <Menu.Item
                        leftSection={<MdContentCopy size={16} />}
                        onClick={() => {
                          const shortUuid = getShortUuid(note.id);
                          copyToClipboard(`{{${shortUuid}}}`);
                        }}>
                        Copy reference to note
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              )}
            </Menu>
          );
        })}
      </ScrollArea>
      <ConfirmationModal
        opened={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        danger
      />
    </aside>
  );
};
