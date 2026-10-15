import React from 'react';
import { Tooltip } from '@radix-ui/themes';
import { Plus } from '@/icons';

import { iconColor } from '@/utils/constants';

export interface AddCategoryButtonProps {
  dataTestID: string;
  handler: (adding: boolean) => void;
  label: string;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ dataTestID, handler, label }) => {
  return (
    <Tooltip content={label}>
      <button data-testid={dataTestID} className="category-button" onClick={() => handler(true)} aria-label={label}>
        <Plus size={16} color={iconColor} />
      </button>
    </Tooltip>
  );
};
