import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Folder as FolderIcon, MoreHorizontal } from '@/icons'

import { TestID } from '@/constants/TestID'
import { CategoryItem, ReactDragEvent, ReactMouseEvent, ReactSubmitEvent } from '@/types'
import { determineCategoryClass } from '@/utils/helpers'
import { iconColor } from '@/utils/constants'
import { ContextMenuEnum } from '@/utils/enums'
import { getNotesSorter } from '@/utils/notesSortStrategies'
import { ContextMenu } from '@/features/notes/ContextMenu'
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store'

interface CategoryOptionProps {
  category: CategoryItem
  index: number
  contextMenuRef: React.RefObject<HTMLDivElement | null>
  handleCategoryMenuClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId?: string
  ) => void
  handleCategoryRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId?: string
  ) => void
  onSubmitUpdateCategory: (event: ReactSubmitEvent) => void
  optionsPosition: { x: number; y: number }
  optionsId: string
  setOptionsId: React.Dispatch<React.SetStateAction<string>>
}

export const CategoryOption: React.FC<CategoryOptionProps> = ({
  category,
  index,
  contextMenuRef,
  handleCategoryMenuClick,
  handleCategoryRightClick,
  onSubmitUpdateCategory,
  optionsPosition,
  optionsId,
  setOptionsId,
}) => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const {
    activeCategoryId,
    notes,
    updateActiveCategoryId,
    updateActiveNote,
    updateSelectedNotes,
    addCategoryToNote,
  } = useNotesStore()
  const {
    editingCategory: { id: editingCategoryId, tempName: tempCategoryName },
    setCategoryEdit,
    categoryDragLeave,
    categoryDragEnter,
  } = useCategoriesStore()
  const { notesSortKey } = useSettingsStore()

  const _updateActiveCategoryId = (categoryId: string) => updateActiveCategoryId(categoryId)
  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    updateActiveNote({ noteId, multiSelect })
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    updateSelectedNotes({ noteId, multiSelect })
  const _setCategoryEdit = (categoryId: string, tempName: string) =>
    setCategoryEdit({ id: categoryId, tempName })
  const _addCategoryToNote = (categoryId: string, noteId: string) =>
    addCategoryToNote({ categoryId, noteId })
  const _categoryDragEnter = (cat: CategoryItem) => categoryDragEnter(cat)
  const _categoryDragLeave = (cat: CategoryItem) => categoryDragLeave(cat)

  return (
    <Draggable draggableId={category.id} index={index}>
      {(draggableProvided, snapshot) => (
        <div
          {...draggableProvided.dragHandleProps}
          {...draggableProvided.draggableProps}
          ref={draggableProvided.innerRef}
          data-testid={TestID.CATEGORY_LIST_DIV}
          className={determineCategoryClass(category, snapshot.isDragging, activeCategoryId)}
          onClick={() => {
            const notesForNewCategory = notes
              .filter((note) => !note.trash && note.category === category.id)
              .sort(getNotesSorter(notesSortKey))

            const defaultActiveNoteId =
              notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

            if (category.id !== activeCategoryId) {
              _updateActiveCategoryId(category.id)
              _updateActiveNote(defaultActiveNoteId, false)
              _updateSelectedNotes(defaultActiveNoteId, false)
            }
          }}
          onDoubleClick={() => {
            _setCategoryEdit(category.id, category.name)
          }}
          onBlur={() => {
            _setCategoryEdit('', '')
          }}
          onDrop={(event) => {
            event.preventDefault()

            _addCategoryToNote(category.id, event.dataTransfer.getData('text'))
            _categoryDragLeave(category)
          }}
          onDragOver={(event: ReactDragEvent) => event.preventDefault()}
          onDragEnter={() => _categoryDragEnter(category)}
          onDragLeave={() => _categoryDragLeave(category)}
          onContextMenu={(event) => handleCategoryRightClick(event, category.id)}
        >
          <form
            className="category-list-name"
            onSubmit={(event) => {
              event.preventDefault()
              _setCategoryEdit('', '')
              onSubmitUpdateCategory(event)

              if (optionsId) setOptionsId('')
            }}
          >
            <FolderIcon size={15} className="app-sidebar-icon" color={iconColor} />
            {editingCategoryId === category.id ? (
              <input
                data-testid={TestID.CATEGORY_EDIT}
                className="category-edit"
                type="text"
                autoFocus
                maxLength={20}
                value={tempCategoryName}
                onChange={(event) => {
                  _setCategoryEdit(editingCategoryId, event.target.value)
                }}
                onBlur={(event) => onSubmitUpdateCategory(event)}
              />
            ) : (
              category.name
            )}
          </form>
          <div
            data-testid={TestID.MOVE_CATEGORY}
            className={optionsId === category.id ? 'category-options active' : 'category-options'}
            onClick={(event) => handleCategoryMenuClick(event, category.id)}
          >
            <MoreHorizontal size={15} className="context-menu-action" />
          </div>
          {optionsId === category.id && (
            <ContextMenu
              contextMenuRef={contextMenuRef}
              item={category}
              optionsPosition={optionsPosition}
              setOptionsId={setOptionsId}
              type={ContextMenuEnum.CATEGORY}
            />
          )}
        </div>
      )}
    </Draggable>
  )
}
