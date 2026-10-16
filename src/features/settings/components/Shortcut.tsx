import React from 'react';
import { Kbd } from '@mantine/core';

export interface ShortcutProps {
  action: string;
  letter: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ action, letter }) => {
  return (
    <div className="settings-shortcut">
      <div>{action}</div>
      <div className="keys">
        <Kbd size="sm">CTRL</Kbd> + <Kbd size="sm">ALT</Kbd> + <Kbd size="sm">{letter}</Kbd>
      </div>
    </div>
  );
};
