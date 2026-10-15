import { useRef, useState } from 'react';
import { Menu, ScrollArea, VisuallyHidden, Box, ActionIcon, Tooltip } from '@mantine/core';
import { FcRating, FcFolder, FcBookmark } from 'react-icons/fc';
import { MdMoreVert, MdDelete, MdRestore, MdClose, MdFileDownload, MdContentCopy, MdViewSidebar } from 'react-icons/md';

import { Folder, Shortcuts } from '@/utils/enums';
import { NoteListButton } from '@/features/notes/components/NoteListButton';
import { SearchBar } from '@/features/notes/components/SearchBar';
import { getNoteTitle, debounceEvent, isDraftNote, downloadNotes, getShortUuid, copyToClipboard } from '@/utils/helpers';
import { useKey } from '@/utils/hooks';
import { NoteItem, ReactDragEvent } from '@/types';
import { getNotesSorter } from '@/utils/notesSortStrategies';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';
import { ConfirmationModal } from '@/features/common/ConfirmationModal';

export const NoteList = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { notesSortKey, sidebarVisible, toggleSidebar } = useSettingsStore();
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

  const searchRef = useRef<HTMLInputElement>(null);

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

  const [confirmDialog, setConfirmDialog] = useState<{
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

  const focusSearchHandler = () => searchRef.current?.focus();

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
    const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
    const count = targetIds.length;
    const title = getNoteTitle(note.text);
    const message = count > 1 ? `Are you sure you want to move ${count} selected notes to trash?` : `Are you sure you want to move "${title}" to trash?`;

    setConfirmDialog({
      isOpen: true,
      title: count > 1 ? 'Move notes to trash' : 'Move note to trash',
      message,
      confirmLabel: 'Move to trash',
      onConfirm: () => {
        targetIds.forEach((id) => _toggleTrashNotes(id));
      },
    });
  };

  const showEmptyTrash = activeFolder === Folder.TRASH && filteredNotes.length > 0;

  useKey(Shortcuts.SEARCH, () => focusSearchHandler());

  return (
    <Box
      component="aside"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#e5e5e5',
        borderRight: '1px solid #cbcbcb',
      }}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          fontWeight: 700,
          backgroundColor: '#e5e5e5',
          height: 49,
          padding: '0 0.5rem',
          borderBottom: '1px solid #cbcbcb',
          gap: '0.35rem',
        }}>
        <Tooltip label={sidebarVisible ? 'Hide sidebar (Ctrl+Alt+S)' : 'Show sidebar (Ctrl+Alt+S)'} withArrow position="bottom">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="md"
            onClick={() => toggleSidebar()}
            aria-label="Toggle sidebar"
            styles={{
              root: {
                color: '#495057',
                '&:hover': {
                  backgroundColor: '#d8d8d8',
                  color: '#212529',
                },
              },
            }}>
            <MdViewSidebar size={18} />
          </ActionIcon>
        </Tooltip>
        <SearchBar searchRef={searchRef} searchNotes={_searchNotes} />
        {showEmptyTrash && <NoteListButton label="Empty Trash" handler={handleEmptyTrash} />}
      </Box>
      {selectedNotesIds.length > 1 && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.75rem',
            backgroundColor: '#e8effd',
            borderBottom: '1px solid #c9d8fa',
            fontSize: '0.8rem',
            color: '#1a56db',
            fontWeight: 500,
          }}>
          <span>{selectedNotesIds.length} notes selected</span>
          <ActionIcon
            size="xs"
            variant="subtle"
            color="blue"
            onClick={() => {
              if (selectedNotesIds[0]) {
                _updateSelectedNotes(selectedNotesIds[0], false);
                _updateActiveNote(selectedNotesIds[0], false);
              }
            }}
            title="Clear selection">
            <MdClose size={14} />
          </ActionIcon>
        </Box>
      )}
      <style>{`
        .note-list-each {
          cursor: pointer;
          padding: 0.5rem;
          border-left: 3px solid transparent;
          border-bottom: 1px solid #d1d1d1;
          font-weight: 500;
          font-size: 0.85rem;
          line-height: 1.3;
          background-color: transparent;
          color: #404040;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .note-list-each:hover:not(.selected) {
          background-color: #d8d8d8;
          color: #202020;
        }
        .note-list-each:hover:not(.selected) .note-options-btn {
          color: #404040 !important;
        }
        .note-list-each.selected {
          background-color: #e8effd !important;
          border-left: 3px solid #5183f5 !important;
          border-bottom: 1px solid #c9d8fa !important;
          color: #1a202c !important;
          font-weight: 600 !important;
        }
        .note-list-each.selected:hover {
          background-color: #dde7fc !important;
        }
        .note-list-each.selected .note-options-btn {
          color: #5183f5 !important;
        }
      `}</style>
      <ScrollArea style={{ flex: 1 }} type="hover">
        {filteredNotes.map((note: NoteItem) => {
          let noteTitle: string | React.ReactElement = getNoteTitle(note.text);
          const noteCategory = categories.find((category) => category.id === note.category);
          const hasCategory = Boolean(note.category);

          if (searchValue) {
            const highlightStart = noteTitle.search(re);

            if (highlightStart !== -1) {
              const highlightEnd = highlightStart + searchValue.length;

              noteTitle = (
                <>
                  {noteTitle.slice(0, highlightStart)}
                  <strong style={{ backgroundColor: '#ffe066', color: '#1a202c', padding: '0 2px', borderRadius: 2 }}>{noteTitle.slice(highlightStart, highlightEnd)}</strong>
                  {noteTitle.slice(highlightEnd)}
                </>
              );
            }
          }

          const isSelected = selectedNotesIds.includes(note.id);

          return (
            <Menu key={note.id} shadow="md" width={220} withinPortal position="bottom-end">
              <Menu.ContextMenu>
                <Box
                  className={isSelected ? 'note-list-each selected' : 'note-list-each'}
                  onClick={(event) => {
                    event.stopPropagation();
                    const isMulti = Boolean(event.metaKey || event.ctrlKey);
                    _updateSelectedNotes(note.id, isMulti);
                    _updateActiveNote(note.id, isMulti);
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
                  <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, fontWeight: isSelected ? 600 : 500 }}>
                      {note.favorite ? (
                        <>
                          <Box style={{ display: 'flex', flex: '0 0 25px' }}>
                            <FcRating aria-hidden="true" size={16} style={{ stroke: '#5183f5', margin: '0.25rem' }} />
                            <VisuallyHidden>Favorite note</VisuallyHidden>
                          </Box>
                          <Box style={{ overflow: 'hidden', textOverflow: 'clip', whiteSpace: 'nowrap' }}>{noteTitle}</Box>
                        </>
                      ) : (
                        <>
                          <Box style={{ display: 'flex', flex: '0 0 25px' }} />
                          <Box style={{ overflow: 'hidden', textOverflow: 'clip', whiteSpace: 'nowrap' }}>{noteTitle}</Box>
                        </>
                      )}
                    </Box>
                    {!isDraftNote(note) ? (
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          color="gray"
                          className="note-options-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}>
                          <MdMoreVert aria-hidden="true" size={16} />
                          <VisuallyHidden>Note options</VisuallyHidden>
                        </ActionIcon>
                      </Menu.Target>
                    ) : (
                      <Box style={{ width: 28 }} />
                    )}
                  </Box>
                  {(activeFolder === Folder.ALL || activeFolder === Folder.FAVORITES) && (
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: isSelected ? '#556987' : 'rgba(0, 0, 0, 0.4)',
                        marginLeft: 25,
                        gap: '0.5rem',
                      }}>
                      {noteCategory ? (
                        <>
                          <FcFolder size={16} />
                          {noteCategory?.name}
                        </>
                      ) : (
                        <>
                          <FcBookmark size={16} />
                          Notes
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Menu.ContextMenu>

              {!isDraftNote(note) && (
                <Menu.Dropdown>
                  {note.trash ? (
                    <>
                      <Menu.Item color="red" leftSection={<MdDelete size={16} />} onClick={() => handleDeletePermanently(note)}>
                        {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1 ? `Delete ${selectedNotesIds.length} notes permanently` : 'Delete permanently'}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<MdRestore size={16} />}
                        onClick={() => {
                          const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
                          targetIds.forEach((id) => _toggleTrashNotes(id));
                        }}>
                        {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1 ? `Restore ${selectedNotesIds.length} notes` : 'Restore from trash'}
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      {!note.scratchpad && (
                        <>
                          <Menu.Item
                            leftSection={<FcRating size={15} />}
                            onClick={() => {
                              const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
                              targetIds.forEach((id) => _toggleFavoriteNotes(id));
                            }}>
                            {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1
                              ? `Toggle favorite (${selectedNotesIds.length} notes)`
                              : isSelectedNotesDiffFavor
                              ? 'Toggle favorite'
                              : note.favorite
                              ? 'Remove favorite'
                              : 'Mark as favorite'}
                          </Menu.Item>

                          {categories.length > 0 && (
                            <Menu.Sub>
                              <Menu.Sub.Target>
                                <Menu.Item leftSection={<FcFolder size={15} />}>
                                  {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1
                                    ? `Move ${selectedNotesIds.length} notes to category...`
                                    : 'Move to category...'}
                                </Menu.Item>
                              </Menu.Sub.Target>
                              <Menu.Sub.Dropdown>
                                {categories.map((cat) => (
                                  <Menu.Item
                                    key={cat.id}
                                    disabled={cat.id === note.category && (!selectedNotesIds.includes(note.id) || selectedNotesIds.length <= 1)}
                                    leftSection={<FcFolder size={16} />}
                                    onClick={() => {
                                      const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
                                      targetIds.forEach((id) => _addCategoryToNote(cat.id, id));
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
                                const targetIds = selectedNotesIds.includes(note.id) ? selectedNotesIds : [note.id];
                                targetIds.forEach((id) => _addCategoryToNote('', id));
                                _updateActiveNote(note.id, false);
                              }}>
                              {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1 ? `Remove category (${selectedNotesIds.length} notes)` : 'Remove category'}
                            </Menu.Item>
                          )}

                          <Menu.Item color="red" leftSection={<MdDelete size={16} />} onClick={() => handleMoveToTrash(note)}>
                            {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1 ? `Move ${selectedNotesIds.length} notes to trash` : 'Move to trash'}
                          </Menu.Item>
                        </>
                      )}

                      <Menu.Item leftSection={<MdFileDownload size={16} />} onClick={() => downloadNotes(selectedNotesIds.includes(note.id) ? selectedNotes : [note], categories)}>
                        {selectedNotesIds.includes(note.id) && selectedNotesIds.length > 1 ? `Download (${selectedNotesIds.length} notes)` : 'Download'}
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
    </Box>
  );
};
