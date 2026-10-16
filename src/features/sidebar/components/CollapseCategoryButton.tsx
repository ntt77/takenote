import React from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { FcFolder } from 'react-icons/fc';

export interface CollapseCategoryListButtonProps {
  handler: () => void;
  label: string;
  isCategoryListOpen: boolean;
  showIcon: boolean;
}

export const CollapseCategoryListButton: React.FC<CollapseCategoryListButtonProps> = ({ handler, label, isCategoryListOpen, showIcon }) => {
  return (
    <button className="collapse-button" onClick={handler} aria-label={label}>
      {showIcon ? isCategoryListOpen ? <MdKeyboardArrowDown size={20} /> : <MdKeyboardArrowRight size={20} /> : <FcFolder size={16} />}
      <h2>Categories</h2>
    </button>
  );
};
