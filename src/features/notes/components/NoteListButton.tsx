import React, { MouseEventHandler } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { MdDelete } from 'react-icons/md';

export interface NoteListButtonProps {
  disabled?: boolean;
  handler: MouseEventHandler;
  label: string;
}

export const NoteListButton: React.FC<NoteListButtonProps> = ({ disabled = false, handler, label }) => {
  return (
    <Tooltip label={label} withArrow position="bottom">
      <Button
        color="red"
        variant="light"
        size="xs"
        leftSection={<MdDelete size={15} />}
        onClick={handler}
        disabled={disabled}
        style={{
          flexShrink: 0,
          marginLeft: '0.5rem',
          height: 30,
          whiteSpace: 'nowrap',
          fontWeight: 600,
          fontSize: '0.78rem',
          padding: '0 10px',
          borderRadius: '6px',
        }}>
        {label}
      </Button>
    </Tooltip>
  );
};

