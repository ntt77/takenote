import React from 'react';
import { Select, Box } from '@radix-ui/themes';

import { TestID } from '@/constants/TestID';
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

  return (
    <Box p="2" data-testid={TestID.MOVE_TO_CATEGORY}>
      <Select.Root onValueChange={(value) => onChange({ target: { value } })}>
        <Select.Trigger placeholder="Move to category..." style={{ width: '100%' }} />
        <Select.Content position="popper">
          {filteredCategories.map((category) => (
            <Select.Item key={category.id} value={category.id}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Box>
  );
};
