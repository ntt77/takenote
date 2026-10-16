import React from 'react';
import { Tooltip } from '@mantine/core';
import { FcPlus } from 'react-icons/fc';

export interface AddCategoryButtonProps {
  handler: (adding: boolean) => void;
  label: string;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ handler, label }) => {
  return (
    <Tooltip label={label} withArrow position="right" openDelay={200}>
      <button type="button" className="add-category-button" onClick={() => handler(true)} aria-label={label}>
        <FcPlus size={16} />
      </button>
    </Tooltip>
  );
};
