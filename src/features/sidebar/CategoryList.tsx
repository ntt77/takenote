import React, { useRef, useState, useEffect } from 'react'
import { Droppable } from '@hello-pangea/dnd'

import { LabelText } from '@/constants/LabelText'
import { TestID } from '@/constants/TestID'
import { CategoryOption } from '@/features/sidebar/CategoryOption'
import { shouldOpenContextMenu } from '@/utils/helpers'
import { ReactMouseEvent, ReactSubmitEvent } from '@/types'
import { AddCategoryForm } from '@/features/sidebar/components/AddCategoryForm'
import { AddCategoryButton } from '@/features/sidebar/components/AddCategoryButton'
import { CollapseCategoryListButton } from '@/features/sidebar/components/CollapseCategoryButton'
import { useCategoriesStore } from '@/store'

export const CategoryList: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const {
    categories,
    editingCategory: { id: editingCategoryId, tempName: tempCategoryName },
    setCategoryEdit,
    updateCategory,
    addCategory,
    addingTempCategory,
    setAddingTempCategory,
  } = useCategoriesStore()

  const _setCategoryEdit = (categoryId: string, tempName: string) =>
    setCategoryEdit({ id: categoryId, tempName })

  // ===========================================================================
  // Refs
  // ===========================================================================

  const contextMenuRef = useRef<HTMLDivElement>(null)

  // ===========================================================================
  // State
  // ===========================================================================

  const [optionsId, setOptionsId] = useState('')
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0 })
  const [isCategoryListOpen, setCategoryListOpen] = useState(true)

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const onAddCategory = (adding: boolean) => {
    setCategoryListOpen(true)
    setAddingTempCategory(adding)
  }

  const handleCategoryMenuClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId: string = ''
  ) => {
    const clicked = event.target

    if (!clicked) return

    if (shouldOpenContextMenu(clicked as Element)) {
      if ('clientX' in event && 'clientY' in event) {
        setOptionsPosition({ x: event.clientX, y: event.clientY })
      }
    }

    event.stopPropagation()

    if (!contextMenuRef?.current?.contains(clicked as HTMLDivElement)) {
      setOptionsId(!optionsId || optionsId !== categoryId ? categoryId : '')
    }
  }

  const handleCategoryRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId: string = ''
  ) => {
    event.preventDefault()
    handleCategoryMenuClick(event, categoryId)
  }

  const resetTempCategory = () => {
    setAddingTempCategory(false)
    _setCategoryEdit('', '')
  }

  const onSubmitUpdateCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = { id: editingCategoryId, name: tempCategoryName.trim(), draggedOver: false }

    if (categories.find((cat) => cat.name === category.name) || category.name === '') {
      resetTempCategory()
    } else {
      updateCategory(category)
      resetTempCategory()
    }
  }

  const onSubmitNewCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = { id: crypto.randomUUID(), name: tempCategoryName.trim(), draggedOver: false }

    if (categories.find((cat) => cat.name === category.name) || category.name === '') {
      resetTempCategory()
    } else {
      addCategory(category)
      resetTempCategory()
    }
  }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    document.addEventListener('mousedown', handleCategoryMenuClick)

    return () => {
      document.removeEventListener('mousedown', handleCategoryMenuClick)
    }
  })

  return (
    <>
      <div className="category-title">
        <CollapseCategoryListButton
          dataTestID={TestID.CATEGORY_COLLAPSE_BUTTON}
          handler={() => setCategoryListOpen(!isCategoryListOpen)}
          label={LabelText.COLLAPSE_CATEGORY}
          isCategoryListOpen={isCategoryListOpen}
          showIcon={categories.length > 0}
        />
        <AddCategoryButton
          dataTestID={TestID.ADD_CATEGORY_BUTTON}
          handler={onAddCategory}
          label={LabelText.ADD_CATEGORY}
        />
      </div>
      {isCategoryListOpen && (
        <>
          <Droppable type="CATEGORY" droppableId="Category list">
            {(droppableProvided) => (
              <div
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                className="category-list"
                aria-label="Category list"
              >
                {categories.map((category, index) => (
                  <CategoryOption
                    key={category.id}
                    index={index}
                    category={category}
                    contextMenuRef={contextMenuRef}
                    handleCategoryMenuClick={handleCategoryMenuClick}
                    handleCategoryRightClick={handleCategoryRightClick}
                    onSubmitUpdateCategory={onSubmitUpdateCategory}
                    optionsId={optionsId}
                    setOptionsId={setOptionsId}
                    optionsPosition={optionsPosition}
                  />
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
          {addingTempCategory && (
            <AddCategoryForm
              dataTestID={TestID.NEW_CATEGORY_FORM}
              submitHandler={onSubmitNewCategory}
              changeHandler={_setCategoryEdit}
              resetHandler={resetTempCategory}
              editingCategoryId={editingCategoryId}
              tempCategoryName={tempCategoryName}
            />
          )}
        </>
      )}
    </>
  )
}
