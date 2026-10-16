import React from 'react';

import { ReactSubmitEvent } from '@/types';

export interface AddCategoryFormProps {
  submitHandler: (event: ReactSubmitEvent) => void;
  changeHandler: (editingCategoryId: string, value: string) => void;
  resetHandler: () => void;
  editingCategoryId: string;
  tempCategoryName: string;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ submitHandler, changeHandler, resetHandler, editingCategoryId, tempCategoryName }) => {
  return (
    <form className="category-form" onSubmit={submitHandler}>
      <input
        aria-label="Category name"
        type="text"
        autoFocus
        maxLength={20}
        placeholder="New category..."
        onChange={(event) => {
          changeHandler(editingCategoryId, event.target.value);
        }}
        onBlur={(event) => {
          if (!tempCategoryName || tempCategoryName.trim() === '') {
            resetHandler();
          } else {
            submitHandler(event);
          }
        }}
      />
    </form>
  );
};
