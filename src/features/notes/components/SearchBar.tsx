import React from 'react';
import { TextField } from '@radix-ui/themes';

import { Search } from '@/icons';
import { TestID } from '@/constants/TestID';

export interface SearchBarProps {
  searchRef: React.MutableRefObject<HTMLInputElement>;
  searchNotes: (searchValue: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchRef, searchNotes }) => {
  return (
    <TextField.Root
      ref={searchRef}
      data-testid={TestID.NOTE_SEARCH}
      type="search"
      placeholder="Search for notes"
      size="2"
      variant="surface"
      style={{ width: '100%' }}
      onChange={(event) => {
        event.preventDefault();
        searchNotes(event.target.value);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}>
      <TextField.Slot>
        <Search size={15} />
      </TextField.Slot>
    </TextField.Root>
  );
};
