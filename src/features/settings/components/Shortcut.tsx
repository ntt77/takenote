import React from 'react';
import { Kbd } from '@radix-ui/themes';

export interface ShortcutProps {
  action: string;
  letter: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ action, letter }) => {
  return (
    <div className="settings-shortcut">
      <div>{action}</div>
      <div className="keys">
        <Kbd size="2">CTRL</Kbd> + <Kbd size="2">ALT</Kbd> + <Kbd size="2">{letter}</Kbd>
      </div>
    </div>
  );
};
