import React from 'react';
import { TextInput } from '@mantine/core';

import { FcSearch } from 'react-icons/fc';

export interface SearchBarProps {
  searchRef: React.MutableRefObject<HTMLInputElement>;
  searchNotes: (searchValue: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchRef, searchNotes }) => {
  return (
    <TextInput
      ref={searchRef}
      type="search"
      placeholder="Search for notes"
      size="xs"
      leftSection={<FcSearch size={16} />}
      style={{ width: '100%', flex: 1, minWidth: 0 }}
      onChange={(event) => {
        event.preventDefault();
        searchNotes(event.target.value);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    />
  );
};
