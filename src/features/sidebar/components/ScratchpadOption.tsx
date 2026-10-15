import { UnstyledButton, Box } from '@mantine/core';
import { FcDocument } from 'react-icons/fc';

import { Folder } from '@/utils/enums';

export interface ScratchpadOptionProps {
  active: boolean;
  swapFolder: (folder: Folder) => void;
}

export const ScratchpadOption = ({ active, swapFolder }: ScratchpadOptionProps) => {
  return (
    <UnstyledButton
      onClick={() => {
        swapFolder(Folder.SCRATCHPAD);
      }}
      styles={{
        root: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: active ? 'white' : '#d0d0d0',
          backgroundColor: active ? '#202020' : 'transparent',
          border: '1px solid transparent',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover': {
            backgroundColor: '#3a3a3a',
            color: 'white',
          },
        },
      }}>
      <Box mr="0.75rem" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <FcDocument size={20} />
      </Box>
      Scratchpad
    </UnstyledButton>
  );
};
