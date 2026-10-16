import React from 'react';
import { Select, Box } from '@mantine/core';

import { NoteItem, CategoryItem } from '@/types';
import { isDraftNote } from '@/utils/helpers';

export interface SelectCategoryProps {
  onChange: (event: { target: { value: string } }) => void;
  categories: CategoryItem[];
  note: NoteItem;
  activeCategoryId: string;
}

export const SelectCategory: React.FC<SelectCategoryProps> = ({ onChange, categories, note, activeCategoryId }) => {
  const filteredCategories = categories.filter(({ id }) => id !== activeCategoryId).filter((category) => category.id !== note.category);

  if (note.trash || isDraftNote(note) || filteredCategories.length === 0) {
    return null;
  }

  const selectData = filteredCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <Box p="xs">
      <Select
        placeholder="Move to category..."
        size="xs"
        data={selectData}
        onChange={(value) => value && onChange({ target: { value } })}
        allowDeselect={false}
        comboboxProps={{ withinPortal: true }}
      />
    </Box>
  );
};
