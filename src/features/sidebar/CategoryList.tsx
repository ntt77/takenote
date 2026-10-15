import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Group, Box, UnstyledButton } from '@mantine/core';

import { CategoryOption } from '@/features/sidebar/CategoryOption';
import { ReactSubmitEvent } from '@/types';
import { AddCategoryForm } from '@/features/sidebar/components/AddCategoryForm';
import { CollapseCategoryListButton } from '@/features/sidebar/components/CollapseCategoryButton';
import { useCategoriesStore } from '@/store';
import { FcPlus } from 'react-icons/fc';

export const CategoryList = () => {
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
      <style>{`
        .category-option-item {
          cursor: pointer;
          padding: 0.45rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #d0d0d0;
          background-color: transparent;
          border: 1px dashed transparent;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .category-option-item:hover {
          background-color: #3a3a3a;
          color: white;
        }
        .category-option-item.active {
          background-color: #202020;
          color: white;
          font-weight: 600;
        }
        .category-option-item.dragged-over {
          background-color: #202020;
          border: 1px dashed #5183f5;
        }
        .category-option-item.dragging {
          background-color: #131313;
          box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.15);
        }
      `}</style>
      <Group justify="space-between" align="center" mt="md" px="md" py={6}>
        <CollapseCategoryListButton
          handler={() => setCategoryListOpen(!isCategoryListOpen)}
          label="Collapse Category List"
          isCategoryListOpen={isCategoryListOpen}
          showIcon={categories.length > 0}
        />
      </Group>
      {isCategoryListOpen && (
        <>
          <Droppable type="CATEGORY" droppableId="Category list">
            {(droppableProvided) => (
              <Box {...droppableProvided.droppableProps} ref={droppableProvided.innerRef} aria-label="Category list">
                {categories.map((category, index) => (
                  <CategoryOption key={category.id} index={index} category={category} onSubmitUpdateCategory={onSubmitUpdateCategory} />
                ))}
                {droppableProvided.placeholder}
              </Box>
            )}
          </Droppable>
          {!addingTempCategory && (
            <UnstyledButton
              onClick={() => onAddCategory(true)}
              styles={{
                root: {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  color: '#9e9e9e',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderLeft: 'none',
                  borderRight: 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}>
              <FcPlus size={18} />
              <span>New category</span>
            </UnstyledButton>
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
