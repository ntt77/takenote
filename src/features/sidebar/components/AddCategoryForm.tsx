import { Box, TextInput } from '@mantine/core';

import { ReactSubmitEvent } from '@/types';

export interface AddCategoryFormProps {
  submitHandler: (event: ReactSubmitEvent) => void;
  changeHandler: (editingCategoryId: string, value: string) => void;
  resetHandler: () => void;
  editingCategoryId: string;
  tempCategoryName: string;
}

export const AddCategoryForm = ({ submitHandler, changeHandler, resetHandler, editingCategoryId, tempCategoryName }: AddCategoryFormProps) => {
  return (
    <Box component="form" onSubmit={submitHandler} style={{ width: '100%', padding: '0.45rem 1rem' }}>
      <TextInput
        aria-label="Category name"
        autoFocus
        size="xs"
        maxLength={20}
        placeholder="New category..."
        value={tempCategoryName}
        onChange={(event) => {
          changeHandler(editingCategoryId, event.currentTarget.value);
        }}
        onBlur={(event) => {
          if (!tempCategoryName || tempCategoryName.trim() === '') {
            resetHandler();
          } else {
            submitHandler(event);
          }
        }}
        styles={{
          root: {
            width: '100%',
          },
          wrapper: {
            width: '100%',
          },
          input: {
            width: '100%',
            backgroundColor: '#202020',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            color: '#eee',
            fontSize: '0.85rem',
            height: '28px',
            minHeight: '28px',
            borderRadius: '4px',
            padding: '0 8px',
            '&:focus': {
              borderColor: '#5183f5',
            },
          },
        }}
      />
    </Box>
  );
};
