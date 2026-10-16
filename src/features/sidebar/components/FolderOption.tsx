import React, { useState } from 'react';
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

export const FolderOption: React.FC<FolderOptionProps> = ({ text, active, folder, swapFolder, addNoteType }) => {
  const [mainSectionDragState, setMainSectionDragState] = useState({
    [Folder.ALL]: false,
    [Folder.FAVORITES]: false,
    [Folder.SCRATCHPAD]: false,
    [Folder.TRASH]: false,
    [Folder.CATEGORY]: false,
  });
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

  const determineClass = () => {
    if (active) {
      return 'app-sidebar-link active';
    } else if (mainSectionDragState[folder]) {
      return 'app-sidebar-link dragged-over';
    } else {
      return 'app-sidebar-link';
    }
  };

  const renderIcon = () => {
    if (folder === 'FAVORITES') {
      return <FcRating size={20} className="app-sidebar-icon" />;
    } else if (folder === 'ALL') {
      return <FcBookmark size={20} className="app-sidebar-icon" />;
    } else {
      return <FcFullTrash size={20} className="app-sidebar-icon" />;
    }
  };

  return (
    <button
      onClick={() => {
        swapFolder(folder);
      }}
      className="app-sidebar-wrapper">
      <div
        className={determineClass()}
        onDrop={noteHandler}
        onDragOver={(event: ReactDragEvent) => {
          event.preventDefault();
        }}
        onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}>
        {renderIcon()}
        {text}
      </div>
    </button>
  );
};
