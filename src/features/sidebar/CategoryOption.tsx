import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Menu } from '@mantine/core';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { MdMoreVert, MdEdit, MdDelete } from 'react-icons/md';

import { CategoryItem, ReactDragEvent, ReactSubmitEvent } from '@/types';
import { determineCategoryClass } from '@/utils/helpers';
import { Folder } from '@/utils/enums';
import { getNotesSorter } from '@/utils/notesSortStrategies';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';
import { ConfirmationModal } from '@/features/common/ConfirmationModal';

interface CategoryOptionProps {
  category: CategoryItem;
  index: number;
  onSubmitUpdateCategory: (event: ReactSubmitEvent) => void;
}

export const CategoryOption: React.FC<CategoryOptionProps> = ({ category, index, onSubmitUpdateCategory }) => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { activeCategoryId, notes, updateActiveCategoryId, updateActiveNote, updateSelectedNotes, addCategoryToNote, removeCategoryFromNotes, swapFolder } = useNotesStore();
  const {
    editingCategory: { id: editingCategoryId, tempName: tempCategoryName },
    setCategoryEdit,
    deleteCategory,
    categoryDragLeave,
    categoryDragEnter,
  } = useCategoriesStore();
  const { notesSortKey } = useSettingsStore();

  const _updateActiveCategoryId = (categoryId: string) => updateActiveCategoryId(categoryId);
  const _updateActiveNote = (noteId: string, multiSelect: boolean) => updateActiveNote({ noteId, multiSelect });
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) => updateSelectedNotes({ noteId, multiSelect });
  const _setCategoryEdit = (categoryId: string, tempName: string) => setCategoryEdit({ id: categoryId, tempName });
  const _addCategoryToNote = (categoryId: string, noteId: string) => addCategoryToNote({ categoryId, noteId });
  const _deleteCategory = (categoryId: string) => deleteCategory(categoryId);
  const _removeCategoryFromNotes = (categoryId: string) => removeCategoryFromNotes(categoryId);
  const _swapFolder = (folder: Folder) => swapFolder({ folder });
  const _categoryDragEnter = (cat: CategoryItem) => categoryDragEnter(cat);
  const _categoryDragLeave = (cat: CategoryItem) => categoryDragLeave(cat);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const startRename = () => {
    _setCategoryEdit(category.id, category.name);
  };

  const removeCategory = () => {
    _deleteCategory(category.id);
    _removeCategoryFromNotes(category.id);
    _swapFolder(Folder.ALL);
  };

  return (
    <>
      <ConfirmationModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={removeCategory}
        title="Delete category"
        message={`Are you sure you want to delete category "${category.name}"? Notes inside will not be deleted, but will become uncategorized.`}
        confirmLabel="Delete"
        danger
      />
      <Draggable draggableId={category.id} index={index}>
        {(draggableProvided, snapshot) => (
          <Menu shadow="md" width={180} withinPortal position="bottom-end">
            <Menu.ContextMenu>
              <div
                {...draggableProvided.dragHandleProps}
                {...draggableProvided.draggableProps}
                ref={draggableProvided.innerRef}
                className={determineCategoryClass(category, snapshot.isDragging, activeCategoryId)}
                onClick={() => {
                  const notesForNewCategory = notes.filter((note) => !note.trash && note.category === category.id).sort(getNotesSorter(notesSortKey));

                  const defaultActiveNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : '';

                  if (category.id !== activeCategoryId) {
                    _updateActiveCategoryId(category.id);
                    _updateActiveNote(defaultActiveNoteId, false);
                    _updateSelectedNotes(defaultActiveNoteId, false);
                  }
                }}
                onDoubleClick={startRename}
                onBlur={() => {
                  _setCategoryEdit('', '');
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  _addCategoryToNote(category.id, event.dataTransfer.getData('text'));
                  _categoryDragLeave(category);
                }}
                onDragOver={(event: ReactDragEvent) => event.preventDefault()}
                onDragEnter={() => _categoryDragEnter(category)}
                onDragLeave={() => _categoryDragLeave(category)}>
                <form
                  className="category-list-name"
                  onSubmit={(event) => {
                    event.preventDefault();
                    _setCategoryEdit('', '');
                    onSubmitUpdateCategory(event);
                  }}>
                  {activeCategoryId === category.id ? <FcOpenedFolder size={17} className="app-sidebar-icon" /> : <FcFolder size={17} className="app-sidebar-icon" />}
                  {editingCategoryId === category.id ? (
                    <input
                      className="category-edit"
                      type="text"
                      autoFocus
                      maxLength={20}
                      value={tempCategoryName}
                      onChange={(event) => {
                        _setCategoryEdit(editingCategoryId, event.target.value);
                      }}
                      onBlur={(event) => onSubmitUpdateCategory(event)}
                    />
                  ) : (
                    category.name
                  )}
                </form>
                <Menu.Target>
                  <div
                    className="category-options"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}>
                    <MdMoreVert size={20} className="context-menu-action" />
                  </div>
                </Menu.Target>
              </div>
            </Menu.ContextMenu>

            <Menu.Dropdown>
              <Menu.Item leftSection={<MdEdit size={16} />} onClick={startRename}>
                Rename
              </Menu.Item>
              <Menu.Item color="red" leftSection={<MdDelete size={16} />} onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Draggable>
    </>
  );
};
