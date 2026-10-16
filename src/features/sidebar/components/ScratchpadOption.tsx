import React from 'react';
import { FcDocument } from 'react-icons/fc';

import { Folder } from '@/utils/enums';

export interface ScratchpadOptionProps {
  active: boolean;
  swapFolder: (folder: Folder) => void;
}

export const ScratchpadOption: React.FC<ScratchpadOptionProps> = ({ active, swapFolder }) => {
  return (
    <button
      onClick={() => {
        swapFolder(Folder.SCRATCHPAD);
      }}
      className="app-sidebar-wrapper">
      <div className={`app-sidebar-link ${active ? 'active' : ''}`}>
        <FcDocument size={20} className="app-sidebar-icon" />
        Scratchpad
      </div>
    </button>
  );
};
