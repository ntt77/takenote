import React from 'react';
import { Kbd } from '@radix-ui/themes';

export const EmptyEditor: React.FC = () => {
  return (
    <div className="empty-editor v-center" data-testid="empty-editor">
      <div className="text-center">
        <p>
          <strong>Create a note</strong>
        </p>
        <p>
          <Kbd size="2">CTRL</Kbd> + <Kbd size="2">ALT</Kbd> + <Kbd size="2">N</Kbd>
        </p>
      </div>
    </div>
  );
};
