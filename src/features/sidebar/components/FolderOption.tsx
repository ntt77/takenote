import { useState } from 'react';
import { UnstyledButton, Box } from '@mantine/core';
import { FcRating, FcBookmark, FcFullTrash } from 'react-icons/fc';

import { Folder } from '@/utils/enums';
import { ReactDragEvent } from '@/types';

export interface FolderOptionProps {
  text: string;
  active: boolean;
  folder: Folder;
  swapFolder: (folder: Folder) => void;
  addNoteType: (noteId: string) => void;
}

export const FolderOption = ({ text, active, folder, swapFolder, addNoteType }: FolderOptionProps) => {
  const [mainSectionDragState, setMainSectionDragState] = useState({
    [Folder.ALL]: false,
    [Folder.FAVORITES]: false,
    [Folder.SCRATCHPAD]: false,
    [Folder.TRASH]: false,
    [Folder.CATEGORY]: false,
  });

  const isDraggedOver = mainSectionDragState[folder];

  const dragEnterHandler = () => {
    setMainSectionDragState({ ...mainSectionDragState, [folder]: true });
  };
  const dragLeaveHandler = () => {
    setMainSectionDragState({ ...mainSectionDragState, [folder]: false });
  };
  const noteHandler = (event: ReactDragEvent) => {
    event.preventDefault();

    addNoteType(event.dataTransfer.getData('text'));
    dragLeaveHandler();
  };

  const renderIcon = () => {
    if (folder === 'FAVORITES') {
      return <FcRating size={20} />;
    } else if (folder === 'ALL') {
      return <FcBookmark size={20} />;
    } else {
      return <FcFullTrash size={20} />;
    }
  };

  return (
    <UnstyledButton
      onClick={() => {
        swapFolder(folder);
      }}
      onDrop={noteHandler}
      onDragOver={(event: ReactDragEvent) => {
        event.preventDefault();
      }}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      styles={{
        root: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: active ? 'white' : '#d0d0d0',
          backgroundColor: active ? '#202020' : isDraggedOver ? '#202020' : 'transparent',
          border: isDraggedOver ? '1px dashed #5183f5' : '1px solid transparent',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover': {
            backgroundColor: '#3a3a3a',
            color: 'white',
          },
        },
      }}>
      <Box mr="0.75rem" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {renderIcon()}
      </Box>
      {text}
    </UnstyledButton>
  );
};
