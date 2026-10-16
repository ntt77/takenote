import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';

import { CategoryOption } from '@/features/sidebar/CategoryOption';
import { ReactSubmitEvent } from '@/types';
import { AddCategoryForm } from '@/features/sidebar/components/AddCategoryForm';
import { AddCategoryButton } from '@/features/sidebar/components/AddCategoryButton';
import { CollapseCategoryListButton } from '@/features/sidebar/components/CollapseCategoryButton';
import { useCategoriesStore } from '@/store';
import { FcPlus } from 'react-icons/fc';

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
  } = useCategoriesStore();

  const _setCategoryEdit = (categoryId: string, tempName: string) => setCategoryEdit({ id: categoryId, tempName });

  // ===========================================================================
  // State
  // ===========================================================================

  const [isCategoryListOpen, setCategoryListOpen] = useState(true);

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const onAddCategory = (adding: boolean) => {
    setCategoryListOpen(true);
    setAddingTempCategory(adding);
  };

  const resetTempCategory = () => {
    setAddingTempCategory(false);
    _setCategoryEdit('', '');
  };

  const onSubmitUpdateCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault();

    const category = { id: editingCategoryId, name: tempCategoryName.trim(), draggedOver: false };

    if (categories.find((cat) => cat.name === category.name) || category.name === '') {
      resetTempCategory();
    } else {
      updateCategory(category);
      resetTempCategory();
    }
  };

  const onSubmitNewCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault();

    const category = { id: crypto.randomUUID(), name: tempCategoryName.trim(), draggedOver: false };

    if (categories.find((cat) => cat.name === category.name) || category.name === '') {
      resetTempCategory();
    } else {
      addCategory(category);
      resetTempCategory();
    }
  };

  return (
    <>
      <div className="category-title">
        <CollapseCategoryListButton
          handler={() => setCategoryListOpen(!isCategoryListOpen)}
          label="Collapse Category List"
          isCategoryListOpen={isCategoryListOpen}
          showIcon={categories.length > 0}
        />
        <AddCategoryButton handler={onAddCategory} label="Add category" />
      </div>
      {isCategoryListOpen && (
        <>
          <Droppable type="CATEGORY" droppableId="Category list">
            {(droppableProvided) => (
              <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef} className="category-list" aria-label="Category list">
                {categories.map((category, index) => (
                  <CategoryOption key={category.id} index={index} category={category} onSubmitUpdateCategory={onSubmitUpdateCategory} />
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
          {categories.length === 0 && !addingTempCategory && (
            <div
              className="category-empty-state"
              onClick={() => onAddCategory(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddCategory(true);
                }
              }}>
              <FcPlus size={16} />
              <span>New category</span>
            </div>
          )}
          {addingTempCategory && (
            <AddCategoryForm
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
  );
};
