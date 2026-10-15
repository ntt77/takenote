import React, { MouseEventHandler } from 'react';
import { Tooltip } from '@radix-ui/themes';

export interface NoteListButtonProps {
  dataTestID: string;
  disabled?: boolean;
  handler: MouseEventHandler;
  label: string;
}

export const NoteListButton: React.FC<NoteListButtonProps> = ({ dataTestID, disabled = false, handler, label }) => {
  return (
    <Tooltip content={label}>
      <button data-testid={dataTestID} className="list-button" aria-label={label} onClick={handler} disabled={disabled}>
        {label}
      </button>
    </Tooltip>
  );
};
